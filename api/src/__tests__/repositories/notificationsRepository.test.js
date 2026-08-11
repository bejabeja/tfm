import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../db/clientPostgres.js', () => ({
    default: { query: vi.fn() },
}));

vi.mock('uuid', () => ({ v4: vi.fn(() => 'mock-uuid') }));

import client from '../../db/clientPostgres.js';
import { NotificationsRepository } from '../../repositories/notificationsRepository.js';

// Regression coverage for grouping: every like/comment/follow used to insert its own
// row, so a popular itinerary flooded the list with one row per like instead of
// "Jane and 4 others liked your trip".
describe('NotificationsRepository.create()', () => {
    const repo = new NotificationsRepository();

    beforeEach(() => {
        client.query.mockReset();
    });

    it('folds into an existing recent notification of the same type/itinerary instead of inserting a new row', async () => {
        client.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 'existing-1' }] });

        await repo.create({ userId: 'u1', actorId: 'actor-2', type: 'like', itineraryId: 'itin-1' });

        expect(client.query).toHaveBeenCalledTimes(1);
        expect(client.query.mock.calls[0][0]).toMatch(/UPDATE notifications/);
    });

    it('inserts a new row when there is nothing recent to fold into', async () => {
        client.query
            .mockResolvedValueOnce({ rowCount: 0, rows: [] })
            .mockResolvedValueOnce({ rowCount: 1 });

        await repo.create({ userId: 'u1', actorId: 'actor-2', type: 'like', itineraryId: 'itin-1' });

        expect(client.query).toHaveBeenCalledTimes(2);
        expect(client.query.mock.calls[1][0]).toMatch(/INSERT INTO notifications/);
    });
});
