export class FavoritesService {
    constructor(favoritesRepository, userRepository) {
        this.favoritesRepository = favoritesRepository;
        this.userRepository = userRepository;
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
        for (const itinerary of itineraries) {
            const user = await this.userRepository.getUserById(itinerary.userId);
            if (user) {
                itinerary.addUser(user.toSimpleDTO());
            }
        }
        return itineraries.map(itinerary => itinerary.toSimpleDTO());
    }
}