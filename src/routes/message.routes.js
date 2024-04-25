import express from "express";
import {
  messagePostSchema,
  messageUpdateSchema,
} from "../validation/message.validation.js";
import {
  createMessage,
  getMessage,
  getMessages,
  updateMessage,
  deleteMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.route("/").get(getMessages).post(messagePostSchema, createMessage);
router
  .route("/:msgId")
  .get(getMessage)
  .patch(messageUpdateSchema, updateMessage)
  .delete(deleteMessage);

export default router;
