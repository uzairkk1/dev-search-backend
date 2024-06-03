import { checkSchema } from "express-validator";

const registerAuthValidation = checkSchema({
  name: {
    trim: true,
    isLength: {
      options: { min: 3 },
      errorMessage: "Name must need to have 3 or more characters",
    },
  },
  username: {
    trim: true,
    isLength: {
      options: { min: 3 },
      errorMessage: "username must need to have 3 or more characters",
    },
  },
  email: {
    trim: true,
    isEmail: {
      errorMessage: "Must be a valid e-mail address",
    },
  },
  password: {
    trim: true,
    isLength: {
      options: { min: 3 },
      errorMessage: "Password must have a length of atleast 8 characters",
    },
  },
  confirmPassword: {
    trim: true,
    isLength: {
      options: { min: 3 },
      errorMessage:
        "Confirm Password must have a length of atleast 8 characters",
    },
    custom: {
      options: (value, { req }) => {
        if (value != req.body.password) {
          throw new Error("Confirm password does not match with password");
        }
        return true;
      },
    },
  },
});

export { registerAuthValidation };
