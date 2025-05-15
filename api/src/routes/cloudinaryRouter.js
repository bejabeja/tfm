import { v2 as cloudinary } from 'cloudinary';
import { Router } from "express";

cloudinary.config({
    cloud_name: 'dybgqufyi',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const createCloudinaryRouter = () => {
    const router = Router();
    router.delete("/image", async (req, res) => {
        const { public_id } = req.body;
        if (!public_id) {
            return res.status(400).json({ error: "public_id is required" });
        }

        try {
            const result = await cloudinary.uploader.destroy(public_id);
            res.json({ success: true, result });
        } catch (error) {
            res.status(500).json({ error: "Failed to delete image", details: error });
        }
    });

    return router;
}