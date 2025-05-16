import { Router } from "express";
import { CloudinaryController } from "../controllers/cloudinaryController.js";
import { CloudinaryService } from "../services/cloudinaryService.js";

export const createCloudinaryRouter = () => {
    const router = Router();
    const cloudinaryService = new CloudinaryService();
    const cloudinaryController = new CloudinaryController(cloudinaryService);

    router.delete("/image", cloudinaryController.deleteImage.bind(cloudinaryController));

    return router;
};
