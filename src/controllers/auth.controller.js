import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import User from "../models/user.js";
import RefreshToken from "../models/refreshToken.js";
import { validationResult, matchedData } from "express-validator";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import crypto from "crypto";
import { match } from "assert";
import Email from "../utils/Email.js";

export const registerUser = catchAsync(async (req, res, next) => {
  console.log("AUTHH");
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // If there are validation errors, return a 400 Bad Request response with the error messages
    return res.status(400).json({ errors: errors.array() });
  }

  const body = matchedData(req);

  await User.create(body);

  return res.status(201).json({
    status: "Success",
    message:
      "Account was created successfully please check you email for verification",
  });
});

export const login = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If there are validation errors, return a 400 Bad Request response with the error messages
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = matchedData(req);

  const user = await User.findOne({ email }).select("password");
  if (!user || !(await User.comparePasswords(password, user.password))) {
    return next(new AppError("Invalid Credentials", 404));
  }

  if (!user.isVerified)
    return next(
      new AppError("Please verify you account first before logging in", 400)
    );

  //generate tokens
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_KEY, {
    expiresIn: 20,
    issuer: "my-site.com",
  });

  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_KEY, {
    expiresIn: "7d",
    issuer: "my-site.com",
  });

  await RefreshToken.create({ refreshToken, userId: user._id });

  //send refresh token in cookie
  res.cookie("refreshToken", refreshToken, {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    path: "/",
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
    accessToken,
    user,
  });
});

export const getCurrentUser = catchAsync(async (req, res, next) => {
  return res.status(200).json({
    status: "success",
    user: req.user,
  });
});

export const logout = catchAsync(async (req, res, next) => {
  res.clearCookie("refreshToken", {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    path: "/",
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
  });
});

export const refreshToken = catchAsync(async (req, res, next) => {
  const { refreshToken: refreshTokenFromCookie } = req.cookies;
  if (!refreshTokenFromCookie) {
    return next(
      new AppError("You are not logged in. Please log in to get access", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(
    refreshTokenFromCookie,
    process.env.JWT_REFRESH_KEY
  );

  const tokenFromDb = await RefreshToken.find({
    refreshToken: refreshTokenFromCookie,
    userId: decoded.id,
  });

  if (!tokenFromDb) {
    return next(new AppError("Invalid token", 401));
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_ACCESS_KEY, {
    expiresIn: 20,
    issuer: "my-site.com",
  });

  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_KEY, {
    expiresIn: "7d",
    issuer: "my-site.com",
  });

  await RefreshToken.updateOne({ userId: user._id }, { refreshToken });

  //send refresh token in cookies
  res.cookie("refreshToken", refreshToken, {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
    accessToken,
    user,
  });
});

export const verifyEmail = catchAsync(async (req, res, next) => {
  let verificationToken = req.params.emailToken;
  if (!verificationToken)
    return next(new AppError("Invalid token provided", 404));

  verificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  const user = await User.findOne({
    emailVerificationToken: verificationToken,
    emailVerificationTokenExpiration: { $gt: Date.now() },
  });

  if (!user) return next(new AppError("Invalid token provided", 404));

  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpiration = undefined;
  user.isVerified = true;

  await user.save();

  res.status(200).json({
    status: "Success",
    message: "Your email has been verified. You can now login and use the app",
  });
});

export const changeEmail = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // If there are validation errors, return a 400 Bad Request response with the error messages
    return res.status(400).json({ errors: errors.array() });
  }

  const { email: newEmail } = matchedData(req);

  const isNewEmailExist = await User.findOne({ email: newEmail });

  if (isNewEmailExist)
    return next(
      new AppError(
        "User with this email address already exist please choose a different one",
        401
      )
    );

  const user = await baseUserModel.findById({ _id: req.user._id });

  user.email = newEmail;
  user.isVerified = false;

  await user.save();

  res.status(200).json({
    status: "Success",
    message:
      "Email has been successfully changed you will receive an email for confirming the shortly",
  });
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // If there are validation errors, return a 400 Bad Request response with the error messages
    return res.status(400).json({ errors: errors.array() });
  }
  const { email } = matchedData(req);
  const user = await User.findOne({ email });
  if (!user) return next(new AppError("User doest not exist", 404));

  if (!user.isVerified)
    return next(
      new AppError(
        "Please verify your email first before resetting password",
        401
      )
    );

  let resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    let url = `${process.env.FRONT_END_BASE_URL}/verify/${resetToken}`;
    const emailClient = new Email(user, url);
    await emailClient.sendPasswordResetEmail();
    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiration = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const verificationToken = req.params.token;
  if (!verificationToken)
    return next(new AppError("User doest not exist", 404));

  verificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: verificationToken,
    passwordResetTokenExpiration: { $gt: Date.now() },
  });
  if (!user) return next(new AppError("User doest not exist", 404));

  user.password = req.body.password;
  user.confirmPassword = req.body.password;

  user.passwordResetToken = undefined;
  user.passwordResetTokenExpiration = undefined;

  await user.save();

  res.status(200).json({
    status: "Success",
    message:
      "Your password has been changed. You can now login and use the app",
  });
});
