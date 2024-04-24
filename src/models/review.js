import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    content: {
      type: String,
      required: true,
      max: [150, "Review should be 150 characters"],
    },
    vote: {
      type: String,
      enum: ["UP", "DOWN"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
