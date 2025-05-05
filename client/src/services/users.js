import { parseError } from "../utils/parseError";

const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

export const getUserForAuth = async () => {
    const response = await fetch(`${baseUrl}/me`, {
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

export const getUserById = async (id) => {
    const response = await fetch(`${baseUrl}/${id}`, {
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

export const updateUser = async (data) => {
    const response = await fetch(`${baseUrl}/me`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        await parseError(response, 'Failed to update user');
    }
    return response.json();
}