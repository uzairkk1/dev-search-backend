import express from "express";
import { createProject } from "../controllers/projects.controller.js";
import { postSchema } from "../validation/projects.validation.js";
const router = express.Router();

router.route("/").post(postSchema, createProject);

export default router;
