import { NotFoundError } from "../errors/NotFoundError.js";

export class ItinerariesService {
    constructor(itinerariesRepository) {
        this.itinerariesRepository = itinerariesRepository;
    }

    async getItinerariesByUserId(userId) {
        const itineraries = await this.itinerariesRepository.getItinerariesByUserId(userId);
        if (!itineraries || itineraries.length === 0) {
            throw new NotFoundError("No itineraries found for this user");
        }

        const itinerariesDTO = itineraries.map(itinerary => itinerary.toSimpleDTO());
        return itinerariesDTO;
    }
}