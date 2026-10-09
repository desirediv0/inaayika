import express from "express";
import {
  getAdminAnnouncements,
  updateAdminAnnouncements,
} from "../controllers/announcement.controller.js";
import {
  verifyAdminJWT,
  hasPermission,
} from "../middlewares/admin.middleware.js";

const router = express.Router();

router.get(
  "/announcement-settings",
  verifyAdminJWT,
  hasPermission("settings", "read"),
  getAdminAnnouncements
);

router.patch(
  "/announcement-settings",
  verifyAdminJWT,
  hasPermission("settings", "update"),
  updateAdminAnnouncements
);

export default router;
