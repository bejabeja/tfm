import { describe, expect, it } from 'vitest';
import { normalizeSearchText } from '../../utils/normalizeSearchText.js';

describe('normalizeSearchText', () => {
    it('lowercases the text', () => {
        expect(normalizeSearchText('Head Torch')).toBe('head torch');
    });

    it('strips accents so an unaccented query matches accented text', () => {
        expect(normalizeSearchText('Cámara')).toBe(normalizeSearchText('camara'));
    });

    it('leaves plain ASCII text untouched other than lowercasing', () => {
        expect(normalizeSearchText('Sleeping bag')).toBe('sleeping bag');
    });

    it('returns an empty string for null or undefined', () => {
        expect(normalizeSearchText(null)).toBe('');
        expect(normalizeSearchText(undefined)).toBe('');
    });
});
