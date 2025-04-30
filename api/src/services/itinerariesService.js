import { ConflictError } from "../errors/ConflictError.js";
import { NotFoundError } from "../errors/NotFoundError.js";

export class ItinerariesService {
    constructor(itinerariesRepository, placesRepository) {
        this.itinerariesRepository = itinerariesRepository;
        this.placesRepository = placesRepository;
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

        if (itineraryData.places?.length) {
            for (const placeData of itineraryData.places) {
                const existingPlace = itineraryPlaces.find(place => place.id === placeData.id);
                if (existingPlace) {
                    const place = await this.placesRepository.updatePlace(placeData);
                    await this.itinerariesRepository.updatePlaceInItinerary(itinerary.id, place);
                } else {
                    console.log('aqui no entro')
                    const place = await this.placesRepository.insertPlace(placeData);
                    await this.itinerariesRepository.linkPlaceToItinerary(itinerary.id, place.id, placeData.orderIndex);
                    itinerary.addPlace(place);
                }
            }
        }

        await this.itinerariesRepository.updateItinerary(id, itineraryData);
        console.log('aqui no entro 2')
    }
}