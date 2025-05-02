import { NotFoundError } from '../errors/NotFoundError.js';

export class ItinerariesService {
    constructor(itinerariesRepository, userRepository) {
        this.itinerariesRepository = itinerariesRepository;
        this.userRepository = userRepository;
    }

    async getFilteredItineraries({ category, destination, page, limit }) {
        const totalItems = await this.itinerariesRepository.countByFilters({ category, destination });

        const itineraries = await this.itinerariesRepository.findByFilters({ category, destination, page, limit });
        if (!itineraries.length) {
            throw new NotFoundError("Itineraries not found");
        }

        for (const itinerary of itineraries) {
            const user = await this.userRepository.getUserById(itinerary.userId);
            if (user) {
                itinerary.addUser(user.toSimpleDTO());
            }
        }

        const totalPages = Math.ceil(totalItems / limit);

        return { itineraries, totalItems, totalPages, page };
    }



}