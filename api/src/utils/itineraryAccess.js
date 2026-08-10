import { AuthError } from '../errors/AuthError.js';
import { NotFoundError } from '../errors/NotFoundError.js';

export function assertItineraryVisible(itinerary, userId) {
    if (itinerary && !itinerary.isPublic && itinerary.userId !== userId) {
        throw new NotFoundError("Itinerary not found");
    }
}

export function assertItineraryOwner(itinerary, userId) {
    if (itinerary.userId !== userId) {
        throw new AuthError();
    }
}
