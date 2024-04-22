import { validationResult, matchedData } from "express-validator";
import catchAsync from "../utils/catchAsync.js";
import Project from "../models/project.js";

export const createProject = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // If there are validation errors, return a 400 Bad Request response with the error messages
    return res.status(400).json({ errors: errors.array() });
  }

  const data = matchedData(req);
  const newProject = await Project.create(data);

  return res.status(201).json({
    message: "Success",
    data: newProject,
  });
});
