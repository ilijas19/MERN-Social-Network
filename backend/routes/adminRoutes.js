import express from "express";
import { getAllUsers, getSingleUser } from "../controllers/adminController.js";
import {
  authenticateUser,
  authorizeAdmin,
} from "../middleware/authentication.js";
const router = express.Router();

router.use(authenticateUser, authorizeAdmin);

router.route("/").get(getAllUsers);

router.route("/:id").get(getSingleUser);

export default router;
