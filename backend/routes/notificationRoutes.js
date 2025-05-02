import express from "express";
import { authenticateUser } from "../middleware/authentication.js";
import {
  getAllNotifications,
  getSingleNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../controllers/notificationController.js";

const router = express.Router();
router.use(authenticateUser);

router
  .route("/")
  .get(getAllNotifications)
  .patch(markAllAsRead)
  .delete(deleteAllNotifications);

router
  .route("/:id")
  .get(getSingleNotification)
  .patch(markAsRead)
  .delete(deleteNotification);

export default router;
