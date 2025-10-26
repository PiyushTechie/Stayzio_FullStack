// utils/passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/user.js";

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => done(null, user)).catch(err => done(err));
});

// ✅ New handler for OAuth: always create new account
const handleOAuthUser = async (providerIdField, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;

    // Check if user exists by provider ID
    let user = await User.findOne({ [providerIdField]: profile.id });

    // If user exists and is deleted → block login
    if (user && user.isDeleted) {
      return done(null, false, { message: "This account has been deleted." });
    }

    // If not found by provider, try email
    if (!user && email) {
      user = await User.findOne({ email });

      // If user exists and is deleted → treat as new signup
      if (user && user.isDeleted) {
        // Delete the old soft-deleted user completely
        await User.findByIdAndDelete(user._id);
        user = null; // so we can create a fresh account below
      }

      if (user) {
        user[providerIdField] = profile.id;
        user.emailVerified = true;
        await user.save();
      }
    }

    // If still no user → create a new one
    if (!user) {
      user = await User.create({
        username: profile.displayName || profile.username || "Traveler",
        email: email || undefined,
        [providerIdField]: profile.id,
        emailVerified: true,
      });
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
};

// Google Strategy
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
  },
  (accessToken, refreshToken, profile, done) => handleOAuthUser("googleId", profile, done)
));

// Facebook Strategy
passport.use(new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ["id", "displayName", "emails"],
  },
  (accessToken, refreshToken, profile, done) => handleOAuthUser("facebookId", profile, done)
));

// GitHub Strategy
passport.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback",
  },
  (accessToken, refreshToken, profile, done) => handleOAuthUser("githubId", profile, done)
));

export default passport;
