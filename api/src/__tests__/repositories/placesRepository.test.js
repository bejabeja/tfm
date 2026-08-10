import { describe, it, expect, vi } from 'vitest';

vi.mock('../../db/clientPostgres.js', () => ({
    default: { query: vi.fn() },
}));

vi.mock('uuid', () => ({ v4: vi.fn(() => 'mock-uuid') }));

import client from '../../db/clientPostgres.js';
import { PlacesRepository } from '../../repositories/placesRepository.js';

const row = { id: 'place-1', title: 'Fushimi Inari', label: 'Fushimi Inari', latitude: 34.9, longitude: 135.7, category: 'monument' };

describe('PlacesRepository dayNumber propagation', () => {
    const repo = new PlacesRepository();

    it('insertPlace reports the place dayNumber, not the default', async () => {
        client.query.mockResolvedValue({ rows: [row] });

        const place = await repo.insertPlace({
            infoPlace: { name: 'Fushimi Inari', lat: 34.9, lon: 135.7 },
            category: 'monument',
            orderIndex: 0,
            dayNumber: 3,
            description: 'desc',
        });

        expect(place.dayNumber).toBe(3);
    });

    it('updatePlace reports the place dayNumber, not the default', async () => {
        client.query.mockResolvedValue({ rows: [row] });

        const place = await repo.updatePlace({
            id: 'place-1',
            infoPlace: { name: 'Fushimi Inari', lat: 34.9, lon: 135.7 },
            category: 'monument',
            orderIndex: 0,
            dayNumber: 2,
            description: 'desc',
        });

        expect(place.dayNumber).toBe(2);
    });
});
