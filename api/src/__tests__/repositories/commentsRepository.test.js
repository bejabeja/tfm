import { describe, it, expect, vi } from 'vitest';

vi.mock('../../db/clientPostgres.js', () => ({
    default: { query: vi.fn() },
}));

vi.mock('uuid', () => ({ v4: vi.fn(() => 'mock-uuid') }));

import client from '../../db/clientPostgres.js';
import { CommentsRepository } from '../../repositories/commentsRepository.js';

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
