import multer from "multer";

const memoryStorage = multer.memoryStorage();
const memoryUpload = multer({
  storage: memoryStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limiting file size to 10MB (optional)
});

export { memoryUpload };
