import { describe, it, expect, vi, beforeEach } from 'vitest';
import { requirePremium } from '../../middlewares/requirePremium.js';
import { ForbiddenError } from '../../errors/ForbiddenError.js';

describe('requirePremium()', () => {
    let mockUserRepository;
    let middleware;

    beforeEach(() => {
        mockUserRepository = { getUserById: vi.fn() };
        middleware = requirePremium(mockUserRepository);
    });

    it('calls next() with no arguments for an admin, without checking the database', async () => {
        const req = { user: { id: 'staff-1', role: 'admin' } };
        const next = vi.fn();

        await middleware(req, {}, next);

        expect(mockUserRepository.getUserById).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith();
    });

    it('calls next() with no arguments for a superadmin', async () => {
        const req = { user: { id: 'staff-2', role: 'superadmin' } };
        const next = vi.fn();

        await middleware(req, {}, next);

        expect(next).toHaveBeenCalledWith();
    });

    it('calls next() with no arguments when the user has an active premium subscription', async () => {
        mockUserRepository.getUserById.mockResolvedValue({ isPremium: () => true });
        const req = { user: { id: 'user-1', role: 'user' } };
        const next = vi.fn();

        await middleware(req, {}, next);

        expect(next).toHaveBeenCalledWith();
    });

    it('calls next() with a ForbiddenError when the user has no active subscription', async () => {
        mockUserRepository.getUserById.mockResolvedValue({ isPremium: () => false });
        const req = { user: { id: 'user-1', role: 'user' } };
        const next = vi.fn();

        await middleware(req, {}, next);

        expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });

    it('calls next() with a ForbiddenError when the user no longer exists', async () => {
        mockUserRepository.getUserById.mockResolvedValue(null);
        const req = { user: { id: 'deleted-user', role: 'user' } };
        const next = vi.fn();

        await middleware(req, {}, next);

        expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });
});
