import { getApiUrl } from "../utils/apiConfig";

export const sendContact = async (fields) => {
    const response = await fetch(`${getApiUrl()}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
    });
    if (!response.ok) throw new Error('Failed to send contact message');
    return response.json();
};
