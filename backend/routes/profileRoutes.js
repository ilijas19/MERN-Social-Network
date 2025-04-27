import express from "express";
import {
  getMyProfile,
  getUserProfile,
  updateProfile,
  updatePassword,
  changeProfilePrivacy,
  deleteProfile,
} from "../controllers/profileController.js";
import { authenticateUser } from "../middleware/authentication.js";
const router = express.Router();
router.use(authenticateUser);

//api/v1/profile
router.route("/").get(getMyProfile).patch(updateProfile).delete(deleteProfile);

router.route("/updatePrivacy").patch(changeProfilePrivacy);
router.route("/updatePassword").patch(updatePassword);

router.route("/:username").get(getUserProfile);

export default router;
