// controllers/users.js
import User from "../models/user.js";
import { sendEmailFromMJML } from "../utils/mailer.js";
import Listing from "../models/listing.js";
import Review from "../models/reviews.js";

// ====================== SIGNUP & OTP ======================

// Render signup form
const renderSignUpForm = (req, res) => {
  res.render("users/newsignup");
};

// Signup a new user and send OTP
const signup = async (req, res) => {
  try {
    const { username, email, password, dob } = req.body;

    // ✅ Age Validation (Must be 18 or older)
    const birthDate = new Date(dob);
    const ageDiffMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiffMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);

    if (age < 18) {
      req.flash("error", "You must be 18 or older to register.");
      return res.redirect("/signup");
    }

    // 🔍 Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      req.flash("error", "Username or Email already in use!");
      return res.redirect("/signup");
    }

    const user = new User({ username, email, dob });

    await User.register(user, password);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    user.emailVerified = false;
    await user.save();

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
    
    const { email } = req.body || {};
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "No account found with this email" });
    }

    if (user.emailVerified) {
      return res.status(400).json({ error: "Your email is already verified. Please log in." });
    }

    const now = Date.now();
    const cooldownPeriod = 150000;

    if (user.lastOtpSent && now - user.lastOtpSent.getTime() < cooldownPeriod) {
      const waitTime = Math.ceil((cooldownPeriod - (now - user.lastOtpSent.getTime())) / 1000);
      return res.status(429).json({ error: `Please wait ${waitTime} seconds before requesting another OTP` });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = now + 10 * 60 * 1000;
    user.lastOtpSent = new Date(now);
    await user.save();

    console.log("Generated OTP:", otp);

    await sendEmailFromMJML({
          to: user.email,
          subject: "Stayzio: Resend OTP Verification",
          templateName: "signupOtp",   // matches email-templates/signupOtp.mjml
          templateData: {
            username: user.username,
            otp,
            year: new Date().getFullYear(),
          },
        });

    return res.status(200).json({ message: "A new OTP has been sent to your email" });
  } catch (e) {
    console.error("Resend OTP Error:", e); 
    return res.status(500).json({ error: "An internal server error occurred. Please try again." });
  }
};


// ====================== LOGIN / LOGOUT ======================

const renderLoginForm = (req, res) => {
  res.render("users/newlogin");
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

    await sendEmailFromMJML({
          to: user.email,
          subject: "Stayzio: Password Reset OTP",
          templateName: "passwordResetOtp",   // matches email-templates/signupOtp.mjml
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

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete all listings created by the user
    await Listing.deleteMany({ author: userId });

    // Delete all reviews written by the user
    await Review.deleteMany({ author: userId });

    // Finally, delete the user
    await User.findByIdAndDelete(userId);

    // Logout after deletion
    req.logout(() => {
      req.flash("success", "Your account has been permanently deleted.");
      res.status(200).json({ redirect: "/" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete account." });
  }
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
  resendOtp,
  deleteAccount
};
