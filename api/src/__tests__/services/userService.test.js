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

describe('UserService.deleteUser()', () => {
    let service;
    let userRepository;
    let itinerariesRepository;
    let lifeDiaryRepository;

    beforeEach(() => {
        userRepository = { getUserById: async () => makeUser(), deleteUser: async () => {} };
        itinerariesRepository = { findImagePublicIdsByUserId: async () => ['cover-1', 'gallery-1'] };
        lifeDiaryRepository = { findImagePublicIdsByUserId: async () => ['diary-1'] };
        service = new UserService(userRepository, itinerariesRepository, {}, null, lifeDiaryRepository);
    });

    it('throws NotFoundError when the user does not exist', async () => {
        userRepository.getUserById = async () => null;

        await expect(service.deleteUser('missing')).rejects.toThrow('User not found');
    });

    it('collects the deleted user\'s itinerary and life diary image public ids', async () => {
        const result = await service.deleteUser('user-1');

        expect(result.user.id).toBe('user-1');
        expect(result.imagePublicIds).toEqual(['cover-1', 'gallery-1', 'diary-1']);
    });

    it('collects itinerary images even when no lifeDiaryRepository is wired', async () => {
        service = new UserService(userRepository, itinerariesRepository, {});

        const result = await service.deleteUser('user-1');

        expect(result.imagePublicIds).toEqual(['cover-1', 'gallery-1']);
    });

    it('gathers image ids before deleting the user, so the cascade can\'t remove them first', async () => {
        const callOrder = [];
        itinerariesRepository.findImagePublicIdsByUserId = async () => { callOrder.push('collect'); return []; };
        userRepository.deleteUser = async () => { callOrder.push('delete'); };

        await service.deleteUser('user-1');

        expect(callOrder).toEqual(['collect', 'delete']);
    });

    it('logs the deletion when an admin deletes someone else\'s account', async () => {
        let loggedEntry;
        const auditLogRepository = { log: async (entry) => { loggedEntry = entry; } };
        service = new UserService(userRepository, itinerariesRepository, {}, null, lifeDiaryRepository, auditLogRepository);

        await service.deleteUser('user-1', { id: 'admin-1', username: 'root' });

        expect(loggedEntry).toEqual({
            actorId: 'admin-1',
            actorUsername: 'root',
            action: 'delete_user',
            targetUserId: 'user-1',
            targetUsername: 'jane',
            metadata: {},
        });
    });

    it('does not log when a user deletes their own account', async () => {
        let logCalled = false;
        const auditLogRepository = { log: async () => { logCalled = true; } };
        service = new UserService(userRepository, itinerariesRepository, {}, null, lifeDiaryRepository, auditLogRepository);

        await service.deleteUser('user-1', { id: 'user-1', username: 'jane' });

        expect(logCalled).toBe(false);
    });
});

describe('UserService.updateUserRole()', () => {
    let service;
    let userRepository;
    let auditLogRepository;

    beforeEach(() => {
        userRepository = {
            getUserById: async (id) => makeUser({ id, role: 'user' }),
            updateRole: async (id, role) => makeUser({ id, role }),
        };
        auditLogRepository = { log: async () => {} };
        service = new UserService(userRepository, {}, {}, null, null, auditLogRepository);
    });

    it('updates the target user role when a superadmin grants superadmin', async () => {
        const result = await service.updateUserRole('user-2', 'superadmin', { id: 'admin-1', role: 'superadmin' });

        expect(result.role).toBe('superadmin');
    });

    it('throws ForbiddenError when a plain admin tries to grant superadmin', async () => {
        await expect(
            service.updateUserRole('user-2', 'superadmin', { id: 'admin-1', role: 'admin' })
        ).rejects.toThrow('Only a superadmin can grant the superadmin role');
    });

    it('throws ForbiddenError when an admin tries to change their own role', async () => {
        await expect(
            service.updateUserRole('admin-1', 'user', { id: 'admin-1', role: 'admin' })
        ).rejects.toThrow('You cannot change your own role');
    });

    it('throws NotFoundError when the target user does not exist', async () => {
        userRepository.getUserById = async () => null;

        await expect(
            service.updateUserRole('missing', 'admin', { id: 'admin-1', role: 'superadmin' })
        ).rejects.toThrow('User not found');
    });

    it('logs the role change with the previous and new role', async () => {
        let loggedEntry;
        auditLogRepository.log = async (entry) => { loggedEntry = entry; };

        await service.updateUserRole('user-2', 'admin', { id: 'admin-1', username: 'root', role: 'superadmin' });

        expect(loggedEntry).toEqual({
            actorId: 'admin-1',
            actorUsername: 'root',
            action: 'update_role',
            targetUserId: 'user-2',
            targetUsername: 'jane',
            metadata: { previousRole: 'user', newRole: 'admin' },
        });
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
