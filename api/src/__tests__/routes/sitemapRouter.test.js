import { describe, it, expect } from 'vitest';
import { buildSitemapXml } from '../../routes/sitemapRouter.js';

describe('buildSitemapXml()', () => {
    it('renders a <url> entry per item, in order', () => {
        const xml = buildSitemapXml([
            { url: 'https://tobeatraveller.app/' },
            { url: 'https://tobeatraveller.app/explore' },
        ]);

        const firstIndex = xml.indexOf('https://tobeatraveller.app/</loc>');
        const secondIndex = xml.indexOf('https://tobeatraveller.app/explore</loc>');
        expect(firstIndex).toBeGreaterThan(-1);
        expect(secondIndex).toBeGreaterThan(firstIndex);
    });

    it('includes a <lastmod> only when provided', () => {
        const xml = buildSitemapXml([
            { url: 'https://tobeatraveller.app/itinerary/1', lastmod: '2026-03-15T10:00:00.000Z' },
            { url: 'https://tobeatraveller.app/' },
        ]);

        expect(xml).toMatch(/<loc>https:\/\/tobeatraveller\.app\/itinerary\/1<\/loc>\s*<lastmod>2026-03-15<\/lastmod>/);
        expect(xml).not.toMatch(/<loc>https:\/\/tobeatraveller\.app\/<\/loc>\s*<lastmod>/);
    });

    it('escapes XML-unsafe characters in the URL', () => {
        const xml = buildSitemapXml([
            { url: 'https://tobeatraveller.app/friend-profile/a&b' },
        ]);

        expect(xml).toContain('a&amp;b');
        expect(xml).not.toContain('a&b');
    });

    it('produces a valid urlset envelope', () => {
        const xml = buildSitemapXml([]);

        expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
        expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
        expect(xml).toContain('</urlset>');
    });
});
