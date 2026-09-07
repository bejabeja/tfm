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

    it('passes price per liter through to the insert query', async () => {
        client.query.mockResolvedValue({
            rows: [{
                id: 'mock-uuid', user_id: 'user-1', category: 'fuel', title: null,
                amount: '60.00', currency: 'EUR', price_per_liter: '1.799',
                location_name: null, location_country: null, location_label: null,
                latitude: null, longitude: null, notes: null,
                entry_date: '2026-08-27', created_at: null, updated_at: null,
            }],
        });

        const entry = await repo.create({
            userId: 'user-1', category: 'fuel', amount: 60, currency: 'EUR',
            pricePerLiter: 1.799, entryDate: '2026-08-27',
        });

        expect(entry.pricePerLiter).toBe(1.799);
        const [queryText, params] = client.query.mock.calls[0];
        expect(queryText).toMatch(/price_per_liter/);
        expect(params).toContain(1.799);
    });

    it('only fetches entries belonging to the requested user', async () => {
        client.query.mockResolvedValue({ rows: [] });

        await repo.findByUserId('user-1');

        const [queryText, params] = client.query.mock.calls[0];
        expect(queryText).toMatch(/WHERE user_id = \$1/);
        expect(params).toEqual(['user-1']);
    });

    it('filters by category, country and date range when provided', async () => {
        client.query.mockResolvedValue({ rows: [] });

        await repo.findByUserId('user-1', {
            category: 'fuel', country: 'Germany', dateFrom: '2026-08-01', dateTo: '2026-08-31',
        });

        const [queryText, params] = client.query.mock.calls[0];
        expect(queryText).toMatch(/category = \$2/);
        expect(queryText).toMatch(/LOWER\(location_country\) = LOWER\(\$3\)/);
        expect(queryText).toMatch(/entry_date >= \$4::date/);
        expect(queryText).toMatch(/entry_date <= \$5::date/);
        expect(params).toEqual(['user-1', 'fuel', 'Germany', '2026-08-01', '2026-08-31']);
    });

    it('ignores filters that are not provided', async () => {
        client.query.mockResolvedValue({ rows: [] });

        await repo.findByUserId('user-1', { category: 'fuel' });

        const [queryText, params] = client.query.mock.calls[0];
        expect(queryText).not.toMatch(/location_country/);
        expect(queryText).not.toMatch(/entry_date [<>]/);
        expect(params).toEqual(['user-1', 'fuel']);
    });

    it('returns null when updating/finding a non-existent entry', async () => {
        client.query.mockResolvedValue({ rows: [] });

        const result = await repo.findById('missing-id');

        expect(result).toBeNull();
    });

    it('sums amounts, counts entries and reports the most recent date per category', async () => {
        client.query.mockResolvedValue({
            rows: [
                { category: 'fuel', total: '120.00', count: 3, last_date: '2026-08-20' },
                { category: 'groceries', total: '45.00', count: 2, last_date: '2026-08-25' },
            ],
        });

        const totals = await repo.getTotalsByCategory('user-1');

        expect(totals).toEqual([
            { category: 'fuel', total: 120, count: 3, lastDate: '2026-08-20' },
            { category: 'groceries', total: 45, count: 2, lastDate: '2026-08-25' },
        ]);
    });

    it('sums amounts and counts entries per country, excluding entries with no country', async () => {
        client.query.mockResolvedValue({
            rows: [
                { country: 'Germany', total: '65.40', count: 1 },
                { country: 'France', total: '30.00', count: 2 },
            ],
        });

        const totals = await repo.getTotalsByCountry('user-1');

        expect(totals).toEqual([
            { country: 'Germany', total: 65.4, count: 1 },
            { country: 'France', total: 30, count: 2 },
        ]);
        const [queryText] = client.query.mock.calls[0];
        expect(queryText).toMatch(/location_country IS NOT NULL/);
    });
});
