import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import Review from "../models/review.js";

import { validationResult, matchedData } from "express-validator";

export const getAllReviews = catchAsync(async (req, res, next) => {
  const allReviews = await Review.find({});

  res.status(200).json({
    status: "success",
    data: {
      data: allReviews,
    },
  });
});

export const getReview = catchAsync(async (req, res, next) => {
  if (!req.params.reviewId) return next(new AppError("Missing review Id", 400));
  const review = await Review.findById(req.params.reviewId);

  res.status(200).json({
    status: "success",
    data: {
      data: review,
    },
  });
});

export const postReview = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // If there are validation errors, return a 400 Bad Request response with the error messages
    return res.status(400).json({ errors: errors.array() });
  }
  const data = matchedData(req);
  //@@TODO Find a good way to handle the project since owner will handled when auth is completed
  data.owner = req.body.owner;
  data.project = req.body.project;
  const newReview = await Review.create(data);

  res.status(201).json({
    status: "success",
    data: {
      data: newReview,
    },
  });
});

export const deleteReview = catchAsync(async (req, res, next) => {
  if (!req.params.reviewId) return next(new AppError("Review id missing", 400));

  const deletedReview = await Review.deleteOne({ _id: req.params.reviewId });

  //@@TODO update project likes/dislikes count

  return res.status(200).json({
    message: "success",
    data: {
      data: deletedReview,
    },
  });
});

export const updateReview = catchAsync(async (req, res, next) => {
  if (!req.params.reviewId) return next(new AppError("Review id missing", 400));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If there are validation errors, return a 400 Bad Request response with the error messages
    return res.status(400).json({ errors: errors.array() });
  }
  const data = matchedData(req);

  const updatedReview = await Review.findByIdAndUpdate(
    req.params.reviewId,
    data,
    { new: true, runValidators: true }
  );

  //@@TODO update project likes/dislikes count

  return res.status(200).json({
    message: "success",
    data: {
      data: updatedReview,
    },
  });
});
