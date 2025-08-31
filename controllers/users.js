import User from "../models/user.js";
import mongoose from "mongoose";

// ✅ Render signup form
const renderSignUpForm = (req, res) => {
  res.render("users/signup");
};

// ✅ Signup a new user and log them in
const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);

    // Automatically log the user in after registration
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

// ✅ Render login form
const renderLoginForm = (req, res) => {
  res.render("users/login");
};

// ✅ Login handler
const login = (req, res) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

// ✅ Logout handler
const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/listings");
  });
};

// ✅ Profile pages
const userProfile = async (req, res) => {
  // get the logged in user (req.user is added by passport)
  const user = await User.findById(req.user._id)
    .populate("listings")
    .populate("reviews");

  // check if the profile belongs to the logged-in user
  const isOwner = req.user && req.user._id.equals(user._id);

  res.render("users/profile", { user, isOwner });
};

const publicProfile = async (req, res) => {
  const profileUser = await User.findById(req.params.id)
    .populate("listings")
    .populate("reviews");

  const isOwner = req.user && req.user._id.equals(profileUser._id);

  res.render("users/profile", { user: profileUser, isOwner });
};


// ====================== EXPORT ======================
export default {
  renderSignUpForm,
  signup,
  renderLoginForm,
  login,
  logout,
  userProfile,
  publicProfile,
};