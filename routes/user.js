import express from "express";
const router = express.Router();
import wrapAsync from "../utils/wrapAsync.js";
import passport from "passport";
import { saveRedirectUrl, isLoggedIn } from "../utils/isLoggedIn.js";
import userController from "../controllers/users.js";
import { authLimiter } from "../utils/rateLimiters.js";

// ====================== SIGNUP ======================

router
  .route("/signup")
  .get(userController.renderSignUpForm)
  .post(authLimiter, wrapAsync(userController.signup));

// ====================== OTP VERIFICATION ======================

router
  .route("/verify-otp")
  .get((req, res) => res.render("users/verifyOtp"))
  .post(authLimiter, wrapAsync(userController.verifyOtp));

// ====================== LOGIN / LOGOUT ======================

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    authLimiter,
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: "Invalid email or password. Please try again.",
    }),
    userController.login
  );

router.get("/logout", userController.logout);

// ====================== FORGOT PASSWORD WITH OTP ======================
router
  .route("/forgot-password")
  .get(userController.renderForgotPasswordForm)
  .post(authLimiter, wrapAsync(userController.forgotPassword));

router
  .route("/reset-password-otp")
  .get(userController.renderResetPasswordForm) 
  .post(authLimiter, wrapAsync(userController.resetPassword));

  // ====================== RESEND OTP ======================
router.post("/resend-otp", authLimiter, wrapAsync(userController.resendOtp));

// ====================== PROFILE PAGES ======================

router.get("/profile", isLoggedIn, wrapAsync(userController.userProfile));
router.get("/users/:id", wrapAsync(userController.publicProfile));

router.post("/delete", isLoggedIn, authLimiter, userController.deleteAccount);

export default router;