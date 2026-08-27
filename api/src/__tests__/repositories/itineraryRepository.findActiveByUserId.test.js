import { describe, it, expect, vi } from 'vitest';

vi.mock('../../db/clientPostgres.js', () => ({
    default: { query: vi.fn() },
}));

vi.mock('uuid', () => ({ v4: vi.fn(() => 'mock-uuid') }));

import client from '../../db/clientPostgres.js';
import { ItineraryRepository } from '../../repositories/itineraryRepository.js';

describe('ItineraryRepository.findActiveByUserId()', () => {
    const repo = new ItineraryRepository();

    it('only matches public itineraries whose date range covers today', async () => {
        client.query.mockResolvedValue({ rows: [] });

        await repo.findActiveByUserId('user-1');

        const [queryText, params] = client.query.mock.calls[0];
        expect(queryText).toMatch(/is_public\s*=\s*true/);
        expect(queryText).toMatch(/CURRENT_DATE\s+BETWEEN\s+start_date\s+AND\s+end_date/);
        expect(params).toEqual(['user-1']);
    });

    it('returns null when the user has no trip in progress', async () => {
        client.query.mockResolvedValue({ rows: [] });

        const result = await repo.findActiveByUserId('user-1');

        expect(result).toBeNull();
    });

    it('returns the in-progress itinerary when one exists', async () => {
        client.query.mockResolvedValue({
            rows: [{
                id: 'trip-1', user_id: 'user-1', title: 'Roman holiday',
                start_date: '2026-08-20', end_date: '2026-08-30',
                is_public: true, category: 'city',
            }],
        });

        const result = await repo.findActiveByUserId('user-1');

        expect(result.id).toBe('trip-1');
        expect(result.title).toBe('Roman holiday');
    });
});
