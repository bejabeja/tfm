import { Router } from 'express';
import config from '../config/config.js';
import { ItineraryRepository } from '../repositories/itineraryRepository.js';
import { UserRepository } from '../repositories/userRepository.js';

const STATIC_PATHS = ['/', '/explore', '/community', '/privacy-policy', '/terms', '/contact'];

const esc = (str) => String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const toDateStamp = (date) => new Date(date).toISOString().slice(0, 10);

const urlEntry = ({ url, lastmod }) => `  <url>
    <loc>${esc(url)}</loc>${lastmod ? `
    <lastmod>${toDateStamp(lastmod)}</lastmod>` : ''}
  </url>`;

export const buildSitemapXml = (entries) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(urlEntry).join('\n')}
</urlset>
`;

export const createSitemapRouter = () => {
    const router = Router();

    const itineraryRepository = new ItineraryRepository();
    const userRepository = new UserRepository();

    router.get('/sitemap.xml', async (_req, res, next) => {
        try {
            const appUrl = config.appUrl;
            const [itineraries, users] = await Promise.all([
                itineraryRepository.findPublicSitemapEntries(),
                userRepository.findAllForSitemap(),
            ]);

            const entries = [
                ...STATIC_PATHS.map((path) => ({ url: `${appUrl}${path}` })),
                ...itineraries.map(({ id, updatedAt }) => ({ url: `${appUrl}/itinerary/${id}`, lastmod: updatedAt })),
                ...users.map(({ id, updatedAt }) => ({ url: `${appUrl}/friend-profile/${id}`, lastmod: updatedAt })),
            ];

            res.setHeader('Content-Type', 'application/xml; charset=utf-8');
            res.setHeader('Cache-Control', 'public, max-age=3600');
            res.send(buildSitemapXml(entries));
        } catch (error) {
            next(error);
        }
    });

    return router;
};
