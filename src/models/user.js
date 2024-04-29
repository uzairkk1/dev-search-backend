import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import Email from "../utils/Email";
import { ROLES_TYPES, AUTH_TYPES } from "../utils/constants";

const socialSchema = new Schema({
  github: String,
  twitter: String,
  youtube: String,
  linkedin: String,
  website: String,
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
      min: [3],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    headline: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    photo: {
      type: String,
      default: "default.jpg",
    },
    role: {
      type: String,
      enum: [ROLES_TYPES.ADMIN, ROLES_TYPES.USER],
      default: ROLES_TYPES.USER,
    },
    password: {
      type: String,
      required: [true, "Please provide your password"],
      minLength: 8,
      trim: true,
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "Please provide Confirm Password"],
      minLength: 8,
      trim: true,
      select: false,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not same",
      },
    },
    socialLinks: socialSchema,
    active: {
      type: Boolean,
      select: false,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpiration: Date,
    emailChangedAt: Date,
    emailVerificationToken: String,
    emailVerificationTokenExpiration: String,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcryptjs.hash(this.password, 12);
    this.confirmPassword = undefined;
  }
  if (this.isModified("email")) {
    this.emailVerificationToken = this.createEmailVerificationToken();
  }

  this.wasNew = this.isNew;
  next();
});

userSchema.pre("save", async function (next) {
  if (this.isNew) return;

  if (this.isModified("password")) {
    this.passwordChangedAt = Date.now() - 1000;
    this.isPasswordModified = true;
  }
  if (this.isModified("email")) {
    this.passwordChangedAt = Date.now() - 1000;
    this.isPasswordModified = true;
  }

  next();
});

userSchema.post("save", async function (doc) {
  if (doc && (doc.isEmailModified || doc.wasNew)) {
    const emailClient = new Email(
      doc,
      `${process.env.FRONT_END_BASE_URL}/verify/${doc.emailToken}`
    );

    await emailClient.sendWelcomeEmail();
  }
});

userSchema.methods.comparePasswords = async function (candidate, password) {
  return await bcryptjs.compare(candidate, password);
};

userSchema.methods.createEmailVerificationToken = function () {
  const verificationToken = crypto.randomBytes(32).toString("hex");

  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  this.emailVerificationTokenExpiration = Date.now() + 10 * 60 * 1000;

  return verificationToken;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetTokenExpiration = Date.now() * 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.verifyToken = function (dbToken, paramToken, expiration) {
  let isExpired = new Date(expiration).getTime >= Date.now();
  if (isExpired) return isExpired;

  let token = crypto.createHash("256").update(paramToken).digest("hex");

  return token === dbToken;
};

userSchema.methods.isChangedAfter = function (iat, type) {
  if (type === AUTH_TYPES.EMAIL && this.emailChangedAt) {
    return new Date(iat).getTime() < new Date(this.emailChangedAt).getTime();
  } else if (type === AUTH_TYPES.PASSWORD && this.passwordChangedAt) {
    return new Date(iat).getTime() < new Date(this.passwordChangedAt).getTime();
  }
};

export default mongoose.model("User", userSchema);
