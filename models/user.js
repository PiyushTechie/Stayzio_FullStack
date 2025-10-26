import mongoose from "mongoose";
const { Schema } = mongoose;
import passportLocalMongoose from "passport-local-mongoose";
import Listing from "../models/listing.js";   // ✅ import Listing
import Review from "../models/reviews.js";     
// models/user.js
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  listings: [{ type: Schema.Types.ObjectId, ref: "Listing" }],
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  emailVerified: { type: Boolean, default: false },
  googleId: { type: String, unique: true, sparse: true },
  facebookId: { type: String, unique: true, sparse: true },
  githubId: { type: String, unique: true, sparse: true },
  otp: String,
  otpExpiry: Date,
  resetToken: String,
  resetTokenExpiry: Date,
  lastOtpSent: Date,

  // ⚠️ New field
  isDeleted: { type: Boolean, default: false }
});

// Use email for authentication with passport-local-mongoose
userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

// ✅ When a user is deleted → delete their listings & reviews
userSchema.pre("findOneAndDelete", async function (next) {
  const userId = this.getQuery()["_id"];

  // Delete all listings created by this user
  await Listing.deleteMany({ owner: userId });

  // Delete all reviews written by this user
  await Review.deleteMany({ author: userId });

  next();
});

export default mongoose.model("User", userSchema);
