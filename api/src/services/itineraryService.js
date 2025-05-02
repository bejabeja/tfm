import { ConflictError } from "../errors/ConflictError.js";
import { NotFoundError } from "../errors/NotFoundError.js";

export class ItineraryService {
    constructor(itinerariesRepository, placesRepository, userRepository) {
        this.itinerariesRepository = itinerariesRepository;
        this.placesRepository = placesRepository;
        this.userRepository = userRepository;
    }
    async getItineraryById(id) {
        const itinerary = await this.itinerariesRepository.getItineraryById(id);
        if (!itinerary) {
            throw new NotFoundError("Itinerary not found");
        }
        const places = await this.placesRepository.getPlacesByItineraryId(itinerary.id);
        for (const place of places) {
            itinerary.addPlace(place);
        }

        return itinerary.toDTO();
    }

    async createItinerary(itineraryData) {
        const itinerary = await this.itinerariesRepository.createItinerary(itineraryData);
        if (!itinerary) {
            throw new ConflictError("It was not possible to create the itinerary");
        }
        if (itineraryData.places?.length) {
            for (const placeData of itineraryData.places) {
                const place = await this.placesRepository.insertPlace(placeData);
                await this.itinerariesRepository.linkPlaceToItinerary(itinerary.id, place.id, placeData.orderIndex);
                itinerary.addPlace(place);
            }
        }
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
        const itineraryPlaces = await this.placesRepository.getPlacesByItineraryId(itinerary.id);

        const incomingPlacesIds = new Set(itineraryData.places.map(place => place.id));
        for (const place of itineraryPlaces) {
            if (!incomingPlacesIds.has(place.id)) {
                await this.itinerariesRepository.unlinkPlaceFromItinerary(itinerary.id, place.id);
            }
        }

        if (itineraryData.places?.length) {
            for (const placeData of itineraryData.places) {
                const existingPlace = itineraryPlaces.find(place => place.id === placeData.id);
                if (existingPlace) {
                    const place = await this.placesRepository.updatePlace(placeData);
                    await this.itinerariesRepository.updatePlaceInItinerary(itinerary.id, place);
                } else {
                    const place = await this.placesRepository.insertPlace(placeData);
                    await this.itinerariesRepository.linkPlaceToItinerary(itinerary.id, place.id, placeData.orderIndex);
                    itinerary.addPlace(place);
                }
            }
        }

        await this.itinerariesRepository.updateItinerary(id, itineraryData);
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