import express from "express";
import { authenticateUser } from "../middleware/authentication.js";
import {
  createPost,
  getMyPosts,
  getSinglePost,
  editPost,
  deletePost,
  getFollowingUserPosts,
  getExploreSectionPosts,
  saveUnsavePost,
  likeUnlikePost,
  getSavedPosts,
  getPostComments,
  getPostLikes,
  getUserPosts,
} from "../controllers/postController.js";

const router = express.Router();
router.use(authenticateUser);

router.route("/").post(createPost).get(getMyPosts);

router.get("/following", getFollowingUserPosts);
router.get("/explore", getExploreSectionPosts);

router.get("/saved", getSavedPosts);

router.post("/save", saveUnsavePost);
router.post("/like", likeUnlikePost);

router.get("/comments/:id", getPostComments);
router.post("/likes/:id", getPostLikes);
router.get("/posts/:id", getUserPosts);

router.route("/:id").get(getSinglePost).patch(editPost).delete(deletePost);

export default router;
