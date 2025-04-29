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

router.get("/likes/:id", getPostLikes);
router.get("/posts/:id", getUserPosts);

router
  .route("/singlePost/:id")
  .get(getSinglePost)
  .patch(editPost)
  .delete(deletePost);

export default router;
