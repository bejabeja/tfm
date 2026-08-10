import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NotificationsService } from '../../services/notificationsService.js';

describe('NotificationsService.getNotifications()', () => {
    let service;
    let notificationsRepository;

    beforeEach(() => {
        notificationsRepository = {
            getByUserId: vi.fn().mockResolvedValue([]),
            getTotalCount: vi.fn().mockResolvedValue(0),
        };
        service = new NotificationsService(notificationsRepository);
    });

    it('computes totalPages from totalCount and the page size', async () => {
        notificationsRepository.getTotalCount.mockResolvedValue(45);

        const result = await service.getNotifications('user-1', 1, 20);

        expect(result.totalCount).toBe(45);
        expect(result.totalPages).toBe(3);
        expect(result.currentPage).toBe(1);
    });

    it('returns totalPages of 1 when there are no notifications', async () => {
        notificationsRepository.getTotalCount.mockResolvedValue(0);

        const result = await service.getNotifications('user-1', 1, 20);

        expect(result.totalPages).toBe(1);
    });

    it('passes the correct offset for subsequent pages', async () => {
        await service.getNotifications('user-1', 3, 20);

        expect(notificationsRepository.getByUserId).toHaveBeenCalledWith('user-1', 20, 40);
    });
});
