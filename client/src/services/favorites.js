const baseUrl = `${import.meta.env.VITE_API_URL}/favorites`;

export const addFavorite = async (itineraryId) => {
    const response = await fetch(`${baseUrl}/${itineraryId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include',
    });
    if (!response.ok) {
        await parseError("Failed to add favorite");
    }
    return response.json();
};

export const removeFavorite = async (itineraryId) => {
    const response = await fetch(`${baseUrl}/${itineraryId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include',
    });
    if (!response.ok) {
        await parseError("Failed to remove favorite");
    }
    return response.json();
};

export const getUserFavorites = async () => {
    const response = await fetch(`${baseUrl}/user`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include',
    });
    if (!response.ok) {
        await parseError("Failed to get favorites");
    }
    return response.json();
};

export const checkIsFavorite = async (itineraryId) => {
    const response = await fetch(`${baseUrl}/${itineraryId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include',
    });
    if (!response.ok) {
        await parseError("Failed to check is favorite");
    }
    return response.json();
}