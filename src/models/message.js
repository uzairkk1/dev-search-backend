import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    subject: {
      type: String,
      required: true,
      max: [100, "subject should be 100 characters"],
    },
    content: {
      type: String,
      required: true,
      max: [250, "Subject should be 250 characters"],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
