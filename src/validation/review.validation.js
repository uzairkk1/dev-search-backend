import { checkSchema } from "express-validator";
const reviewPostSchema = checkSchema({
  content: {
    exists: {
      if: (value, { req }) => !!req.body.content,
    },
    trim: true,
    isLength: {
      options: { max: 150 },
      errorMessage: "must be less than 150 characters",
    },
  },
  vote: {
    trim: true,
    custom: {
      options: (value, { req }) => {
        if (req.body.vote === "UP" || req.body.vote === "DOWN") {
          return true;
        }
        // You can add additional validation for the image file if needed
        return false;
      },
      errorMessage: "Invalid vote type",
    },
  },
});

const reviewUpdateSchema = reviewPostSchema;

export { reviewPostSchema, reviewUpdateSchema };
