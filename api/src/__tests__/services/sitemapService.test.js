import { describe, it, expect, vi } from 'vitest';
import { SitemapService } from '../../services/sitemapService.js';

describe('SitemapService.getEntries()', () => {
    it('combines static paths, public itineraries and public-profile users into one list', async () => {
        const itineraryRepository = {
            findPublicSitemapEntries: vi.fn().mockResolvedValue([
                { id: 'itin-1', updatedAt: '2026-01-01T00:00:00.000Z' },
            ]),
        };
        const userRepository = {
            findAllForSitemap: vi.fn().mockResolvedValue([
                { id: 'user-1', updatedAt: '2026-02-01T00:00:00.000Z' },
            ]),
        };
        const service = new SitemapService(itineraryRepository, userRepository);

        const entries = await service.getEntries();

        expect(entries).toContainEqual({ path: '/' });
        expect(entries).toContainEqual({ path: '/explore' });
        expect(entries).toContainEqual({ path: '/itinerary/itin-1', lastmod: '2026-01-01T00:00:00.000Z' });
        expect(entries).toContainEqual({ path: '/friend-profile/user-1', lastmod: '2026-02-01T00:00:00.000Z' });
    });

    it('fetches itineraries and users concurrently, not sequentially', async () => {
        const order = [];
        const itineraryRepository = {
            findPublicSitemapEntries: vi.fn(async () => { order.push('itineraries:start'); return []; }),
        };
        const userRepository = {
            findAllForSitemap: vi.fn(async () => { order.push('users:start'); return []; }),
        };
        const service = new SitemapService(itineraryRepository, userRepository);

        await service.getEntries();

        expect(order).toContain('itineraries:start');
        expect(order).toContain('users:start');
        expect(itineraryRepository.findPublicSitemapEntries).toHaveBeenCalledTimes(1);
        expect(userRepository.findAllForSitemap).toHaveBeenCalledTimes(1);
    });
});
