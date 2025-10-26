import express from "express";
import { isLoggedIn } from "../utils/isLoggedIn.js";
import hostController from "../controllers/hostController.js";
import { authLimiter } from "../utils/rateLimiters.js";

const router = express.Router();

// DASHBOARD HOME
router.get("/", isLoggedIn, hostController.dashboardHome);

// LISTINGS
router.get("/listings",isLoggedIn, hostController.listingsOverview); 
router.get("/listings/:id", isLoggedIn, hostController.viewListing);

// DYNAMIC PRICING
router.get("/listings/:id/pricing",isLoggedIn, hostController.dynamicPricing);

// BOOKINGS
router.get("/bookings", isLoggedIn, hostController.bookingsOverview);
router.get("/bookings/:bookingId", isLoggedIn, hostController.bookingDetails);

// ✅ HIDE BOOKING ROUTE
router.patch("/bookings/:bookingId/hide", isLoggedIn, authLimiter, hostController.hideBookingFromHost);

// ANALYTICS
router.get("/analytics", isLoggedIn, authLimiter, hostController.analytics);

export default router;