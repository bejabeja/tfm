import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../db/clientPostgres.js', () => ({
    default: { query: vi.fn() },
}));

vi.mock('uuid', () => ({ v4: vi.fn(() => 'mock-uuid') }));

import client from '../../db/clientPostgres.js';
import { ItineraryRepository } from '../../repositories/itineraryRepository.js';

describe('ItineraryRepository.findPublicSitemapEntries()', () => {
    const repo = new ItineraryRepository();

    beforeEach(() => {
        client.query.mockReset();
    });

    it('only queries public itineraries from non-test users', async () => {
        client.query.mockResolvedValue({ rows: [] });

        await repo.findPublicSitemapEntries();

        const [query] = client.query.mock.calls[0];
        expect(query).toMatch(/is_public = true/);
        expect(query).toMatch(/role != 'test'/);
    });

    it('maps rows to plain {id, updatedAt} entries', async () => {
        client.query.mockResolvedValue({
            rows: [{ id: 'itin-1', updated_at: '2026-01-01T00:00:00.000Z' }],
        });

        const entries = await repo.findPublicSitemapEntries();

        expect(entries).toEqual([{ id: 'itin-1', updatedAt: '2026-01-01T00:00:00.000Z' }]);
    });
});
