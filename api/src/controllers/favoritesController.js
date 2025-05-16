export class FavoritesController {
    constructor(favoritesService) {
        this.favoritesService = favoritesService;
    }

    async addFavorite(req, res, next) {
        try {
            const { itineraryId } = req.params;
            const userId = req.user.id;

            await this.favoritesService.addFavorite(itineraryId, userId)

            return res.status(200).json({ message: 'Itinerary added to favorites.' });
        } catch (error) {
            next(error)
        }
    }

    async removeFavorite(req, res, next) {
        try {
            const { itineraryId } = req.params;
            const userId = req.user.id;

            await this.favoritesService.removeFavorite(itineraryId, userId)

            return res.status(200).json({ message: 'Itinerary removed from favorites.' });
        } catch (error) {
            next(error)
        }
    }

    async isFavorite(req, res, next) {
        try {
            const { itineraryId } = req.params;
            const userId = req.user.id;

            const isFav = await this.favoritesService.isFavorite(itineraryId, userId);
            return res.status(200).json({ isFavorite: isFav });
        } catch (error) {
            next(error);
        }
    }

    async getUserFavorites(req, res, next) {
        try {
            const userId = req.user.id;
            const favorites = await this.favoritesService.getUserFavorites(userId);
            return res.status(200).json(favorites);
        } catch (error) {
            next(error);
        }
    }

}