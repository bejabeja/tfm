import { NotFoundError } from '../errors/NotFoundError.js';

export class ItinerariesService {
    constructor(itinerariesRepository, placesRepository) {
        this.itinerariesRepository = itinerariesRepository;
        this.placesRepository = placesRepository;
    }

    async getFilteredItineraries({ category, destination, page, limit }) {
        const itineraries = await this.itinerariesRepository.findByFilters({ category, destination, page, limit });

        if (!itineraries.length) {
            throw new NotFoundError("Itineraries not found");
        }

        for (const itinerary of itineraries) {
            const places = await this.placesRepository.getPlacesByItineraryId(itinerary.id);
            for (const place of places) {
                itinerary.addPlace(place);
            }
        }

        return itineraries;
    }



}