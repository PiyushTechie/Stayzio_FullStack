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

const handleOAuthUser = async (providerIdField, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;

    let user = await User.findOne({ [providerIdField]: profile.id });

    if (user && user.isDeleted) {
      return done(null, false, { message: "This account has been deleted." });
    }

    if (!user && email) {
      user = await User.findOne({ email });

      if (user && user.isDeleted) {
        await User.findByIdAndDelete(user._id);
        user = null; // so we can create a fresh account below
      }

      if (user) {
        user[providerIdField] = profile.id;
        user.emailVerified = true;
        await user.save();
      }
    }

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

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
  },
  (accessToken, refreshToken, profile, done) => handleOAuthUser("googleId", profile, done)
));

passport.use(new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ["id", "displayName", "emails"],
  },
  (accessToken, refreshToken, profile, done) => handleOAuthUser("facebookId", profile, done)
));

passport.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback",
  },
  (accessToken, refreshToken, profile, done) => handleOAuthUser("githubId", profile, done)
));

export default passport;
