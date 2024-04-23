import express from "express";
import { createProject } from "../controllers/projects.controller.js";
import { postSchema } from "../validation/projects.validation.js";
import { memoryUpload } from "../middlewares/multer.js";
const router = express.Router();

router.route("/").post(memoryUpload.single("image"), postSchema, createProject);

export default router;
