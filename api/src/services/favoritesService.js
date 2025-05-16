export class FavoritesService {
    constructor(favoritesRepository) {
        this.favoritesRepository = favoritesRepository;
    }

    async addFavorite(itineraryId, userId) {
        return this.favoritesRepository.addFavorite(itineraryId, userId);
    }

    async removeFavorite(itineraryId, userId) {
        return this.favoritesRepository.removeFavorite(itineraryId, userId);
    }

    async isFavorite(itineraryId, userId) {
        return this.favoritesRepository.isFavorite(itineraryId, userId);
    }

    async getUserFavorites(userId) {
        const itineraries = await this.favoritesRepository.getUserFavorites(userId);
        return itineraries.map(itinerary => itinerary.toSimpleDTO());
    }
}