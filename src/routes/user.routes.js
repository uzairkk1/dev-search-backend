import express from "express";
const router = express.Router();

import {
  changeEmail,
  forgotPassword,
  getCurrentUser,
  login,
  logout,
  refreshToken,
  registerUser,
  resetPassword,
  verifyEmail,
} from "../controllers/auth.controller.js";

import { registerAuthValidation } from "../validation/auth.validation.js";

router.post("/auth/register", registerAuthValidation, registerUser);
router.get("/auth/refresh", refreshToken);
router.post("/auth/login", login);
router.post("/auth/logout", logout);
router.post("/auth/currentUser", getCurrentUser);
router.post("/auth/email", changeEmail);
router.post("/auth/forgotPassword", forgotPassword);
router.post("/auth/resetPassword/:token", resetPassword);
router.get("/auth/emailVerification/:emailToken", verifyEmail);

export default router;
