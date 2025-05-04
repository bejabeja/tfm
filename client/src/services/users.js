import { parseError } from "../utils/parseError";

const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

export const getfeaturedUsers = async () => {
    const response = await fetch(`${baseUrl}/featured`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        await parseError(response, 'Failed to get users');
    }
    return response.json();
}