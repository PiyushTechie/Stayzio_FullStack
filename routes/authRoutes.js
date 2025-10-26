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
    req.flash("success", `Welcome ${req.user.username || "traveler"}!`);
    res.redirect("/listings");
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
    req.flash("success", "Welcome back via Facebook!");
    res.redirect("/listings");
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
    req.flash("success", `Welcome ${req.user.username || "traveler"} via GitHub!`);
    res.redirect("/listings");
  }
);

export default router;