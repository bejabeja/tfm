import { describe, it, expect, vi } from 'vitest';
import { requireRole } from '../../middlewares/requireRole.js';
import { ForbiddenError } from '../../errors/ForbiddenError.js';

describe('requireRole()', () => {
    it('calls next() with no arguments when the user has one of the allowed roles', () => {
        const req = { user: { role: 'admin' } };
        const next = vi.fn();

        requireRole('admin', 'superadmin')(req, {}, next);

        expect(next).toHaveBeenCalledWith();
    });

    it('calls next() with a ForbiddenError when the user role is not allowed', () => {
        const req = { user: { role: 'user' } };
        const next = vi.fn();

        requireRole('admin', 'superadmin')(req, {}, next);

        expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });

    it('calls next() with a ForbiddenError when there is no authenticated user', () => {
        const req = {};
        const next = vi.fn();

        requireRole('admin')(req, {}, next);

        expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    });
});
