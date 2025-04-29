import { NotFoundError } from "../errors/NotFoundError.js";

export class ItinerariesService {
    constructor(itinerariesRepository) {
        this.itinerariesRepository = itinerariesRepository;
    }
    async getItineraryById(id) {
        const itinerary = await this.itinerariesRepository.getItineraryById(id);
        if (!itinerary) {
            throw new NotFoundError("Itinerary not found");
        }
        return itinerary.toDTO();
    }

    async createItinerary(itineraryData) {
        const itinerary = await this.itinerariesRepository.createItinerary(itineraryData);
        return itinerary.toDTO();
    }

    async deleteItinerary(id) {
        const itinerary = await this.itinerariesRepository.getItineraryById(id);
        if (!itinerary) {
            throw new NotFoundError("Itinerary not found");
        }
        await this.itinerariesRepository.deleteItinerary(id);
    }

    async updateItinerary(id, itineraryData) {
        const itinerary = await this.itinerariesRepository.getItineraryById(id);
        if (!itinerary) {
            throw new NotFoundError("Itinerary not found");
        }
        await this.itinerariesRepository.updateItinerary(id, itineraryData);
    }
}