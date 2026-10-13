import express from "express";
import { verifyJWTToken, optionalAuth } from "../middlewares/auth.middleware.js";
import {
  verifyCoupon,
  applyCoupon,
  getAvailableCoupons,
} from "../controllers/coupon.controller.js";

const router = express.Router();

// Public route to verify a coupon code without authentication
router.post("/verify", optionalAuth, verifyCoupon);

// Public list of coupons the customer can use (guests and logged-in users)
router.get("/available", optionalAuth, getAvailableCoupons);

// Protected route to apply a coupon to the user's cart
router.post("/apply", verifyJWTToken, applyCoupon);

export default router;
