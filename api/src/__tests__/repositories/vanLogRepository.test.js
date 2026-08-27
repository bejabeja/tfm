import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../db/clientPostgres.js', () => ({
    default: { query: vi.fn() },
}));

vi.mock('uuid', () => ({ v4: vi.fn(() => 'mock-uuid') }));

import client from '../../db/clientPostgres.js';
import { VanLogRepository } from '../../repositories/vanLogRepository.js';

describe('VanLogRepository', () => {
    const repo = new VanLogRepository();

    beforeEach(() => {
        client.query.mockReset();
    });

    it('creates an entry with the generated id and scoped to the given user', async () => {
        client.query.mockResolvedValue({
            rows: [{
                id: 'mock-uuid', user_id: 'user-1', category: 'gas_bottle', title: null,
                amount: '25.50', currency: 'EUR', location_name: null, location_country: null,
                location_label: null, latitude: null, longitude: null, notes: null,
                entry_date: '2026-08-27', created_at: null, updated_at: null,
            }],
        });

        const entry = await repo.create({
            userId: 'user-1', category: 'gas_bottle', amount: 25.5, currency: 'EUR', entryDate: '2026-08-27',
        });

        expect(entry.id).toBe('mock-uuid');
        expect(entry.amount).toBe(25.5);
        const [, params] = client.query.mock.calls[0];
        expect(params[0]).toBe('mock-uuid');
        expect(params[1]).toBe('user-1');
    });

    it('only fetches entries belonging to the requested user', async () => {
        client.query.mockResolvedValue({ rows: [] });

        await repo.findByUserId('user-1');

        const [queryText, params] = client.query.mock.calls[0];
        expect(queryText).toMatch(/WHERE user_id = \$1/);
        expect(params).toEqual(['user-1']);
    });

    it('returns null when updating/finding a non-existent entry', async () => {
        client.query.mockResolvedValue({ rows: [] });

        const result = await repo.findById('missing-id');

        expect(result).toBeNull();
    });

    it('sums amounts and counts entries per category', async () => {
        client.query.mockResolvedValue({
            rows: [
                { category: 'fuel', total: '120.00', count: 3 },
                { category: 'groceries', total: '45.00', count: 2 },
            ],
        });

        const totals = await repo.getTotalsByCategory('user-1');

        expect(totals).toEqual([
            { category: 'fuel', total: 120, count: 3 },
            { category: 'groceries', total: 45, count: 2 },
        ]);
    });
});
