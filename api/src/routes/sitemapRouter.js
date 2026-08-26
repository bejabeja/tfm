import { Router } from 'express';
import config from '../config/config.js';
import { ItineraryRepository } from '../repositories/itineraryRepository.js';
import { UserRepository } from '../repositories/userRepository.js';
import { SitemapService } from '../services/sitemapService.js';
import { escapeXml } from '../utils/xmlEscape.js';

const toDateStamp = (date) => new Date(date).toISOString().slice(0, 10);

const urlEntry = ({ url, lastmod }) => `  <url>
    <loc>${escapeXml(url)}</loc>${lastmod ? `
    <lastmod>${toDateStamp(lastmod)}</lastmod>` : ''}
  </url>`;

export const buildSitemapXml = (entries) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(urlEntry).join('\n')}
</urlset>
`;

export const createSitemapRouter = () => {
    const router = Router();

    const sitemapService = new SitemapService(new ItineraryRepository(), new UserRepository());

    router.get('/sitemap.xml', async (_req, res, next) => {
        try {
            const appUrl = config.appUrl;
            const entries = await sitemapService.getEntries();
            const urlEntries = entries.map(({ path, lastmod }) => ({ url: `${appUrl}${path}`, lastmod }));

            res.setHeader('Content-Type', 'application/xml; charset=utf-8');
            res.setHeader('Cache-Control', 'public, max-age=3600');
            res.send(buildSitemapXml(urlEntries));
        } catch (error) {
            next(error);
        }
    });

    return router;
};
