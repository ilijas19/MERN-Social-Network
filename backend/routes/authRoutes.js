import express from "express";
import {
  register,
  login,
  logout,
  getCurrentUser,
} from "../controllers/authController.js";
import { authenticateUser } from "../middleware/authentication.js";

const router = express.Router();

// /api/v1/auth
router.post("/register", register);
router.post("/login", login);
router.delete("/logout", authenticateUser, logout);
router.get("/me", authenticateUser, getCurrentUser);

export default router;
