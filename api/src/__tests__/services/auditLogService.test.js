import { describe, it, expect, vi } from 'vitest';

vi.mock('@sentry/node', () => ({ captureException: vi.fn() }));

import * as Sentry from '@sentry/node';
import { AuditLogService } from '../../services/auditLogService.js';

describe('AuditLogService', () => {
    describe('log()', () => {
        it('forwards the event to the repository with defaults filled in', () => {
            const auditLogRepository = { log: vi.fn().mockResolvedValue() };
            const service = new AuditLogService(auditLogRepository);

            service.log({ action: 'login_success', actorId: 'user-1', actorUsername: 'jane' });

            expect(auditLogRepository.log).toHaveBeenCalledWith({
                actorId: 'user-1', actorUsername: 'jane', action: 'login_success',
                targetUserId: null, targetUsername: null, metadata: {},
                ipAddress: null, userAgent: null,
            });
        });

        it('forwards the request context when given', () => {
            const auditLogRepository = { log: vi.fn().mockResolvedValue() };
            const service = new AuditLogService(auditLogRepository);

            service.log({ action: 'login_success', ipAddress: '203.0.113.1', userAgent: 'Mozilla/5.0' });

            expect(auditLogRepository.log).toHaveBeenCalledWith(expect.objectContaining({
                ipAddress: '203.0.113.1', userAgent: 'Mozilla/5.0',
            }));
        });

        it('does not throw when the repository write fails (fire-and-forget)', async () => {
            const auditLogRepository = { log: vi.fn().mockRejectedValue(new Error('db down')) };
            const service = new AuditLogService(auditLogRepository);

            expect(() => service.log({ action: 'login_success' })).not.toThrow();
            // let the rejected promise's .catch() run before the test exits
            await new Promise((resolve) => setImmediate(resolve));
        });
    });

    describe('getFiltered()', () => {
        it('delegates to the repository and returns its result as-is', async () => {
            const paginatedResult = { entries: [{ id: 'log-1' }], total: 1 };
            const auditLogRepository = { findByFilters: vi.fn().mockResolvedValue(paginatedResult) };
            const service = new AuditLogService(auditLogRepository);

            const result = await service.getFiltered({ action: 'login_success', limit: 10 });

            expect(auditLogRepository.findByFilters).toHaveBeenCalledWith({ action: 'login_success', limit: 10 });
            expect(result).toBe(paginatedResult);
        });
    });

    describe('purgeOlderThan()', () => {
        it('delegates the deletion to the repository and returns the deleted count', async () => {
            const auditLogRepository = {
                deleteOlderThan: vi.fn().mockResolvedValue(42),
                log: vi.fn().mockResolvedValue(),
            };
            const service = new AuditLogService(auditLogRepository);

            const result = await service.purgeOlderThan(12);

            expect(auditLogRepository.deleteOlderThan).toHaveBeenCalledWith(12);
            expect(result).toBe(42);
        });

        it('self-audits the purge with the deleted count and trigger', async () => {
            const auditLogRepository = {
                deleteOlderThan: vi.fn().mockResolvedValue(5),
                log: vi.fn().mockResolvedValue(),
            };
            const service = new AuditLogService(auditLogRepository);

            await service.purgeOlderThan(12, { actorId: 'admin-1', actorUsername: 'root', ip: '203.0.113.1', trigger: 'manual' });

            expect(auditLogRepository.log).toHaveBeenCalledWith(expect.objectContaining({
                actorId: 'admin-1', actorUsername: 'root', action: 'audit_log_purged',
                metadata: { months: 12, deletedCount: 5, trigger: 'manual' },
                ipAddress: '203.0.113.1',
            }));
        });
    });

    // The audit trail is a GDPR accountability requirement (see CLAUDE.md): a
    // broken write can't just sit in application logs unnoticed.
    describe('write failure handling', () => {
        // lastAlertedAt is module-level state (shared across every AuditLogService
        // instance on purpose, see auditLogService.js), so each test that exercises
        // the alert cooldown needs its own fresh module instance.
        const freshService = async (...args) => {
            vi.resetModules();
            const { AuditLogService: FreshAuditLogService } = await import('../../services/auditLogService.js');
            return new FreshAuditLogService(...args);
        };

        it('reports the failure to Sentry', async () => {
            const auditLogRepository = { log: vi.fn() };
            const service = await freshService(auditLogRepository);

            await service._handleWriteFailure('login_success', new Error('db down'));

            expect(Sentry.captureException).toHaveBeenCalledWith(expect.objectContaining({ message: 'db down' }));
        });

        it('does not attempt to alert anyone when no userRepository/emailService is wired', async () => {
            const auditLogRepository = { log: vi.fn() };
            const service = await freshService(auditLogRepository);

            await expect(service._handleWriteFailure('login_success', new Error('db down'))).resolves.toBeUndefined();
        });

        it('emails every superadmin when the write fails', async () => {
            const auditLogRepository = { log: vi.fn() };
            const userRepository = { findByRole: vi.fn().mockResolvedValue([
                { email: 'root1@example.com' }, { email: 'root2@example.com' },
            ]) };
            const emailService = { sendAuditLogFailureAlert: vi.fn().mockResolvedValue() };
            const service = await freshService(auditLogRepository, userRepository, emailService);

            await service._handleWriteFailure('login_success', new Error('db down'));

            expect(userRepository.findByRole).toHaveBeenCalledWith('superadmin');
            expect(emailService.sendAuditLogFailureAlert).toHaveBeenCalledTimes(2);
            expect(emailService.sendAuditLogFailureAlert).toHaveBeenCalledWith(expect.objectContaining({
                to: 'root1@example.com', action: 'login_success', errorMessage: 'db down',
            }));
        });

        it('does not send a second alert within the cooldown window', async () => {
            const auditLogRepository = { log: vi.fn() };
            const userRepository = { findByRole: vi.fn().mockResolvedValue([{ email: 'root@example.com' }]) };
            const emailService = { sendAuditLogFailureAlert: vi.fn().mockResolvedValue() };
            const service = await freshService(auditLogRepository, userRepository, emailService);

            await service._handleWriteFailure('login_success', new Error('first failure'));
            await service._handleWriteFailure('login_failed', new Error('second failure'));

            expect(emailService.sendAuditLogFailureAlert).toHaveBeenCalledTimes(1);
        });

        it('does not let a failed alert email reject the caller', async () => {
            const auditLogRepository = { log: vi.fn() };
            const userRepository = { findByRole: vi.fn().mockResolvedValue([{ email: 'root@example.com' }]) };
            const emailService = { sendAuditLogFailureAlert: vi.fn().mockRejectedValue(new Error('brevo down')) };
            const service = await freshService(auditLogRepository, userRepository, emailService);

            await expect(service._handleWriteFailure('login_success', new Error('db down'))).resolves.toBeUndefined();
        });
    });
});
