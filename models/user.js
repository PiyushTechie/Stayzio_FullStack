import mongoose from "mongoose";
const { Schema } = mongoose;
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true // Ensure email is unique
  },
  username: { type: String, required: true, unique: true },
  listings: [
    {
      type: Schema.Types.ObjectId,
      ref: "Listing"
    }
  ],
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  // ✅ Fields for email verification and OTP
  emailVerified: {
    type: Boolean,
    default: false
  },
  otp: {           // new OTP field
    type: String
  },
  otpExpiry: {     // OTP expiration time
    type: Date
  },
 
  resetToken: {
    type: String
  },
  resetTokenExpiry: {
    type: Date
  },
  lastOtpSent: { type: Date } // cooldown tracking
});

// Plug in passport-local-mongoose (use email to login)
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

export default mongoose.model("User", userSchema);
