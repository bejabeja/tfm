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

    // Regression: count used to be `count + 1` only when the new actor differed from the
    // *previous* actor_id, so A, B, A within the window counted 3 distinct actors instead
    // of 2. The fold query must track the full set of actors, not just the last one.
    it('tracks distinct actors via an accumulating array, not just the previous actor', async () => {
        client.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id: 'existing-1' }] });

        await repo.create({ userId: 'u1', actorId: 'actor-2', type: 'like', itineraryId: 'itin-1' });

        const foldQuery = client.query.mock.calls[0][0];
        expect(foldQuery).toMatch(/array_append\(actor_ids/);
        expect(foldQuery).toMatch(/=\s*ANY\(actor_ids\)/);
        // the window check must stay tied to created_at (first event), and created_at
        // must never be reassigned on fold, or the window slides forward indefinitely
        expect(foldQuery).toMatch(/created_at > NOW\(\)/);
        expect(foldQuery).not.toMatch(/created_at\s*=\s*NOW\(\)/);
    });
});

describe('NotificationsRepository.getByUserId()', () => {
    const repo = new NotificationsRepository();

    beforeEach(() => {
        client.query.mockReset();
    });

    it('derives count from the number of distinct actors, not a stored counter', async () => {
        client.query.mockResolvedValueOnce({
            rows: [{
                id: 'n1', type: 'like', is_read: false,
                last_activity_at: new Date(), actor_ids: ['a1', 'a2', 'a3'],
                actor_id: 'a3', actor_username: 'jane', actor_avatar_url: null,
                itinerary_id: 'itin-1', itinerary_title: 'Trip',
            }],
        });

        const [notification] = await repo.getByUserId('u1');

        expect(notification.count).toBe(3);
    });

    it('falls back to a count of 1 when actor_ids is empty or missing', async () => {
        client.query.mockResolvedValueOnce({
            rows: [{
                id: 'n1', type: 'follow', is_read: false,
                last_activity_at: new Date(), actor_ids: null,
                actor_id: 'a1', actor_username: 'jane', actor_avatar_url: null,
                itinerary_id: null, itinerary_title: null,
            }],
        });

        const [notification] = await repo.getByUserId('u1');

        expect(notification.count).toBe(1);
    });

    it('exposes commentId so the client can deep-link to the specific comment', async () => {
        client.query.mockResolvedValueOnce({
            rows: [{
                id: 'n1', type: 'comment', is_read: false,
                last_activity_at: new Date(), actor_ids: ['a1'], comment_id: 'c1',
                actor_id: 'a1', actor_username: 'jane', actor_avatar_url: null,
                itinerary_id: 'itin-1', itinerary_title: 'Trip',
            }],
        });

        const [notification] = await repo.getByUserId('u1');

        expect(notification.commentId).toBe('c1');
    });
});
