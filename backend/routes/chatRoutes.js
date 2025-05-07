import express from "express";
const router = express.Router();

import {
  createChat,
  getAllChats,
  getChatMessages,
  sendMessage,
  deleteChatForUser,
} from "../controllers/chatController.js";
import { authenticateUser } from "../middleware/authentication.js";

router.use(authenticateUser);
router.route("/").post(createChat).get(getAllChats);

router.post("/message", sendMessage);

router.route("/:id").get(getChatMessages).delete(deleteChatForUser);

export default router;
