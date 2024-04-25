import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import { matchedData, validationResult } from "express-validator";
import Message from "../models/message.js";

export const createMessage = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If there are validation errors, return a 400 Bad Request response with the error messages
    return res.status(400).json({ errors: errors.array() });
  }

  const data = matchedData(req);
  //@@TODO CHANGED ONCE USER AUTH IS COMPLETED
  data.sender = "6553d303c9ad6c4be3738d16";
  data.recipient = "6553d303c9ad6c4be3738d17";

  const newMessage = await Message.create(data);

  return res.status(201).json({
    status: "Success",
    message: "Message has been sent successfully",
    data: {
      data: newMessage,
    },
  });
});

export const getMessages = catchAsync(async (req, res, next) => {
  const messages = await Message.find({
    recipient: "6553d303c9ad6c4be3738d17",
  });

  return res.status(200).json({
    status: "success",
    count: messages.length,
    data: {
      data: messages,
    },
  });
});

export const getMessage = catchAsync(async (req, res, next) => {
  if (!req.params.msgId) return next(new AppError("message id missing", 400));

  const message = await Message.find({ _id: req.params.msgId });

  return res.status(200).json({
    message: "success",
    data: {
      data: message,
    },
  });
});

export const deleteMessage = catchAsync(async (req, res, next) => {
  if (!req.params.msgId) return next(new AppError("Message id missing", 400));
  const deletedMessage = await Message.deleteOne({ _id: req.params.msgId });
  console.log(deletedMessage);
  return res.status(200).json({
    message: "success",
    data: {
      data: deletedMessage,
    },
  });
});

export const updateMessage = catchAsync(async (req, res, next) => {
  if (!req.params.msgId) return next(new AppError("message id missing", 400));
  const isRead = req.body.isRead || false;
  const message = await Message.findByIdAndUpdate(
    req.params.msgId,
    { isRead },
    { new: true, runValidators: true }
  );

  if (!message) {
    return next(new AppError("No message found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: message,
    },
  });
});
