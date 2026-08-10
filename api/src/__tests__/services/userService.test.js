import { beforeEach, describe, expect, it } from 'vitest';
import { User } from '../../models/user.js';
import { UserService } from '../../services/userService.js';

const makeUser = (overrides = {}) => new User({
    id: 'user-1',
    username: 'jane',
    email: 'jane@example.com',
    password: 'hashed',
    location: 'Madrid',
    ...overrides,
});

describe('UserService.getUserById()', () => {
    let service;
    let userRepository;
    let itinerariesRepository;
    let followRepository;

    beforeEach(() => {
        userRepository = { getUserById: async () => makeUser() };
        itinerariesRepository = { findPublicByUserId: async () => [] };
        followRepository = { getFollowers: async () => [], getFollowing: async () => [] };
        service = new UserService(userRepository, itinerariesRepository, followRepository);
    });

    it('includes the email when the requester is viewing their own profile', async () => {
        const result = await service.getUserById('user-1', 'user-1');

        expect(result.email).toBe('jane@example.com');
    });

    it('omits the email when the requester is someone else (or anonymous)', async () => {
        const result = await service.getUserById('user-1', 'someone-else');

        expect(result.email).toBeUndefined();
    });

    it('omits the email for an anonymous request', async () => {
        const result = await service.getUserById('user-1', undefined);

        expect(result.email).toBeUndefined();
    });
});
