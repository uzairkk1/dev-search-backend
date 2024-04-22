import { checkSchema } from "express-validator";
const postSchema = checkSchema({
  owner: {
    trim: true,
    isMongoId: {
      errorMessage: "Invalid id provided",
    },
  },
  title: {
    trim: true,
    isLength: {
      options: { min: 3, max: 150 },
      errorMessage: "must be between 3 and 150 characters",
    },
  },
  description: {
    trim: true,
    isLength: {
      options: { min: 8, max: 500 },
      errorMessage: "must be between 3 and 500 characters",
    },
  },
  demoLink: {
    isURL: {
      errorMessage: "Please provide a valid URL",
    },
  },
  sourceCode: {
    isURL: {
      errorMessage: "Please provide a valid URL",
    },
  },
  tags: {
    isArray: {
      options: { min: 1 },
      errorMessage: "Project must have atleast one tag",
    },
  },
});

export { postSchema };
