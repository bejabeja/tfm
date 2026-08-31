import { describe, it, expect, vi } from 'vitest';

vi.mock('../../db/clientPostgres.js', () => ({
    default: { query: vi.fn() },
}));

vi.mock('uuid', () => ({ v4: vi.fn(() => 'mock-uuid') }));

import client from '../../db/clientPostgres.js';
import { ItineraryRepository } from '../../repositories/itineraryRepository.js';

describe('ItineraryRepository.findImagePublicIdsByUserId()', () => {
    const repo = new ItineraryRepository();

    it('returns the public ids from both the itinerary cover photo and its gallery images', async () => {
        client.query.mockResolvedValue({
            rows: [{ photo_public_id: 'cover-1' }, { photo_public_id: 'gallery-1' }],
        });

        const publicIds = await repo.findImagePublicIdsByUserId('user-1');

        expect(publicIds).toEqual(['cover-1', 'gallery-1']);
        const [queryText, params] = client.query.mock.calls[0];
        expect(queryText).toMatch(/FROM itineraries/);
        expect(queryText).toMatch(/FROM itinerary_images/);
        expect(params).toEqual(['user-1']);
    });
});
