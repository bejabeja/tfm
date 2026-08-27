import { getApiUrl } from "../utils/apiConfig";
import { authFetch } from "../utils/authFetch";
import { parseError } from "../utils/parseError";

const baseUrl = () => `${getApiUrl()}/packing-checklist`;

const jsonRequest = async (path, options, errorMessage) => {
    const response = await authFetch(`${baseUrl()}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    if (!response.ok) {
        await parseError(response, errorMessage);
    }
    return response.status === 204 ? null : response.json();
};

export const getPackingChecklist = () =>
    jsonRequest("", { method: "GET" }, "Failed to get packing checklist");

export const addPackingChecklistItem = (item) =>
    jsonRequest("", { method: "POST", body: JSON.stringify(item) }, "Failed to add item");

export const seedPackingChecklistDefaults = (items) =>
    jsonRequest("/seed", { method: "POST", body: JSON.stringify({ items }) }, "Failed to load the default checklist");

export const resetPackingChecklistTrip = () =>
    jsonRequest("/reset", { method: "POST" }, "Failed to reset the checklist");

export const updatePackingChecklistItem = (id, item) =>
    jsonRequest(`/${id}`, { method: "PATCH", body: JSON.stringify(item) }, "Failed to update item");

export const deletePackingChecklistItem = (id) =>
    jsonRequest(`/${id}`, { method: "DELETE" }, "Failed to delete item");
