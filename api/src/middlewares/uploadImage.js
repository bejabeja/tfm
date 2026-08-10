import multer from "multer";
import { ValidationError } from "../errors/ValidationError.js";

const storage = multer.memoryStorage(); // save in memory

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
        return cb(new ValidationError("Only image files are allowed"));
    }
    cb(null, true);
};

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter,
});

