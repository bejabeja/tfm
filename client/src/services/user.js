const baseUrl = import.meta.env.VITE_API_URL;

export const createNewUser = async (user) => {
    const response = await fetch(`${baseUrl}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }
    );
    return response.json();
}