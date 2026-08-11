import { beforeEach, describe, expect, it, vi } from 'vitest';
import { setApiUrl } from '../../utils/apiConfig.js';
import { setTokenStorage } from '../../utils/tokenStorage.js';
import { getUserById } from '../../services/users.js';
import { followUser, unfollowUser, getAllFollowers, getAllFollowing } from '../../services/followers.js';

// Regression coverage: these used to swallow every failure and resolve null, which made
// every caller's error handling (EditProfile's stuck skeleton, useFollow's optimistic
// rollback, MyItineraries' error+retry) unreachable dead code. They must now reject like
// every other authenticated service (favorites.js, likes.js, comments.js already do).
describe('services that must propagate failures instead of resolving null', () => {
    beforeEach(() => {
        setApiUrl('http://api.test');
        setTokenStorage({
            getItem: async () => 'test-token',
            setItem: async () => {},
            removeItem: async () => {},
        });
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            json: async () => ({ error: 'Server exploded' }),
        });
    });

    const CASES = [
        ['getUserById', () => getUserById('user-1')],
        ['followUser', () => followUser('user-1')],
        ['unfollowUser', () => unfollowUser('user-1')],
        ['getAllFollowers', () => getAllFollowers('user-1')],
        ['getAllFollowing', () => getAllFollowing('user-1')],
    ];

    it.each(CASES)('%s rejects on a non-ok response instead of resolving null', async (_name, call) => {
        await expect(call()).rejects.toThrow('Server exploded');
    });
});
