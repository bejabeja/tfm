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

}