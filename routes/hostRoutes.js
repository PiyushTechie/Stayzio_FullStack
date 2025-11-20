import express from "express";
import { isLoggedIn } from "../utils/isLoggedIn.js";
import hostController from "../controllers/hostController.js";
import { authLimiter } from "../utils/rateLimiters.js";
import { isHostOrAdmin } from "../middlewares/roleMiddleware.js";
const router = express.Router();
import multer from "multer";
import path from "path";
import User from "../models/user.js";

import csurf from "csurf";
const csrfProtection = csurf({ cookie: true });

router.get("/", isLoggedIn, isHostOrAdmin, csrfProtection, hostController.dashboardHome);

// LISTINGS
router.get("/listings", isLoggedIn, isHostOrAdmin, csrfProtection, hostController.listingsOverview);
router.get("/listings/:id", isLoggedIn, isHostOrAdmin, csrfProtection, hostController.viewListing);

// DYNAMIC PRICING
router.get("/listings/:id/pricing", isLoggedIn, isHostOrAdmin, csrfProtection, hostController.dynamicPricing);

// BOOKINGS
router.get("/bookings", isLoggedIn, isHostOrAdmin, csrfProtection, hostController.bookingsOverview);
router.get("/bookings/:bookingId", isLoggedIn, isHostOrAdmin, csrfProtection, hostController.bookingDetails);

// ANALYTICS
router.get("/analytics", isLoggedIn, authLimiter, isHostOrAdmin, csrfProtection, hostController.analytics);

// configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/host_verifications/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.get("/setup", isLoggedIn, csrfProtection, async (req, res) => {
  if (req.user.role === "host" || req.user.role === "admin") {
    req.flash("info", "You are already a host/admin!");
    return res.redirect("/host"); 
  }

  res.render("hosts/hostSetup", { csrfToken: req.csrfToken() });
});

router.post(
  "/setup",
  isLoggedIn,
  csrfProtection,
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "idProof", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { name, phone, country, postalCode, language, currency, bio, idType } = req.body;
      const profilePath = req.files?.profilePhoto?.[0]?.path || null;
      const idProofPath = req.files?.idProof?.[0]?.path || null;

      await User.findByIdAndUpdate(req.user._id, {
        $set: {
          role: "host",
          hostDetails: { name, phone, country, postalCode, language, currency, bio, idType, profilePhoto: profilePath, idProof: idProofPath, verified: false, joinedAt: new Date() }
        }
      });
      req.user.role = "host";
      req.flash("success", "You’re now a Host! Welcome to Stayzio Hosting.");
      res.redirect("/host");
    } catch (err) {
      console.error("❌ HOST SETUP ERROR:", err);
      req.flash("error", "Error during host setup. Please try again.");
      res.redirect("/host/setup");
    }
  }
);

router.post("/revert", isLoggedIn, csrfProtection, async (req, res) => {
  try {
    if (req.user.role !== "host") {
      req.flash("info", "You are not currently a host.");
      return res.redirect("/profile"); 
    }

    await User.findByIdAndUpdate(req.user._id, {
      $set: {
        role: "guest",
        hostDetails: null
      }
    });

    req.user.role = "guest"; 
    req.flash("success", "You are now a Guest again. Hosting privileges removed.");
    res.redirect("/profile");
  } catch (err) {
    console.error("Revert to Guest Error:", err);
    req.flash("error", "Something went wrong while reverting to guest mode.");
    res.redirect("/host");
  }
});


export default router;