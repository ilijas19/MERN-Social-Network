import express from "express";
import {
  followUnfollow,
  getFollowRequests,
  acceptFollowRequest,
  declineFollowRequest,
  getFollowersList,
  getFollowingList,
  searchForUser,
  removeFollower,
} from "../controllers/userController.js";
import { authenticateUser } from "../middleware/authentication.js";

// api/v1/user
const router = express.Router();

router.use(authenticateUser);

router.get("/search", searchForUser);
router.post("/followUnfollow", followUnfollow);
router.get("/requests", getFollowRequests);
router.post("/accept", acceptFollowRequest);
router.post("/removeFollower", removeFollower);
router.delete("/decline", declineFollowRequest);
router.get("/followers", getFollowersList);
router.get("/following", getFollowingList);

export default router;
