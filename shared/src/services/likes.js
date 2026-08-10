import { getApiUrl } from "../utils/apiConfig";
import { authFetch } from "../utils/authFetch";
import { parseError } from "../utils/parseError";

const baseUrl = () => `${getApiUrl()}/likes`;

export const toggleLike = async (itineraryId) => {
    const response = await authFetch(`${baseUrl()}/${itineraryId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) await parseError(response, "Failed to toggle like");
    return response.json();
};

export const checkIsLiked = async (itineraryId) => {
    const response = await authFetch(`${baseUrl()}/${itineraryId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) await parseError(response, "Failed to check like");
    return response.json();
};
