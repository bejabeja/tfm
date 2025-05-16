const baseUrl = `${import.meta.env.VITE_API_URL}/cloudinary/image`;

export const deleteImageCloudinary = async (publicId) => {
    const response = await fetch(baseUrl, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ public_id: publicId }),
    });
    if (!response.ok) {
        await parseError("Failed to delete image in cloudinary");
    }
    return null;
}