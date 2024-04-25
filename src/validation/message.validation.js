import { checkSchema } from "express-validator";
const messagePostSchema = checkSchema({
  subject: {
    exists: {
      if: (value, { req }) => !!req.body.subject,
    },
    trim: true,
    isLength: {
      options: { max: 100 },
      errorMessage: "must be less than 100 characters",
    },
  },
  content: {
    exists: {
      if: (value, { req }) => !!req.body.content,
    },
    trim: true,
    isLength: {
      options: { max: 250 },
      errorMessage: "must be less than 250 characters",
    },
  },
  isRead: {
    isBoolean: {
      errorMessage: "Invalid type should be boolean.",
    },
  },
});

const messageUpdateSchema = messagePostSchema;

export { messagePostSchema, messageUpdateSchema };
