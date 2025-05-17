const baseUrl = `${import.meta.env.VITE_API_URL}/comments`;

export const getCommentsByItineraryId = async (itineraryId) => {
    const response = await fetch(`${baseUrl}/itinerary/${itineraryId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        await parseError("Failed to fetch comments");
    }
    return response.json();
};

export const addComment = async (itineraryId, commentText) => {
    const response = await fetch(`${baseUrl}/itinerary/${itineraryId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: commentText

    });

    if (!response.ok) {
        await parseError(response, 'Failed to post comment');
    }
    return response.json();
};
