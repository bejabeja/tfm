// Kept in sync by hand with the public route list in client/src/App.jsx (publicRoutes).
const STATIC_PATHS = ['/', '/explore', '/community', '/privacy-policy', '/terms', '/contact'];

export class SitemapService {
    constructor(itineraryRepository, userRepository) {
        this.itineraryRepository = itineraryRepository;
        this.userRepository = userRepository;
    }

    async getEntries() {
        const [itineraries, users] = await Promise.all([
            this.itineraryRepository.findPublicSitemapEntries(),
            this.userRepository.findAllForSitemap(),
        ]);

        return [
            ...STATIC_PATHS.map((path) => ({ path })),
            ...itineraries.map(({ id, updatedAt }) => ({ path: `/itinerary/${id}`, lastmod: updatedAt })),
            ...users.map(({ id, updatedAt }) => ({ path: `/friend-profile/${id}`, lastmod: updatedAt })),
        ];
    }
}
