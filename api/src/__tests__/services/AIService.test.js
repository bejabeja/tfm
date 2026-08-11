import { beforeEach, describe, expect, it, vi } from 'vitest';

process.env.GROQ_API_KEY ??= 'test-key';

const { AIService } = await import('../../services/AIService.js');

const stubGroqResponse = (text) => ({
    choices: [{ message: { content: text } }],
});

describe('AIService.generateTextPrompt', () => {
    let service;

    beforeEach(() => {
        service = new AIService();
        service.client = { chat: { completions: { create: vi.fn() } } };
    });

    const capturePrompt = async (context) => {
        service.client.chat.completions.create.mockResolvedValue(stubGroqResponse('{}'));
        await service.generateTextPrompt('Rome', 3, context);
        return service.client.chat.completions.create.mock.calls[0][0].messages[1].content;
    };

    it('generates 3 places per day by default (no pace given)', async () => {
        const prompt = await capturePrompt({});
        expect(prompt).toContain('Generate exactly 9 places total: 3 per day');
    });

    it('generates 2 places per day for a relaxed pace', async () => {
        const prompt = await capturePrompt({ pace: 'relaxed' });
        expect(prompt).toContain('Generate exactly 6 places total: 2 per day');
    });

    it('generates 4 places per day for an intense pace', async () => {
        const prompt = await capturePrompt({ pace: 'intense' });
        expect(prompt).toContain('Generate exactly 12 places total: 4 per day');
    });

    it('falls back to the normal pace for an unrecognized value', async () => {
        const prompt = await capturePrompt({ pace: 'ludicrous-speed' });
        expect(prompt).toContain('Generate exactly 9 places total: 3 per day');
    });

    // Regression: max_tokens used to be a flat 4000 regardless of how many places were
    // actually requested, so a long trip on an intense pace could ask for far more JSON
    // than the budget allowed, truncating the response and failing with a confusing
    // "AI returned invalid JSON" error instead of a length-related one.
    it('scales max_tokens up with the number of places requested', async () => {
        service.client.chat.completions.create.mockResolvedValue(stubGroqResponse('{}'));
        await service.generateTextPrompt('Rome', 3, { pace: 'normal' });
        const fewPlacesTokens = service.client.chat.completions.create.mock.calls[0][0].max_tokens;

        await service.generateTextPrompt('Rome', 30, { pace: 'intense' });
        const manyPlacesTokens = service.client.chat.completions.create.mock.calls[1][0].max_tokens;

        expect(manyPlacesTokens).toBeGreaterThan(fewPlacesTokens);
    });

    it('caps max_tokens at a safe ceiling for very long, intense-pace trips', async () => {
        service.client.chat.completions.create.mockResolvedValue(stubGroqResponse('{}'));
        await service.generateTextPrompt('Rome', 60, { pace: 'intense' });
        const maxTokens = service.client.chat.completions.create.mock.calls[0][0].max_tokens;

        expect(maxTokens).toBeLessThanOrEqual(8000);
    });

    // Regression: capping max_tokens alone left the prompt still asking for
    // totalDays * placesPerDay places, so a long enough trip got truncated JSON anyway.
    // The requested places-per-day must shrink too, so the prompt's own place count
    // never exceeds what the capped token budget can hold.
    it('reduces places per day, not just max_tokens, for trips too long to fit the ceiling', async () => {
        service.client.chat.completions.create.mockResolvedValue(stubGroqResponse('{}'));
        await service.generateTextPrompt('Rome', 60, { pace: 'intense' });

        const call = service.client.chat.completions.create.mock.calls.at(-1)[0];
        const longTripPrompt = call.messages[1].content;
        const [, placeCount] = longTripPrompt.match(/Generate exactly (\d+) places total/);

        expect(call.max_tokens).toBeLessThanOrEqual(8000);
        expect(Number(placeCount)).toBeLessThan(60 * 4);
    });
});
