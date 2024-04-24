import { checkSchema } from "express-validator";
const postSchema = checkSchema({
  //@@TODO Remove owner
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
  image: {
    custom: {
      options: (value, { req }) => {
        if (!req.file) {
          return false;
        }
        // You can add additional validation for the image file if needed
        return true;
      },
      errorMessage: "Image file is missing",
    },
    custom: {
      options: (value, { req }) => {
        if (!req.file) {
          throw new Error("Image file is required");
        }
        if (!req.file.mimetype.startsWith("image")) {
          throw new Error("Only images are supported");
        }
        // You can add additional validation for the image file if needed
        return true;
      },
      //   errorMessage: "Only image file can be uploaded",
    },
  },
});

const updateSchema = checkSchema({
  //@@TODO Remove owner
  owner: {
    trim: true,
    isMongoId: {
      errorMessage: "Invalid id provided",
    },
  },
  title: {
    exists: {
      if: (value, { req }) => !!req.body.title,
    },
    trim: true,
    isLength: {
      options: { min: 3, max: 150 },
      errorMessage: "must be between 3 and 150 characters",
    },
  },
  description: {
    exists: {
      if: (value, { req }) => !!req.body.description,
    },
    trim: true,
    isLength: {
      options: { min: 8, max: 500 },
      errorMessage: "must be between 3 and 500 characters",
    },
  },
  demoLink: {
    exists: {
      if: (value, { req }) => !!req.body.demoLink,
    },
    isURL: {
      errorMessage: "Please provide a valid URL",
    },
  },
  sourceCode: {
    exists: {
      if: (value, { req }) => !!req.body.sourceCode,
    },
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
  //   image: {
  //     custom: {
  //       options: (value, { req }) => {
  //         if (!req.file) {
  //           return false;
  //         }
  //         // You can add additional validation for the image file if needed
  //         return true;
  //       },
  //       errorMessage: "Image file is missing",
  //     },
  //     custom: {
  //       options: (value, { req }) => {
  //         if (!req.file) {
  //           throw new Error("Image file is required");
  //         }
  //         if (!req.file.mimetype.startsWith("image")) {
  //           throw new Error("Only images are supported");
  //         }
  //         // You can add additional validation for the image file if needed
  //         return true;
  //       },
  //       //   errorMessage: "Only image file can be uploaded",
  //     },
  //   },
});

export { postSchema, updateSchema };
