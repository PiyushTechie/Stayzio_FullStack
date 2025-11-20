// routes/authRoutes.js
import express from "express";
import passport from "passport";
import { authLimiter } from '../utils/rateLimiters.js';

const router = express.Router();

// ✅ Google Login
router.get("/google", authLimiter, passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  (req, res) => {
    if (!req.user) {
      req.flash("error", "Account not found or has been deleted.");
      return res.redirect("/login");
    }

    // --- START: MODIFIED LOGIC ---
    if (!req.user.profile.name || req.user.profile.name === "") {
      // Profile is incomplete, redirect to setup
      req.flash("success", "Welcome! Let's finish setting up your profile.");
      res.redirect("/profile/setup");
    } else {
      // Profile is complete, redirect to listings
      req.flash("success", `Welcome ${req.user.username || "traveler"}!`);
      res.redirect("/listings");
    }
    // --- END: MODIFIED LOGIC ---
  }
);

// ✅ Facebook Login
router.get("/facebook", authLimiter, passport.authenticate("facebook", { scope: ["email"] }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  (req, res) => {
    if (!req.user) {
      req.flash("error", "Account not found or has been deleted.");
      return res.redirect("/login");
    }

    // --- START: MODIFIED LOGIC ---
    if (!req.user.profile.name || req.user.profile.name === "") {
      // Profile is incomplete, redirect to setup
      req.flash("success", "Welcome! Let's finish setting up your profile.");
      res.redirect("/profile/setup");
    } else {
      // Profile is complete, redirect to listings
      req.flash("success", "Welcome back via Facebook!");
      res.redirect("/listings");
    }
    // --- END: MODIFIED LOGIC ---
  }
);

// ✅ GitHub Login
router.get("/github", authLimiter, passport.authenticate("github", { scope: ["user:email"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  (req, res) => {
    if (!req.user) {
      req.flash("error", "Account not found or has been deleted.");
      return res.redirect("/login");
    }

    // --- START: MODIFIED LOGIC ---
    if (!req.user.profile.name || req.user.profile.name === "") {
      // Profile is incomplete, redirect to setup
      req.flash("success", "Welcome! Let's finish setting up your profile.");
      res.redirect("/profile/setup");
    } else {
      // Profile is complete, redirect to listings
      req.flash("success", `Welcome ${req.user.username || "traveler"} via GitHub!`);
      res.redirect("/listings");
    }
    // --- END: MODIFIED LOGIC ---
  }
);

export default router;