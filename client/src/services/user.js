import { parseError } from "../utils/parseError";

const baseUrl = import.meta.env.VITE_API_URL;

export const getUser = async () => {
    const response = await fetch(`${baseUrl}/users/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        await parseError(response, 'Failed to get user');
    }
    return response.json();
}

export const getUserById = async (id) => {
    const response = await fetch(`${baseUrl}/users/${id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        await parseError(response, 'Failed to get user');
    }
    return response.json();
}