import express from "express";
const router = express.Router();

import wrapAsync from "../utils/wrapAsync.js";
import passport from "passport";
import { saveRedirectUrl, isLoggedIn } from "../utils/isLoggedIn.js";
import userController from "../controllers/users.js";
import { authLimiter } from "../utils/rateLimiters.js";
import multer from "multer";

// CSRF must be imported BEFORE routes
import csrfProtection from "../utils/csrf.js";

import User from "../models/user.js";
import path from "path";
import DatauriParser from "datauri/parser.js";

// ✅ FIXED IMPORT: Destructure cloudinary from your config
// If this still fails, change it to: import { v2 as cloudinary } from 'cloudinary';
import cloudinary from "../cloudConfig.js"; 

console.log("user.js router loaded");

// Multer memory storage (Required for Datauri)
const parser = new DatauriParser();
const upload = multer({ storage: multer.memoryStorage() });

/* ============================================================
   SIGNUP
============================================================ */
router
  .route("/signup")
  .get(csrfProtection, userController.renderSignUpForm)
  .post(authLimiter, csrfProtection, wrapAsync(userController.signup));

/* ============================================================
   OTP VERIFICATION
============================================================ */
router
  .route("/verify-otp")
  .get(csrfProtection, (req, res) => {
    res.render("users/verifyOtp", { 
      user: req.user, 
      csrfToken: req.csrfToken(),
      messages: {
        error: req.flash("error"),
        success: req.flash("success")
      }
    });
  })
  .post(authLimiter, csrfProtection, wrapAsync(userController.verifyOtp));

/* ============================================================
   LOGIN / LOGOUT
============================================================ */
router
  .route("/login")
  .get(csrfProtection, userController.renderLoginForm)
  .post(
    authLimiter,
    csrfProtection,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: "Invalid email or password.",
    }),
    saveRedirectUrl,
    userController.login
  );

router.post("/logout", csrfProtection, userController.logout);

/* ============================================================
   FORGOT PASSWORD / OTP RESET
============================================================ */
router
  .route("/forgot-password")
  .get(csrfProtection, userController.renderForgotPasswordForm)
  .post(authLimiter, csrfProtection, wrapAsync(userController.forgotPassword));

router
  .route("/reset-password-otp")
  .get(csrfProtection, userController.renderResetPasswordForm)
  .post(authLimiter, csrfProtection, wrapAsync(userController.resetPassword));

router.post(
  "/resend-otp",
  authLimiter,
  csrfProtection,
  wrapAsync(userController.resendOtp)
);

/* ============================================================
   PROFILE ROUTES
============================================================ */
router.get("/profile", isLoggedIn, csrfProtection, wrapAsync(userController.userProfile));

router.get(
  "/profile/setup",
  isLoggedIn,
  csrfProtection,
  (req, res) => {
    res.render("users/profileSetup", {
      user: req.user,
      csrfToken: req.csrfToken(),
    });
  }
);

// PROFILE SETUP
router.post(
  "/profile",
  isLoggedIn,
  upload.single("photo"),
  csrfProtection,
  wrapAsync(userController.updateProfile)
);

// EDIT PROFILE GET
router.get(
  "/profile/edit",
  isLoggedIn,
  csrfProtection,
  (req, res) => {
    res.render("users/editProfile", {
      user: req.user,
      csrfToken: req.csrfToken(),
    });
  }
);

// ✅ EDIT PROFILE POST (FIXED)
router.post(
  "/profile/edit",
  isLoggedIn,
  upload.single("photo"), // Multer parses body first
  csrfProtection,         // CSRF checks token second
  async (req, res, next) => {
    try {
      console.log("Hit Profile Edit Route"); // Debug log

      // 1. Parse body data
      const { name, address, phone, country, bio } = req.body;

      const updateData = {
        "profile.name": name || "",
        "profile.address": address || "",
        "profile.country": country || "",
        "profile.phone": phone || "",
        "profile.bio": bio || "",
      };

      // 2. Handle Photo Upload
      if (req.file) {
        console.log("Processing file...");

        // Delete old image if exists (Safe delete)
        if (req.user.profile?.photo?.filename) {
          try {
             await cloudinary.uploader.destroy(req.user.profile.photo.filename);
          } catch(e) {
             console.log("Could not delete old image:", e.message);
          }
        }

        // Upload new image
        const ext = path.extname(req.file.originalname).toString();
        const file64 = parser.format(ext, req.file.buffer);
        
        // Ensure cloudinary is configured
        if (!cloudinary.uploader) {
           throw new Error("Cloudinary configuration is invalid in routes/user.js");
        }

        const result = await cloudinary.uploader.upload(file64.content, {
          folder: "stayzio_profile",
        });

        updateData["profile.photo"] = {
          url: result.secure_url,
          filename: result.public_id,
        };
      }

      // 3. Update DB
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      // 4. Refresh Session
      req.login(updatedUser, (err) => {
        if (err) {
             console.error("Login Error:", err);
             return next(err);
        }
        req.flash("success", "Profile updated successfully!");
        res.redirect("/profile");
      });

    } catch (err) {
      console.error("Profile Edit Error:", err); // <--- READ THIS IN TERMINAL
      req.flash("error", "Failed to update profile.");
      res.redirect("/profile/edit");
    }
  }
);

/* ============================================================
   PUBLIC PROFILE + DELETE
============================================================ */
router.get("/users/:id", wrapAsync(userController.publicProfile));

router.post(
  "/delete",
  isLoggedIn,
  authLimiter,
  csrfProtection,
  userController.deleteAccount
);

export default router;