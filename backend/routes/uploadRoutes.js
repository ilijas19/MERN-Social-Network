import express from "express";
import { uploadImage } from "../controllers/uploadController.js";
import { authenticateUser } from "../middleware/authentication.js";

const router = express.Router();
router.use(authenticateUser);
router.route("/").post(uploadImage);

export default router;
