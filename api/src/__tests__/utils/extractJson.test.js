import { describe, it, expect } from 'vitest';
import { extractJsonObject } from '../../utils/extractJson.js';

describe('extractJsonObject()', () => {
    it('returns null for empty or missing input', () => {
        expect(extractJsonObject('')).toBeNull();
        expect(extractJsonObject(undefined)).toBeNull();
        expect(extractJsonObject(null)).toBeNull();
    });

    it('returns null when there is no JSON in the text', () => {
        expect(extractJsonObject('Sorry, I cannot help with that.')).toBeNull();
    });

    it('extracts a clean JSON object with nothing else around it', () => {
        const json = '{"destination":"Rome","places":[]}';
        expect(extractJsonObject(json)).toBe(json);
    });

    it('trims surrounding whitespace', () => {
        const json = '{"destination":"Rome"}';
        expect(extractJsonObject(`\n  ${json}  \n`)).toBe(json);
    });

    it('skips leaked reasoning prose that precedes the real JSON', () => {
        const reasoning = 'Let me think about this step by step. The user wants a trip to {some place}, so I should plan accordingly.\n\n';
        const json = '{"destination":"Rome","totalDays":3,"places":[{"title":"Colosseum"}]}';
        expect(extractJsonObject(reasoning + json)).toBe(json);
    });

    it('skips a markdown code fence wrapper', () => {
        const json = '{"destination":"Rome"}';
        expect(extractJsonObject(`\`\`\`json\n${json}\n\`\`\``)).toBe(json);
    });

    it('is not confused by nested objects inside the real JSON', () => {
        const json = '{"destination":"Rome","places":[{"title":"A"},{"title":"B"}]}';
        expect(extractJsonObject(json)).toBe(json);
    });

    it('is not confused by literal braces inside a quoted string value', () => {
        const json = '{"destination":"Rome","description":"The {historic} quarter"}';
        expect(extractJsonObject(json)).toBe(json);
    });

    it('ignores trailing content after the real JSON, like more leaked reasoning', () => {
        const json = '{"destination":"Rome"}';
        expect(extractJsonObject(`${json}\n\nHope that helps!`)).toBe(json);
    });

    it('returns null when the response is truncated mid-object', () => {
        expect(extractJsonObject('{"destination":"Rome","places":[{"title":"A"')).toBeNull();
    });
});
