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
        itinerariesRepository = { findPublicByUserId: async () => [], findActiveByUserId: async () => null };
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

    it('sets activeTrip to null when the user has no trip in progress', async () => {
        const result = await service.getUserById('user-1', 'user-1');

        expect(result.activeTrip).toBeNull();
    });

    it('includes the in-progress trip as activeTrip', async () => {
        itinerariesRepository.findActiveByUserId = async () => ({
            toSimpleDTO: () => ({ id: 'trip-1', title: 'Roman holiday' }),
        });

        const result = await service.getUserById('user-1', 'user-1');

        expect(result.activeTrip).toEqual({ id: 'trip-1', title: 'Roman holiday' });
    });
});

describe('UserService.create()', () => {
    let userRepository;
    let service;

    beforeEach(() => {
        userRepository = {
            findByName: async () => null,
            findByEmail: async () => null,
            save: async (user) => makeUser(user),
        };
        service = new UserService(userRepository, { findPublicByUserId: async () => [] }, {});
    });

    it('resolves the signup country from the request IP', async () => {
        let savedUser;
        userRepository.save = async (user) => { savedUser = user; return makeUser(user); };

        await service.create(
            { username: 'jane', email: 'jane@example.com', password: 'secret1' },
            { ip: '8.8.8.8', userAgent: 'Mozilla/5.0 (test)' }
        );

        expect(savedUser.signupCountryCode).toBe('US');
        expect(savedUser.signupUserAgent).toBe('Mozilla/5.0 (test)');
    });

    it('stores null signup metadata when no request context is given', async () => {
        let savedUser;
        userRepository.save = async (user) => { savedUser = user; return makeUser(user); };

        await service.create({ username: 'jane', email: 'jane@example.com', password: 'secret1' });

        expect(savedUser.signupCountryCode).toBeNull();
        expect(savedUser.signupUserAgent).toBeNull();
    });
});
