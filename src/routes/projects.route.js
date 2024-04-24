import express from "express";
import {
  createProject,
  deleteProject,
  getAllProjetcs,
  getProject,
  updateProject,
} from "../controllers/projects.controller.js";
import { postSchema, updateSchema } from "../validation/projects.validation.js";
import { memoryUpload } from "../middlewares/multer.js";
const router = express.Router();

router
  .route("/")
  .get(getAllProjetcs)
  .post(memoryUpload.single("image"), postSchema, createProject);

router
  .route("/:projectId")
  .get(getProject)
  .patch(memoryUpload.single("image"), updateSchema, updateProject)
  .delete(deleteProject);

export default router;
