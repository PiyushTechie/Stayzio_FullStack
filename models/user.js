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
  ]
});

// Plug in passport-local-mongoose (uses email as username)
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

export default mongoose.model("User", userSchema);