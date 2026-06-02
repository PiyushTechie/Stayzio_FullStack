import User from "../models/user.js";
import { sendEmailFromMJML } from "../utils/mailer.js";
import Listing from "../models/listing.js";
import Review from "../models/reviews.js";
import path from "path";

const renderSignUpForm = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/listings");
  }
  res.render("users/newsignup", { csrfToken: req.csrfToken() });
};

const signup = async (req, res) => {
  console.log("SIGNUP CONTROLLER HIT");
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(400).json({ success: false, message: "Username or Email already in use!" });
      }
      req.flash("error", "Username or Email already in use!");
      return res.redirect("/signup");
    }

    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    registeredUser.otp = otp;
    registeredUser.otpExpiry = Date.now() + 5 * 60 * 1000;
    registeredUser.emailVerified = false;
    registeredUser.lastOtpSent = new Date();
    await registeredUser.save();

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

    req.login(registeredUser, (loginErr) => {
      if (loginErr) {
        console.error("Auto-login failed:", loginErr);
        req.flash("error", "Account created, but login failed.");
        return res.redirect("/login");
      }
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(200).json({ success: true, message: "Signup successful! Please check your email for the OTP.", redirect: "/verify-otp" });
      }
      req.flash("success", "Signup successful! Please check your email for the OTP.");
      res.redirect("/verify-otp");
    });

  } catch (e) {
    console.error("Signup Error:", e);
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(400).json({ success: false, message: e.message || "Something went wrong." });
    }
    req.flash("error", e.message || "Something went wrong.");
    res.redirect("/signup");
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      if (req.xhr || req.headers.accept.indexOf('json') > -1) return res.status(400).json({ success: false, message: "No account found." });
      req.flash("error", "No account found.");
      return res.redirect("/signup");
    }
    if (user.emailVerified) {
      if (req.xhr || req.headers.accept.indexOf('json') > -1) return res.status(200).json({ success: true, message: "Email already verified!", redirect: "/login" });
      req.flash("success", "Email already verified!");
      return res.redirect("/login");
    }
    if (!otp || !user.otp || user.otp !== otp.trim() || user.otpExpiry < Date.now()) {
      if (req.xhr || req.headers.accept.indexOf('json') > -1) return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
      req.flash("error", "Invalid or expired OTP.");
      return res.redirect("/verify-otp");
    }

    user.emailVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    req.login(user, (err) => {
      if (err) return next(err);
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(200).json({ success: true, message: "Email verified successfully!", redirect: "/listings" });
      }
      req.flash("success", "Email verified successfully!");
      res.redirect("/listings");
    });

  } catch (e) {
    if (req.xhr || req.headers.accept.indexOf('json') > -1) return res.status(500).json({ success: false, message: e.message });
    req.flash("error", e.message);
    res.redirect("/verify-otp");
  }
};

const resendOtp = async (req, res) => {
  const isJson = req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1);
  try {
    const email = req.body.email || req.user?.email;

    if (!email) {
      if (isJson) return res.status(400).json({ success: false, message: "Email is required" });
      req.flash("error", "Email is required");
      return res.redirect("/verify-otp");
    }

    const user = await User.findOne({ email });
    if (!user) {
      if (isJson) return res.status(404).json({ success: false, message: "No account found." });
      req.flash("error", "No account found.");
      return res.redirect("/verify-otp");
    }

    if (user.emailVerified) {
      if (isJson) return res.status(400).json({ success: false, message: "Email already verified" });
      req.flash("error", "Email already verified");
      return res.redirect("/login");
    }

    const now = Date.now();
    const cooldown = 120000; // 2 minutes

    if (user.lastOtpSent && now - user.lastOtpSent.getTime() < cooldown) {
      const wait = Math.ceil((cooldown - (now - user.lastOtpSent.getTime())) / 1000);
      if (isJson) return res.status(429).json({ success: false, message: `Please wait ${wait}s before requesting again` });
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

    if (isJson) return res.status(200).json({ success: true, message: "OTP resent successfully!" });
    req.flash("success", "OTP resent successfully!");
    res.redirect("/verify-otp");
  } catch (e) {
    console.log("Resend OTP Error:", e);
    if (isJson) return res.status(500).json({ success: false, message: "Failed to resend OTP" });
    req.flash("error", "Failed to resend OTP");
    res.redirect("/verify-otp");
  }
};


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

const userProfile = async (req, res) => {

  const populatedUser = await User.findById(req.user._id)
    .populate("listings")
    .populate({
      path: "reviews",
      populate: {
        path: "listing",
        select: "title _id"
      }
    });

  res.render("users/profile", {
    user: populatedUser,
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


const renderForgotPasswordForm = (req, res) => {
  res.render("users/forgotPassword", { csrfToken: req.csrfToken() });
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      if (req.xhr || req.headers.accept.indexOf('json') > -1) return res.status(400).json({ success: false, message: "No account found." });
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

    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(200).json({ success: true, message: "OTP sent to your email." });
    }
    req.flash("success", "OTP sent to your email.");
    res.redirect("/reset-password-otp");
  } catch (e) {
    if (req.xhr || req.headers.accept.indexOf('json') > -1) return res.status(500).json({ success: false, message: "Something went wrong sending OTP." });
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
    if (req.xhr || req.headers.accept.indexOf('json') > -1) return res.status(400).json({ success: false, message: "No account found." });
    req.flash("error", "No account found.");
    return res.redirect("/reset-password-otp");
  }
  if (!otp || !user.otp || user.otp !== otp.trim() || user.otpExpiry < Date.now()) {
    if (req.xhr || req.headers.accept.indexOf('json') > -1) return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
    req.flash("error", "Invalid or expired OTP.");
    return res.redirect("/reset-password-otp");
  }
  if (password !== confirmPassword) {
    if (req.xhr || req.headers.accept.indexOf('json') > -1) return res.status(400).json({ success: false, message: "Passwords do not match." });
    req.flash("error", "Passwords do not match.");
    return res.redirect("/reset-password-otp");
  }

  await user.setPassword(password);
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    return res.status(200).json({ success: true, message: "Password reset successfully! Please login.", redirect: "/login" });
  }
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
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete account." });
  }
};

export default {
  renderSignUpForm,
  signup,
  renderLoginForm,
  login,
  logout,
  userProfile,
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