import { describe, expect, it } from 'vitest';
import { parseRichText } from '../../utils/parseRichText.js';

describe('parseRichText', () => {
    it('returns a single text segment when there is no markup', () => {
        expect(parseRichText('Plain sentence.')).toEqual([
            { type: 'text', text: 'Plain sentence.' },
        ]);
    });

    it('splits out a <strong> segment', () => {
        expect(parseRichText('Hello <strong>World</strong>!')).toEqual([
            { type: 'text', text: 'Hello ' },
            { type: 'bold', text: 'World' },
            { type: 'text', text: '!' },
        ]);
    });

    it('splits out an <a href> segment', () => {
        expect(parseRichText('Read our <a href="/privacy-policy">Privacy Policy</a>.')).toEqual([
            { type: 'text', text: 'Read our ' },
            { type: 'link', href: '/privacy-policy', text: 'Privacy Policy' },
            { type: 'text', text: '.' },
        ]);
    });

    it('handles multiple mixed segments in one string', () => {
        expect(parseRichText('<strong>Access:</strong> contact <a href="mailto:a@b.com">a@b.com</a> today'))
            .toEqual([
                { type: 'bold', text: 'Access:' },
                { type: 'text', text: ' contact ' },
                { type: 'link', href: 'mailto:a@b.com', text: 'a@b.com' },
                { type: 'text', text: ' today' },
            ]);
    });
});
