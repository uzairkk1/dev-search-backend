import express from "express";
import {
  reviewPostSchema,
  reviewUpdateSchema,
} from "../validation/review.validation.js";
import {
  getAllReviews,
  getReview,
  postReview,
  deleteReview,
  updateReview,
} from "../controllers/review.controller.js";
const router = express.Router();

router.route("/").get(getAllReviews).post(reviewPostSchema, postReview);
router
  .route("/:reviewId")
  .get(getReview)
  .patch(reviewUpdateSchema, updateReview)
  .delete(deleteReview);

export default router;
