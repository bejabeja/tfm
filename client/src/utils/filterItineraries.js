export const filterItineraries = (itineraries, filters) => {
    if (!itineraries || !Array.isArray(itineraries)) return [];

    return itineraries.filter((itinerary) => {
        if (
            filters.category &&
            itinerary.category.toLowerCase() !== filters.category.toLowerCase()
        ) return false;

        if (
            filters.budgetMin &&
            parseFloat(itinerary.budget) < parseFloat(filters.budgetMin)
        ) return false;

        if (
            filters.budgetMax &&
            parseFloat(itinerary.budget) > parseFloat(filters.budgetMax)
        ) return false;

        if (
            filters.locationName &&
            !itinerary.location.name
                .toLowerCase()
                .includes(filters.locationName.toLowerCase())
        ) return false;

        if (
            filters.durationMin &&
            itinerary.duration < parseInt(filters.durationMin, 10)
        ) return false;

        if (
            filters.durationMax &&
            itinerary.duration > parseInt(filters.durationMax, 10)
        ) return false;

        if (
            filters.startDateMin &&
            new Date(itinerary.startDate) < new Date(filters.startDateMin)
        ) return false;

        if (
            filters.startDateMax &&
            new Date(itinerary.startDate) > new Date(filters.startDateMax)
        ) return false;

        return true;
    });
};
