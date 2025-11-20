import User from "../models/user.js";
import { sendEmailFromMJML } from "../utils/mailer.js";
import Listing from "../models/listing.js";
import Review from "../models/reviews.js";
import path from "path";

// ====================== SIGNUP & OTP ======================

const renderSignUpForm = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/listings");
  }
  res.render("users/newsignup", { csrfToken: req.csrfToken() });
};

const signup = async (req, res) => {
  console.log("SIGNUP CONTROLLER HIT");
  try {
    const { username, email, password, dob } = req.body;

    // Age validation
    const birthDate = new Date(dob);
    const ageDiffMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiffMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);

    if (age < 18) {
      req.flash("error", "You must be 18 or older to register.");
      return res.redirect("/signup");
    }

    // Check existing user
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      req.flash("error", "Username or Email already in use!");
      return res.redirect("/signup");
    }

    // Create user
    const user = new User({ username, email, dob });
    const registeredUser = await User.register(user, password);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    registeredUser.otp = otp;
    registeredUser.otpExpiry = Date.now() + 5 * 60 * 1000; 
    registeredUser.emailVerified = false;
    registeredUser.lastOtpSent = new Date();
    await registeredUser.save();

    // Send Email
    await sendEmailFromMJML({
      to: email,
      subject: "Stayzio: Verify your email",
      templateName: "signupOtp",
      templateData: {
        username,
        otp,
        year: new Date().getFullYear(),
      },
    });

    // Auto Login
    req.login(registeredUser, (loginErr) => {
      if (loginErr) {
        console.error("Auto-login failed:", loginErr);
        req.flash("error", "Account created, but login failed.");
        return res.redirect("/login");
      }
      req.flash("success", "Signup successful! Please check your email for the OTP.");
      res.redirect("/verify-otp");
    });

  } catch (e) {
    console.error("Signup Error:", e);
    req.flash("error", e.message || "Something went wrong.");
    res.redirect("/signup");
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      req.flash("error", "No account found.");
      return res.redirect("/signup");
    }
    if (user.emailVerified) {
      req.flash("success", "Email already verified!");
      return res.redirect("/login");
    }
    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      req.flash("error", "Invalid or expired OTP.");
      return res.redirect("/verify-otp");
    }

    user.emailVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    req.login(user, (err) => {
      if (err) return next(err);
      req.flash("success", "Email verified successfully!");
      res.redirect("/listings"); 
    });

  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/verify-otp");
  }
};

const resendOtp = async (req, res) => {
  try {
    const email = req.body.email || req.user?.email;

    if (!email) {
      req.flash("error", "Email is required");
      return res.redirect("/verify-otp");
    }

    const user = await User.findOne({ email });
    if (!user) {
      req.flash("error", "No account found.");
      return res.redirect("/verify-otp");
    }

    if (user.emailVerified) {
      req.flash("error", "Email already verified");
      return res.redirect("/login");
    }

    const now = Date.now();
    const cooldown = 150000; // 2.5 minutes

    if (user.lastOtpSent && now - user.lastOtpSent.getTime() < cooldown) {
      const wait = Math.ceil((cooldown - (now - user.lastOtpSent.getTime())) / 1000);
      req.flash("error", `Please wait ${wait}s before requesting again`);
      return res.redirect("/verify-otp");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = now + 10 * 60 * 1000;
    user.lastOtpSent = new Date(now);
    await user.save();

    await sendEmailFromMJML({
      to: email,
      subject: "Stayzio: New OTP",
      templateName: "signupOtp",
      templateData: { username: user.username, otp, year: new Date().getFullYear() },
    });

    req.flash("success", "OTP resent successfully!");
    res.redirect("/verify-otp");
  } catch (e) {
    console.log("Resend OTP Error:", e);
    req.flash("error", "Failed to resend OTP");
    res.redirect("/verify-otp");
  }
};

// ====================== LOGIN / LOGOUT ======================

const renderLoginForm = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/listings");
  }
  res.render("users/newlogin", { csrfToken: req.csrfToken() });
};

const login = (req, res, next) => {
  const user = req.user;
  if (!user.emailVerified) {
    req.logout((err) => {
      if (err) return next(err);
      req.flash("error", "You must verify your email before logging in.");
      return res.redirect("/login");
    });
  } else {
    req.flash("success", "Welcome back!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You have logged out successfully.");
    res.redirect("/login");
  });
};

// ====================== USER PROFILES ======================

// 1. Public Profile (View others)
// 1. Public Profile (View others)
const publicProfile = async (req, res) => {
  const profileUser = await User.findById(req.params.id)
    .populate("listings")
    .populate({ 
      path: "reviews", 
      populate: { 
        path: "listing", 
      } 
    });

  const isOwner = req.user && req.user._id.equals(profileUser._id);
  res.render("users/profile", { user: profileUser, isOwner, csrfToken: req.csrfToken() });
};

// 2. User Profile (View own dashboard) --> THIS WAS MISSING
// 2. User Profile (View own dashboard)
const userProfile = async (req, res) => {
  // WE MUST RE-FETCH THE USER TO POPULATE DATA
  // req.user only contains basic session info, not the deep database links
  
  const populatedUser = await User.findById(req.user._id)
    .populate("listings")
    .populate({
      path: "reviews",
      populate: {
        path: "listing", // <--- CRITICAL: This allows <%= review.listing._id %> to work
        select: "title _id" 
      }
    });

  res.render("users/profile", { 
      user: populatedUser, // Pass the fully populated user, not req.user
      isOwner: true,
      csrfToken: req.csrfToken() 
  });
};

const setupPage = (req, res) => {
  res.render("users/profileSetup", {
    user: req.user,
    csrfToken: req.csrfToken(),
  });
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    user.profile = user.profile || {};
    user.profile.name = req.body.name || "";
    user.profile.address = req.body.address || "";
    user.profile.country = req.body.country || "";
    user.profile.phone = req.body.phone || "";
    user.profile.bio = req.body.bio || "";

    await user.save();

    req.flash("success", "Profile updated!");
    res.redirect("/profile");

  } catch (err) {
    console.log("ERROR IN UPDATE PROFILE:", err);
    req.flash("error", "Something went wrong.");
    res.redirect("/profile/setup");
  }
};


// ====================== FORGOT PASSWORD ======================

const renderForgotPasswordForm = (req, res) => {
  res.render("users/forgotPassword", { csrfToken: req.csrfToken() });
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      req.flash("error", "No account with that email.");
      return res.redirect("/forgot-password");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmailFromMJML({
      to: user.email,
      subject: "Stayzio: Password Reset OTP",
      templateName: "passwordResetOtp",
      templateData: {
        username: user.username,
        otp,
        year: new Date().getFullYear(),
      },
    });

    req.flash("success", "OTP sent to your email.");
    res.redirect("/reset-password-otp");
  } catch (e) {
    req.flash("error", "Something went wrong sending OTP.");
    res.redirect("/forgot-password");
  }
};

const renderResetPasswordForm = (req, res) => {
  res.render("users/forgotPasswordOtp", {
    messages: {
      error: req.flash("error"),
      success: req.flash("success"),
    },
    csrfToken: req.csrfToken()
  });
};

const resetPassword = async (req, res) => {
  const { email, otp, password, confirmPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    req.flash("error", "No account found.");
    return res.redirect("/reset-password-otp");
  }
  if (user.otp !== otp || user.otpExpiry < Date.now()) {
    req.flash("error", "Invalid or expired OTP.");
    return res.redirect("/reset-password-otp");
  }
  if (password !== confirmPassword) {
    req.flash("error", "Passwords do not match.");
    return res.redirect("/reset-password-otp");
  }

  await user.setPassword(password);
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  req.flash("success", "Password reset successfully! Please login.");
  res.redirect("/login");
};

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    await Listing.deleteMany({ author: userId });
    await Review.deleteMany({ author: userId });
    await User.findByIdAndDelete(userId);

    req.logout(() => {
      req.flash("success", "Your account has been permanently deleted.");
      res.status(200).json({ redirect: "/" });
      // If this is called via Form Submit, use: res.redirect("/");
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete account." });
  }
};

// ====================== EXPORT ======================
// Now userProfile is defined, so this export will work.
export default {
  renderSignUpForm,
  signup,
  renderLoginForm,
  login,
  logout,
  userProfile, // <--- Works now!
  publicProfile,
  setupPage,
  updateProfile,
  verifyOtp,
  renderForgotPasswordForm,
  forgotPassword,
  renderResetPasswordForm,
  resetPassword,
  resendOtp,
  deleteAccount
};