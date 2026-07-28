import express from "express";
import {
  getTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleActiveTestimonial,
} from "../controllers/admin.testimonial.controller.js";
import {
  verifyAdminJWT,
  hasPermission,
} from "../middlewares/admin.middleware.js";
import { uploadFiles } from "../middlewares/multer.middlerware.js";

const router = express.Router();

router.get(
  "/testimonials",
  verifyAdminJWT,
  hasPermission("banners", "read"),
  getTestimonials
);

router.get(
  "/testimonials/:testimonialId",
  verifyAdminJWT,
  hasPermission("banners", "read"),
  getTestimonialById
);

router.post(
  "/testimonials",
  verifyAdminJWT,
  hasPermission("banners", "create"),
  uploadFiles.fields([{ name: "image", maxCount: 1 }]),
  createTestimonial
);

router.put(
  "/testimonials/:testimonialId",
  verifyAdminJWT,
  hasPermission("banners", "update"),
  uploadFiles.fields([{ name: "image", maxCount: 1 }]),
  updateTestimonial
);

router.delete(
  "/testimonials/:testimonialId",
  verifyAdminJWT,
  hasPermission("banners", "delete"),
  deleteTestimonial
);

router.patch(
  "/testimonials/:testimonialId/toggle",
  verifyAdminJWT,
  hasPermission("banners", "update"),
  toggleActiveTestimonial
);

export default router;
