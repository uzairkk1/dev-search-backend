import { validationResult, matchedData } from "express-validator";
import catchAsync from "../utils/catchAsync.js";
import Project from "../models/project.js";
import fs from "fs";
import AppError from "../utils/AppError.js";

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

export const getAllProjetcs = catchAsync(async (req, res, next) => {
  const allProjects = await Project.find({});

  return res.status(200).json({
    message: "success",
    data: {
      totalItems: allProjects.length,
      data: allProjects,
    },
  });
});

export const getProject = catchAsync(async (req, res, next) => {
  if (!req.params.projectId)
    return next(new AppError("Project id missing", 400));
  const project = await Project.find({ _id: req.params.projectId });

  return res.status(200).json({
    message: "success",
    data: {
      data: project,
    },
  });
});

export const deleteProject = catchAsync(async (req, res, next) => {
  if (!req.params.projectId)
    return next(new AppError("Project id missing", 400));
  const deletedProject = await Project.deleteOne({ _id: req.params.projectId });
  console.log(deletedProject);
  //@@TODO add cronjob to delete the project image as well
  return res.status(200).json({
    message: "success",
    data: {
      data: deletedProject,
    },
  });
});

export const updateProject = catchAsync(async (req, res, next) => {
  if (!req.params.projectId)
    return next(new AppError("Project id missing", 400));

  let body = { ...req.body };
  if (req.file != undefined) {
    const ext = req.file.mimetype.split("/")[1];
    const ownerId = "6553d303c9ad6c4be3738d16";
    const fileName = `project_${ownerId}_${req.params.projectId}.${ext}`;
    body.featuredImage = fileName;
    fs.writeFileSync(`public/img/projects/${fileName}`, req.file.buffer);
  }
  const project = await Project.findByIdAndUpdate(req.params.projectId, body, {
    new: true,
    runValidators: true,
  });

  if (!project) {
    return next(new AppError("No project found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: project,
    },
  });
});
