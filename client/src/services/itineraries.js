const baseUrl = `${import.meta.env.VITE_API_URL}/itineraries`;

export const getItinerariesByFilters = async ({ category = "all", destination = "", page = 1, limit = 10 }) => {
    const params = new URLSearchParams();

    if (category && category != 'all') {
        params.append('category', category)
    }
    if (destination) {
        params.append('destination', destination)
    }
    params.append('page', page)
    params.append('limit', limit)
    console.log(params.toString())

    const response = await fetch(`${baseUrl}?${params.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        await parseError(response, "Failed to fetch filtered itineraries");
    }

    return response.json();
}