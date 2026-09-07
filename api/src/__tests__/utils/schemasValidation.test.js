import { describe, it, expect } from 'vitest';
import { signupSchema, resetPasswordSchema, vanLogEntrySchema } from '../../utils/schemasValidation.js';

const validSignupData = {
    username: 'traveller',
    email: 'traveller@example.com',
    confirmPassword: '      ',
    termsAccepted: true,
    ageConfirmed: true,
};

// Regression coverage: a password made only of spaces used to satisfy min(6),
// since length alone was checked and the value was never trimmed. Signup would
// succeed with a password nobody could reasonably type back (whitespace-only).
describe('signupSchema rejects whitespace-only passwords', () => {
    it('fails when the password is only spaces, even if it reaches the minimum length', () => {
        const result = signupSchema.safeParse({ ...validSignupData, password: '      ' });

        expect(result.success).toBe(false);
    });

    it('still accepts a normal password of at least 6 characters', () => {
        const result = signupSchema.safeParse({
            ...validSignupData,
            password: 'abcdef',
            confirmPassword: 'abcdef',
        });

        expect(result.success).toBe(true);
    });
});

describe('vanLogEntrySchema restricts pricePerLiter to the fuel category', () => {
    const baseEntry = { title: null, amount: 60, currency: 'EUR', location: null, notes: null, entryDate: '2026-08-27' };

    it('accepts a pricePerLiter on a fuel entry', () => {
        const result = vanLogEntrySchema.safeParse({ ...baseEntry, category: 'fuel', pricePerLiter: 1.799 });

        expect(result.success).toBe(true);
    });

    it('rejects a pricePerLiter on a non-fuel entry', () => {
        const result = vanLogEntrySchema.safeParse({ ...baseEntry, category: 'parking', pricePerLiter: 1.799 });

        expect(result.success).toBe(false);
    });

    it('accepts a fuel entry with no pricePerLiter at all', () => {
        const result = vanLogEntrySchema.safeParse({ ...baseEntry, category: 'fuel', pricePerLiter: null });

        expect(result.success).toBe(true);
    });
});

describe('resetPasswordSchema rejects whitespace-only passwords', () => {
    it('fails when newPassword is only spaces', () => {
        const result = resetPasswordSchema.safeParse({
            token: 'a'.repeat(64),
            newPassword: '      ',
        });

        expect(result.success).toBe(false);
    });

    it('still accepts a normal newPassword of at least 6 characters', () => {
        const result = resetPasswordSchema.safeParse({
            token: 'a'.repeat(64),
            newPassword: 'abcdef',
        });

        expect(result.success).toBe(true);
    });
});
