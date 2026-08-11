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
});
