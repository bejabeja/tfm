import { ConflictError } from "../errors/ConflictError.js";
import { NotFoundError } from "../errors/NotFoundError.js";

export class ItineraryService {
    constructor(itinerariesRepository, placesRepository, userRepository, cloudinaryService) {
        this.itinerariesRepository = itinerariesRepository;
        this.placesRepository = placesRepository;
        this.userRepository = userRepository;
        this.cloudinaryService = cloudinaryService;
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

    async createItinerary(data, file) {
        let imageUrl = "";
        let imagePublicId = "";

        if (file) {
            const result = await this.cloudinaryService.uploadImageFromBuffer(file.buffer, file.originalname);
            imageUrl = result.secure_url;
            imagePublicId = result.public_id;
        }

        const itineraryData = {
            ...data,
            photoUrl: imageUrl,
            photoPublicId: imagePublicId,
        };

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

        if (itinerary.photoPublicId) {
            await this.cloudinaryService.deleteImage(itinerary.photoPublicId);
        }

        await this.itinerariesRepository.deleteItinerary(id);
    }

    async updateItinerary(id, itineraryData, file) {
        if (file) {
            const result = await this.cloudinaryService.uploadImageFromBuffer(file.buffer, file.originalname);
            itineraryData.photoUrl = result.secure_url;
            itineraryData.photoPublicId = result.public_id;
        }

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
}