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
