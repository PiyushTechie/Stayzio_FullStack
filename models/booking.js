import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ["pending", "otp_verification", "payment_pending", "confirmed", "cancelled"], 
    default: "pending" 
  },
  createdAt: { type: Date, default: Date.now },

  contactNumber: {
    type: String,
    required: true,
  },

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

  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },

  finalTotal: { 
    type: Number, 
    required: true
  },

  hiddenFromHost: {
    type: Boolean,
    default: false
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  },
  transactionId: String

});

bookingSchema.index({ listing: 1, checkIn: 1, checkOut: 1 });
bookingSchema.index({ listing: 1, status: 1 });
bookingSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Booking", bookingSchema);
