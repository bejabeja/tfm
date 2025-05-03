
export class ItinerariesService {
    constructor(itinerariesRepository, userRepository) {
        this.itinerariesRepository = itinerariesRepository;
        this.userRepository = userRepository;
    }

    async getFilteredItineraries({ category, destination, page, limit }) {
        const totalItems = await this.itinerariesRepository.countByFilters({ category, destination });

        const itineraries = await this.itinerariesRepository.findByFilters({ category, destination, page, limit });
        if (!itineraries.length) {
            return { itineraries: [], totalPages: 0, totalItems: 0, page: 1 }
        }

        for (const itinerary of itineraries) {
            const user = await this.userRepository.getUserById(itinerary.userId);
            if (user) {
                itinerary.addUser(user.toSimpleDTO());
            }
        }

        const totalPages = Math.ceil(totalItems / limit);

        return { itineraries: itineraries.map(it => (it.toSimpleDTO())), totalItems, totalPages, page };
    }



}