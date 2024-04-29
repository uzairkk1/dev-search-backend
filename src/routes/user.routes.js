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

router.post("/auth/register", registerUser);
router.get("/auth/refresh", refreshToken);
router.post("/auth/login", login);
router.post("/auth/logout", logout);
router.post("/auth/currentUser", getCurrentUser);
router.post("/auth/email", changeEmail);
router.post("/auth/forgotPassword", forgotPassword);
router.post("/auth/resetPassword/:token", resetPassword);
router.get("/auth/emailVerification", verifyEmail);

export default router;
