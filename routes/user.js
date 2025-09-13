import express from "express";
const router = express.Router();
import wrapAsync from "../utils/wrapAsync.js";
import passport from "passport";
import { saveRedirectUrl, isLoggedIn } from "../utils/isLoggedIn.js";
import userController from "../controllers/users.js";

// ====================== SIGNUP ======================

router
  .route("/signup")
  .get(userController.renderSignUpForm)
  .post(wrapAsync(userController.signup));

// ====================== OTP VERIFICATION ======================

router
  .route("/verify-otp")
  .get((req, res) => res.render("users/verifyOtp")) // render OTP input form
  .post(wrapAsync(userController.verifyOtp));

// ====================== LOGIN / LOGOUT ======================

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
    userController.login
  );

router.get("/logout", userController.logout);

// ====================== FORGOT PASSWORD WITH OTP ======================

// ====================== FORGOT PASSWORD ======================
router
  .route("/forgot-password")
  .get(userController.renderForgotPasswordForm)  // enter email
  .post(wrapAsync(userController.forgotPassword)); // send OTP

router
  .route("/reset-password-otp")
  .get(userController.renderResetPasswordForm)  // enter email + OTP + new password
  .post(wrapAsync(userController.resetPassword)); // verify OTP and reset password

// ====================== PROFILE PAGES ======================

router.get("/profile", isLoggedIn, wrapAsync(userController.userProfile));
router.get("/users/:id", wrapAsync(userController.publicProfile));

export default router;
