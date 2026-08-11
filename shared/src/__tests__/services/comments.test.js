import { beforeEach, describe, expect, it, vi } from 'vitest';
import { setApiUrl } from '../../utils/apiConfig.js';
import { setTokenStorage } from '../../utils/tokenStorage.js';
import { addComment } from '../../services/comments.js';

// Regression coverage: the endpoint responds with { message, comment }, but addComment
// used to return that whole envelope. Callers that store the result directly (mobile's
// optimistic insert, web's post-add insert) ended up with a comment card missing its
// id/user/content, since those live one level down under `.comment`.
describe('addComment', () => {
    beforeEach(() => {
        setApiUrl('http://api.test');
        setTokenStorage({
            getItem: async () => 'test-token',
            setItem: async () => {},
            removeItem: async () => {},
        });
    });

    it('returns the created comment, not the { message, comment } envelope', async () => {
        const comment = { id: 'comment-1', content: 'hi', user: { id: 'user-1', username: 'jane' } };
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ message: 'Comment added', comment }),
        });

        const result = await addComment('itinerary-1', 'hi');

        expect(result).toEqual(comment);
    });
});
