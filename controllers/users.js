// controllers/users.js
import User from "../models/user.js";
import { sendEmailFromTemplate } from "../utils/mailer.js";

// ====================== SIGNUP & OTP ======================

// Render signup form
const renderSignUpForm = (req, res) => {
  res.render("users/signup");
};

// Signup a new user and send OTP
const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // 🔍 Check if username/email already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      req.flash("error", "Username or email already in use");
      return res.redirect("/signup");
    }
    
    const user = new User({ username, email });

    // Register with passport-local-mongoose (hashes password)
    await User.register(user, password);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    user.emailVerified = false;
    await user.save();

    // ✅ Send signup OTP email
    await sendEmailFromTemplate({
      to: email,
      subject: "Stayzio: Verify your email",
      templateName: "signupOtp",
      templateData: {
        username,
        otp,
        year: new Date().getFullYear(),
      },
    });

    req.flash(
      "success",
      "Signup successful! Enter the OTP sent to your email to verify your account."
    );
    res.redirect("/verify-otp");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

// Verify OTP route
const verifyOtp = async (req, res) => {
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

  req.flash("success", "Email verified successfully!");
  res.redirect("/login");
};

//Resend Verification Otp
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body; // or from session if user is logged in

    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      req.flash("error", "No account found with this email");
      return res.redirect("/resend-otp");
    }

    if (user.emailVerified) {
      req.flash("info", "Your email is already verified");
      return res.redirect("/login");
    }

    // 2. Check cooldown (2.5 minutes = 150000 ms)
    const now = Date.now();
    if (user.lastOtpSent && now - user.lastOtpSent.getTime() < 150000) {
      const waitTime = Math.ceil((150000 - (now - user.lastOtpSent.getTime())) / 1000);
      req.flash("error", `Please wait ${waitTime} seconds before requesting another OTP`);
      return res.redirect("/resend-otp");
    }

    // 3. Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = now + 10 * 60 * 1000; // 10 minutes
    user.lastOtpSent = now; // update cooldown timer
    await user.save();

    // 4. Send OTP email
    await sendEmailFromTemplate({
      to: user.email,
      subject: "Stayzio: Resend OTP Verification",
      templateName: "signupOtp",
      templateData: {
        username: user.username,
        otp,
        year: new Date().getFullYear(),
      },
    });

    // 5. Notify success
    req.flash("success", "A new OTP has been sent to your email");
    res.redirect("/verify-otp");
  } catch (e) {
    req.flash("error", "Failed to resend OTP. Please try again.");
    res.redirect("/resend-otp");
  }
};

// ====================== LOGIN / LOGOUT ======================

const renderLoginForm = (req, res) => {
  res.render("users/login");
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
    req.flash("success", "Logged Out Successfully!");
    res.redirect("/listings");
  });
};

// ====================== USER PROFILES ======================

const userProfile = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("listings")
    .populate("reviews");

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

// ====================== FORGOT PASSWORD WITH OTP ======================

const renderForgotPasswordForm = (req, res) => {
  res.render("users/forgotPassword");
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

    // ✅ Send password reset OTP email
    await sendEmailFromTemplate({
      to: email,
      subject: "Stayzio: Password Reset OTP",
      templateName: "passwordResetOtp",
      templateData: {
        username: user.username,
        otp,
        year: new Date().getFullYear(),
      },
    });

    req.flash("success", "OTP sent to your email. Enter it below to reset password.");
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

  req.flash("success", "Password reset successfully! Please login with the new password.");
  res.redirect("/login");
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
  verifyOtp,
  renderForgotPasswordForm,
  forgotPassword,
  renderResetPasswordForm,
  resetPassword,
};
