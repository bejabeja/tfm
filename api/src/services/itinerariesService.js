
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


    async getFeaturedItineraries() {
        const featuredIds = ['fe35c13c-4708-4c5d-8467-13970a5f3d8f', 'd1b2c0f4-9283-4f7c-baa4-39920d2b4d6c', 'f2b4e7b1-5c2f-4cc5-8fb7-ec4f814c0835']
        const featuredItineraries = []

        for (const id of featuredIds) {
            const itinerary = await this.itinerariesRepository.getItineraryById(id)
            if (!itinerary) {
                continue;
            }
            const user = await this.userRepository.getUserById(itinerary.userId);
            if (user) {
                itinerary.addUser(user.toSimpleDTO());
            }

            featuredItineraries.push(itinerary.toSimpleDTO());
        }

        return featuredItineraries;
    }
}