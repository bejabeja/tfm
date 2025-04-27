import { parseError } from "../utils/parseError";

const baseUrl = import.meta.env.VITE_API_URL;

export const getItineraryById = async (id) => {
    const response = await fetch(`${baseUrl}/itineraries/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        await parseError("Failed to fetch itinerary");
    }
    return response.json();
}

export const createItinerary = async (itinerary) => {
    const response = await fetch(`${baseUrl}/itineraries`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(itinerary),
    });
    if (!response.ok) {
        await parseError("Failed to create itinerary");
    }
    return response.json();
}