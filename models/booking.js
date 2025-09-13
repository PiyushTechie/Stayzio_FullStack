import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ["pending", "otp_verification", "confirmed", "cancelled"], 
    default: "pending" 
  },
  createdAt: { type: Date, default: Date.now },

  // Contact details
  contactNumber: {
    type: String,
    required: true,
  },

  // Guest details
  guests: [
    {
      type: {
        type: String,
        enum: ['Adult', 'Child'],
        required: true,
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
      age: {
        type: Number,
        required: true,
        min: 0,
      },
      gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true,
      },
    },
  ],

  // OTP related fields
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  }
});

// Index to prevent overlapping bookings
bookingSchema.index({ listing: 1, checkIn: 1, checkOut: 1 });

export default mongoose.model("Booking", bookingSchema);
