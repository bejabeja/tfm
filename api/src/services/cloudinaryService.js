import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: "dybgqufyi",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class CloudinaryService {
    async deleteImage(publicId) {
        if (!publicId) throw new Error("publicId is required to delete image");

        try {
            const result = await cloudinary.uploader.destroy(publicId);
            return result;
        } catch (error) {
            console.error("Cloudinary delete error:", error);
            throw error;
        }
    }
}
