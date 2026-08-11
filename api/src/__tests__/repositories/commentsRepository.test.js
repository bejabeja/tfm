import { describe, it, expect, vi } from 'vitest';

vi.mock('../../db/clientPostgres.js', () => ({
    default: { query: vi.fn() },
}));

vi.mock('uuid', () => ({ v4: vi.fn(() => 'mock-uuid') }));

import client from '../../db/clientPostgres.js';
import { CommentsRepository } from '../../repositories/commentsRepository.js';

describe('CommentsRepository.addComment()', () => {
    const repo = new CommentsRepository();

    // Regression coverage: addComment used to INSERT ... RETURNING * with no join to
    // users, so the comment it handed back to the controller had `user.username`
    // undefined until the page refetched comments (which does join). Callers that
    // render this return value directly (optimistic inserts on web and mobile) showed
    // a blank "@" and a blank avatar right after posting.
    it('returns a comment with the poster\'s username, not just their id', async () => {
        client.query
            .mockResolvedValueOnce({
                rows: [{ id: 'mock-uuid', content: 'Nice trip!', user_id: 'u1', username: 'jane', itinerary_id: 'itin-1', created_at: new Date() }],
            })
            .mockResolvedValueOnce({ rows: [] });

        const comment = await repo.addComment('u1', 'itin-1', 'Nice trip!');

        expect(comment.user).toEqual({ id: 'u1', username: 'jane' });
    });
});

describe('CommentsRepository.getCommentById()', () => {
    const repo = new CommentsRepository();

    it('returns null when the comment does not exist, without throwing', async () => {
        client.query.mockResolvedValue({ rows: [] });

        await expect(repo.getCommentById('nonexistent')).resolves.toBeNull();
    });

    it('returns a mapped Comment when the row exists', async () => {
        client.query.mockResolvedValue({
            rows: [{ id: 'c1', content: 'Nice trip!', user_id: 'u1', username: 'jane', itinerary_id: 'itin-1', created_at: new Date() }],
        });

        const comment = await repo.getCommentById('c1');

        expect(comment.id).toBe('c1');
        expect(comment.user).toEqual({ id: 'u1', username: 'jane' });
    });
});
