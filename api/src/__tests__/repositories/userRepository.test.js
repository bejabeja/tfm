import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../db/clientPostgres.js', () => ({
    default: { query: vi.fn() },
}));

import db from '../../db/clientPostgres.js';
import { UserRepository } from '../../repositories/userRepository.js';

// Regression coverage: emails used to be compared case-sensitively, so a user who
// registered as "Jane@Example.com" couldn't log in or reset their password by typing
// "jane@example.com" (the natural way to type it back).
describe('UserRepository email case-insensitivity', () => {
    const repo = new UserRepository();

    beforeEach(() => {
        db.query.mockReset();
    });

    it('findByEmail compares case-insensitively and trims whitespace', async () => {
        db.query.mockResolvedValue({ rows: [] });

        await repo.findByEmail('  Jane@Example.com  ');

        expect(db.query.mock.calls[0][0]).toMatch(/LOWER\(email\) = LOWER\(\$1\)/);
        expect(db.query.mock.calls[0][1]).toEqual(['Jane@Example.com']);
    });

    it('save() stores the email lowercased and trimmed', async () => {
        db.query.mockResolvedValue({ rows: [{ id: 'u1', email: 'jane@example.com' }] });

        await repo.save({
            uuid: 'u1', username: 'jane', email: '  Jane@Example.com  ',
            password: 'hashed', location: null, avatarUrl: null, termsAcceptedAt: null,
        });

        const params = db.query.mock.calls[0][1];
        expect(params[2]).toBe('jane@example.com');
    });
});

// Regression coverage: findSuggested used to return users the caller already follows,
// so the onboarding "people to follow" screen showed them as not-followed and clicking
// "Follow" on them failed with a 409 ConflictError from FollowService.
describe('UserRepository.findSuggested excludes already-followed users', () => {
    const repo = new UserRepository();

    beforeEach(() => {
        db.query.mockReset();
    });

    it('filters out users already followed by the requester', async () => {
        db.query.mockResolvedValue({ rows: [] });

        await repo.findSuggested('current-user-id');

        const query = db.query.mock.calls[0][0];
        expect(query).toMatch(/NOT EXISTS/);
        expect(query).toMatch(/FROM user_followers/);
        expect(query).toMatch(/follower_id = \$1 AND followed_id = users\.id/);
        expect(db.query.mock.calls[0][1]).toEqual(['current-user-id']);
    });
});
