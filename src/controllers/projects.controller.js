import { validationResult, matchedData } from "express-validator";
import catchAsync from "../utils/catchAsync.js";
import Project from "../models/project.js";
import fs from "fs";

export const createProject = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // If there are validation errors, return a 400 Bad Request response with the error messages
    return res.status(400).json({ errors: errors.array() });
  }

  const data = matchedData(req);
  const newProject = new Project(data);

  const ext = req.file.mimetype.split("/")[1];
  const fileName = `project_${data.owner}_${newProject._id}.${ext}`;
  newProject.featuredImage = fileName;
  fs.writeFileSync(`public/img/projects/${fileName}`, req.file.buffer);

  await newProject.save();

  return res.status(201).json({
    message: "Success",
    data: newProject,
  });
});
