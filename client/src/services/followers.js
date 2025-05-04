import { parseError } from "../utils/parseError";

const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

export const followUser = async (id) => {
    const response = await fetch(`${baseUrl}/${id}/follow`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        await parseError(response, 'Failed to follow user');
    }

    return response.json();
}

export const unfollowUser = async (id) => {
    const response = await fetch(`${baseUrl}/${id}/follow`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        await parseError(response, 'Failed to unfollow user');
    }

    return response.json();
}

export const allFollowers = async (id) => {
    const response = await fetch(`${baseUrl}/${id}/follow`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        await parseError(response, 'Failed to get all followers users');
    }

    return response.json();
}

export const allFollowing = async (id) => {
    const response = await fetch(`${baseUrl}/${id}/following`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        await parseError(response, 'Failed to get all following users');
    }

    return response.json();
}