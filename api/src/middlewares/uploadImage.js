import multer from "multer";

const storage = multer.memoryStorage(); // save in memory
export const upload = multer({ storage });

