import { describe, it, expect } from 'vitest';
import { supplyItemSchema } from '../../utils/schemasValidation.js';

const validItem = { name: 'Pasta', category: 'food', amount: 2, unit: 'g' };

describe('supplyItemSchema', () => {
    it('accepts a fractional amount for a measurable unit (g/kg/ml/l)', () => {
        const result = supplyItemSchema.safeParse({ ...validItem, amount: 0.5, unit: 'kg' });

        expect(result.success).toBe(true);
    });

    it('accepts a whole amount for a count-based unit', () => {
        const result = supplyItemSchema.safeParse({ ...validItem, amount: 2, unit: 'units' });

        expect(result.success).toBe(true);
    });

    it('rejects a fractional amount for a count-based unit (units/packs/cans)', () => {
        const result = supplyItemSchema.safeParse({ ...validItem, amount: 0.02, unit: 'units' });

        expect(result.success).toBe(false);
        expect(result.error.errors[0].path).toEqual(['amount']);
    });

    it('rejects a non-positive amount regardless of unit', () => {
        const result = supplyItemSchema.safeParse({ ...validItem, amount: 0, unit: 'g' });

        expect(result.success).toBe(false);
    });
});
