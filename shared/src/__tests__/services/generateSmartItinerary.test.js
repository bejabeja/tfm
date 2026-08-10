import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setApiUrl } from '../../utils/apiConfig.js';
import { setTokenStorage } from '../../utils/tokenStorage.js';
import { generateSmartItinerary, GENERATE_TIMEOUT_MESSAGE } from '../../services/itineraries.js';

// Regression coverage for two bugs found in the same function:
// 1) it threw a hardcoded generic message instead of the backend's real one
//    (the only caller not using parseError, unlike every other function here).
// 2) it never timed out, so a hung AI request left the UI spinning forever.
describe('generateSmartItinerary', () => {
    beforeEach(() => {
        setApiUrl('http://api.test');
        setTokenStorage({
            getItem: async () => 'test-token',
            setItem: async () => {},
            removeItem: async () => {},
        });
    });

    it('surfaces the backend error message instead of a generic one', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            json: async () => ({ error: 'Groq rate limit reached' }),
        });

        await expect(generateSmartItinerary({ destination: 'Paris', days: 3 }))
            .rejects.toThrow('Groq rate limit reached');
    });

    it('falls back to a generic message when the backend sends none', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            json: async () => { throw new Error('not json'); },
        });

        await expect(generateSmartItinerary({ destination: 'Paris', days: 3 }))
            .rejects.toThrow('Failed to generate itinerary');
    });

    describe('timeout', () => {
        beforeEach(() => vi.useFakeTimers());
        afterEach(() => vi.useRealTimers());

        it('aborts and throws a distinguishable timeout error if the request hangs', async () => {
            global.fetch = vi.fn((url, { signal }) => new Promise((resolve, reject) => {
                signal.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' })));
            }));

            const pending = generateSmartItinerary({ destination: 'Paris', days: 3 });
            const assertion = expect(pending).rejects.toThrow(GENERATE_TIMEOUT_MESSAGE);
            await vi.runAllTimersAsync();
            await assertion;
        });
    });
});
