import express from "express";
import {
  createComment,
  deleteComment,
  editComment,
  getPostComments,
  createCommentReply,
  getCommentReplies,
  deleteCommentReply,
} from "../controllers/commentController.js";
import { authenticateUser } from "../middleware/authentication.js";
const router = express.Router();

router.use(authenticateUser);

router.post("/", createComment);
router.post("/reply/:id", createCommentReply);
router.delete("/reply", deleteCommentReply);
router.get("/commentReplies/:id", getCommentReplies);
router.get("/postComments/:id", getPostComments);

router.route("/:id").delete(deleteComment).patch(editComment);

export default router;
