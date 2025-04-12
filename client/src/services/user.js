const baseUrl = import.meta.env.VITE_API_URL;

export const createNewUser = async (user) => {
    const response = await fetch(`${baseUrl}/users/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }
    );
    return response.json();
}

export const login = async (user) => {
    const response = await fetch(`${baseUrl}/users/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }
    );
    return response.json();
}

export const logout = async () => {
    const response = await fetch(`${baseUrl}/users/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.json();
}

export const getUser = async () => {
    const response = await fetch(`${baseUrl}/users/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.json();
}