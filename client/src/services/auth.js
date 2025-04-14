import { parseError } from "../utils/parseError";

const baseUrl = import.meta.env.VITE_API_URL;

export const createNewUser = async (user) => {
    const response = await fetch(`${baseUrl}/auth/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }
    );
    if (!response.ok) {
        await parseError(response, 'Create user failed');
    }
    return response.json();
}

export const login = async (user) => {
    const response = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });

    if (!response.ok) {
        await parseError(response, 'Login failed');
    }

    return response.json();
};

export const logout = async () => {
    const response = await fetch(`${baseUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        await parseError(response, 'Logout failed');
    }
    return response.json();
}
