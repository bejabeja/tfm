
export class ItinerariesService {
    constructor(itinerariesRepository, userRepository, placesRepository) {
        this.itinerariesRepository = itinerariesRepository;
        this.userRepository = userRepository;
        this.placesRepository = placesRepository;
    }

    async getFilteredItineraries(filters) {
        const totalItems = await this.itinerariesRepository.countByFilters(filters);
        const itineraries = await this.itinerariesRepository.findByFilters(filters);
        if (!itineraries.length) {
            return { itineraries: [], totalPages: 0, totalItems: 0, page: 1 }
        }

        await Promise.all(
            itineraries.map(async (itinerary) => {
                const user = await this.userRepository.getUserById(itinerary.userId);
                if (user) {
                    itinerary.addUser(user.toSimpleDTO());
                }
            })
        );

        const totalPages = Math.ceil(totalItems / filters.limit);

        return { itineraries: itineraries.map(it => (it.toSimpleDTO())), totalItems, totalPages, page: filters.page };
    }


    async getFeaturedItineraries() {
        const featuredIds = ['fe35c13c-4708-4c5d-8467-13970a5f3d8f', '9f2c9f0e-8f98-46be-8fdd-f5f82b4169a3', 'f2b4e7b1-5c2f-4cc5-8fb7-ec4f814c0835']

        const featuredItineraries = await Promise.all(
            featuredIds.map(async (id) => {
                const itinerary = await this.itinerariesRepository.getItineraryById(id);
                if (!itinerary) return null;

                const user = await this.userRepository.getUserById(itinerary.userId);
                if (user) {
                    itinerary.addUser(user.toSimpleDTO());
                }
                return itinerary.toSimpleDTO();
            })
        );

        return featuredItineraries.filter(Boolean);
    }


    async getItinerariesByUserId(userId) {
        const itineraries = await this.itinerariesRepository.findByUserId(userId)
        if (!itineraries.length) {
            return []
        }
        const enrichedItineraries = await Promise.all(
            itineraries.map(async (itinerary) => {
                const places = await this.placesRepository.getPlacesByItineraryId(itinerary.id);
                for (const place of places) {
                    itinerary.addPlace(place);
                }
                return itinerary.toDTO();
            })
        );

        return enrichedItineraries;
    }
}