import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../db/clientPostgres.js', () => ({
    default: { query: vi.fn() },
}));

vi.mock('uuid', () => ({ v4: vi.fn(() => 'mock-uuid') }));

import db from '../../db/clientPostgres.js';
import { AuditLogRepository } from '../../repositories/auditLogRepository.js';

describe('AuditLogRepository', () => {
    const repo = new AuditLogRepository();

    beforeEach(() => {
        db.query.mockReset();
    });

    it('log() inserts a row with the generated id and given fields', async () => {
        db.query.mockResolvedValue({ rows: [] });

        await repo.log({
            actorId: 'admin-1',
            actorUsername: 'root',
            action: 'update_role',
            targetUserId: 'user-1',
            targetUsername: 'jane',
            metadata: { previousRole: 'user', newRole: 'admin' },
        });

        const [queryText, params] = db.query.mock.calls[0];
        expect(queryText).toMatch(/INSERT INTO audit_log/);
        expect(params).toEqual([
            'mock-uuid', 'admin-1', 'root', 'update_role', 'user-1', 'jane',
            { previousRole: 'user', newRole: 'admin' },
        ]);
    });

    it('findRecent() maps rows to camelCase and orders by newest first', async () => {
        db.query.mockResolvedValue({
            rows: [{
                id: 'log-1', actor_id: 'admin-1', actor_username: 'root', action: 'delete_user',
                target_user_id: 'user-1', target_username: 'jane', metadata: null, created_at: '2026-01-01T00:00:00.000Z',
            }],
        });

        const entries = await repo.findRecent(10);

        expect(entries).toEqual([{
            id: 'log-1', actorId: 'admin-1', actorUsername: 'root', action: 'delete_user',
            targetUserId: 'user-1', targetUsername: 'jane', metadata: null, createdAt: '2026-01-01T00:00:00.000Z',
        }]);
        const [queryText, params] = db.query.mock.calls[0];
        expect(queryText).toMatch(/ORDER BY created_at DESC/);
        expect(params).toEqual([10]);
    });
});
