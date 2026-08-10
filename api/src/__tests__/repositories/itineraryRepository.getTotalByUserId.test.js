import { describe, it, expect, vi } from 'vitest';

vi.mock('../../db/clientPostgres.js', () => ({
    default: { query: vi.fn() },
}));

vi.mock('uuid', () => ({ v4: vi.fn(() => 'mock-uuid') }));

import client from '../../db/clientPostgres.js';
import { ItineraryRepository } from '../../repositories/itineraryRepository.js';

describe('ItineraryRepository.getTotalByUserId()', () => {
    const repo = new ItineraryRepository();

    it('only counts public itineraries, matching what other users can actually see', async () => {
        client.query.mockResolvedValue({ rows: [{ total: '2' }] });

        const total = await repo.getTotalByUserId('user-1');

        expect(total).toBe(2);
        const [queryText] = client.query.mock.calls[0];
        expect(queryText).toMatch(/is_public\s*=\s*true/);
    });
});
