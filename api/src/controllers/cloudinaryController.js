export class CloudinaryController {
    constructor(cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }

    async deleteImage(req, res, next) {
        const { public_id } = req.body;
        if (!public_id) {
            return res.status(400).json({ error: "public_id is required" });
        }
        try {
            const result = await this.cloudinaryService.deleteImage(public_id);
            res.json({ success: true, result });
        } catch (error) {
            next(error);
        }
    }
}
