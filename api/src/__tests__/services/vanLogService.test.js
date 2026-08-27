import { describe, it, expect, beforeEach } from 'vitest';
import { VanLogService } from '../../services/vanLogService.js';

const makeEntry = (overrides = {}) => ({
    id: 'entry-1',
    userId: 'user-1',
    toDTO() { return { id: this.id, userId: this.userId, category: 'fuel' }; },
    ...overrides,
});

describe('VanLogService', () => {
    let repository;
    let service;

    beforeEach(() => {
        repository = {
            create: async (data) => makeEntry({ userId: data.userId }),
            findById: async () => makeEntry(),
            update: async () => makeEntry(),
            delete: async () => {},
            getTotalsByCategory: async () => [],
            getTotalsByCountry: async () => [],
        };
        service = new VanLogService(repository);
    });

    describe('updateEntry() / deleteEntry()', () => {
        it('throws NotFoundError when the entry does not exist', async () => {
            repository.findById = async () => null;

            await expect(service.updateEntry('missing', {}, 'user-1')).rejects.toThrow('Van log entry not found');
            await expect(service.deleteEntry('missing', 'user-1')).rejects.toThrow('Van log entry not found');
        });

        it('throws AuthError when the entry belongs to a different user', async () => {
            repository.findById = async () => makeEntry({ userId: 'someone-else' });

            await expect(service.updateEntry('entry-1', {}, 'user-1')).rejects.toThrow('Unauthorized');
            await expect(service.deleteEntry('entry-1', 'user-1')).rejects.toThrow('Unauthorized');
        });

        it('updates the entry when the requester owns it', async () => {
            const result = await service.updateEntry('entry-1', { category: 'water_fresh' }, 'user-1');

            expect(result.id).toBe('entry-1');
        });
    });

    describe('getStats()', () => {
        it('sums the per-category totals into a grand total', async () => {
            repository.getTotalsByCategory = async () => ([
                { category: 'fuel', total: 100, count: 2 },
                { category: 'groceries', total: 40, count: 1 },
            ]);

            const stats = await service.getStats('user-1');

            expect(stats.totalAmount).toBe(140);
            expect(stats.byCategory).toHaveLength(2);
        });

        it('returns a zero total when there are no entries', async () => {
            const stats = await service.getStats('user-1');

            expect(stats.totalAmount).toBe(0);
            expect(stats.byCategory).toEqual([]);
        });

        it('includes the per-country breakdown alongside the per-category one', async () => {
            repository.getTotalsByCountry = async () => ([
                { country: 'Germany', total: 65.4, count: 1 },
                { country: 'France', total: 30, count: 2 },
            ]);

            const stats = await service.getStats('user-1');

            expect(stats.byCountry).toEqual([
                { country: 'Germany', total: 65.4, count: 1 },
                { country: 'France', total: 30, count: 2 },
            ]);
        });
    });
});
