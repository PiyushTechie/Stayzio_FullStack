import express from "express";
const router = express.Router();
import User from "../models/user.js";
import wrapAsync from "../utils/wrapAsync.js";
import passport from "passport";
import { saveRedirectUrl } from "../utils/isLoggedin.js";
import userController from "../controllers/users.js";
import isLoggedIn from "../utils/isLoggedin.js";

// Auth routes
router.route("/signup")
  .get(userController.renderSignUpForm)
  .post(wrapAsync(userController.signup));

router.route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }),
    wrapAsync(userController.login)
  );


// Logout Route
router.get("/logout", userController.logout);

// Profiles
router.get("/profile", isLoggedIn, wrapAsync(userController.userProfile));
router.get("/users/:id", wrapAsync(userController.publicProfile));

export default router;