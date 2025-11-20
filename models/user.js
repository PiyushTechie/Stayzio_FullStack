import mongoose from "mongoose";
const { Schema } = mongoose;
import passportLocalMongoose from "passport-local-mongoose";
import Listing from "../models/listing.js";   // ✅ import Listing
import Review from "../models/reviews.js";     
// models/user.js
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  
  profile: {
  name: { type: String, default: "" },
  address: { type: String, default: "" },
  country: { type: String, default: "" },
  phone: { type: String, default: "" },
  bio: { type: String, default: "" },
  photo: {
    url: { type: String, default: "/images/default-profile.png" },
    filename: { type: String, default: "" }
  }
},

  // Relations
  listings: [{ type: Schema.Types.ObjectId, ref: "Listing" }],
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],

  // Authentication Fields
  emailVerified: { type: Boolean, default: false },
  googleId: { type: String, unique: true, sparse: true },
  facebookId: { type: String, unique: true, sparse: true },
  githubId: { type: String, unique: true, sparse: true },
  otp: String,
  otpExpiry: Date,
  resetToken: String,
  resetTokenExpiry: Date,
  lastOtpSent: Date,

  // Soft delete
  isDeleted: { type: Boolean, default: false },

  // Roles
  role: {
    type: String,
    enum: ["guest", "host", "admin"],
    default: "guest"
  },

  // Host-specific info (unchanged)
  hostDetails: {
    name: String,
    phone: String,
    country: String,
    postalCode: String,
    language: String,
    currency: String,
    bio: String,
    idType: String,
    profilePhoto: String,
    idProof: String,
    verified: { type: Boolean, default: false },
    joinedAt: Date
  }
});

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

userSchema.pre("findOneAndDelete", async function (next) {
  const userId = this.getQuery()["_id"];

  await Listing.deleteMany({ owner: userId });

  await Review.deleteMany({ author: userId });

  next();
});

export default mongoose.model("User", userSchema);
