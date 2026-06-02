import express from "express";
const router = express.Router();

import wrapAsync from "../utils/wrapAsync.js";
import passport from "passport";
import { saveRedirectUrl, isLoggedIn } from "../utils/isLoggedIn.js";
import userController from "../controllers/users.js";
import { authLimiter } from "../utils/rateLimiters.js";
import multer from "multer";
import csrfProtection from "../utils/csrf.js";
import User from "../models/user.js";
import path from "path";
import DatauriParser from "datauri/parser.js";
import cloudinary from "../cloudConfig.js";

console.log("user.js router loaded");

const parser = new DatauriParser();
const upload = multer({ storage: multer.memoryStorage() });

router
  .route("/signup")
  .get(csrfProtection, userController.renderSignUpForm)
  .post(authLimiter, csrfProtection, wrapAsync(userController.signup));

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

router.post("/logout", userController.logout);

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

router.post(
  "/profile",
  isLoggedIn,
  upload.single("photo"),
  csrfProtection,
  wrapAsync(userController.updateProfile)
);

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

router.post(
  "/profile/edit",
  isLoggedIn,
  upload.single("photo"),
  csrfProtection,
  async (req, res, next) => {
    try {
      const { name, address, phone, country, bio } = req.body;

      const updateData = {
        "profile.name": name || "",
        "profile.address": address || "",
        "profile.country": country || "",
        "profile.phone": phone || "",
        "profile.bio": bio || "",
      };

      if (req.file) {
        if (req.user.profile?.photo?.filename) {
          try {
            await cloudinary.uploader.destroy(req.user.profile.photo.filename);
          } catch (e) {
            console.log("Could not delete old image:", e.message);
          }
        }

        const ext = path.extname(req.file.originalname).toString();
        const file64 = parser.format(ext, req.file.buffer);

        if (!cloudinary.uploader) {
          throw new Error("Cloudinary configuration is invalid.");
        }

        const result = await cloudinary.uploader.upload(file64.content, {
          folder: "stayzio_profile",
        });

        updateData["profile.photo"] = {
          url: result.secure_url,
          filename: result.public_id,
        };
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      req.login(updatedUser, (err) => {
        if (err) {
          console.error("Login Error:", err);
          return next(err);
        }
        req.flash("success", "Profile updated successfully!");
        res.redirect("/profile");
      });

    } catch (err) {
      req.flash("error", "Failed to update profile.");
      res.redirect("/profile/edit");
    }
  }
);

router.get("/users/:id", wrapAsync(userController.publicProfile));

router.post(
  "/delete",
  isLoggedIn,
  authLimiter,
  csrfProtection,
  userController.deleteAccount
);

export default router;