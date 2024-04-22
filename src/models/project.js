import mongoose from "mongoose";
import { checkSchema } from "express-validator";

const projectSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
      max: [150, "Title should be less than 150 characters"],
    },
    description: {
      type: String,
      required: true,
      max: [500, "Description should be 500 characters"],
    },
    featuredImage: {
      type: String,
      default: "default.jpg",
    },
    demoLink: {
      type: String,
      required: true,
      trim: true,
    },
    sourceCode: {
      type: String,
      required: true,
      trim: true,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    dislikesCount: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
