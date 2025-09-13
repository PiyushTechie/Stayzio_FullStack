import Booking from "../models/booking.js";
import Listing from "../models/listing.js";
import User from "../models/user.js";
import { sendEmailFromTemplate } from "../utils/mailer.js";

// ====================== CREATE BOOKING ======================
const createBooking = async (req, res) => {
  const { listingId, checkIn, checkOut, contactNumber, guests } = req.body;

  // 1️⃣ Ensure listing exists
  const listing = await Listing.findById(listingId);
  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }

  // 2️⃣ Create booking with pending status
  const booking = new Booking({
    user: req.user._id,
    listing: listingId,
    checkIn,
    checkOut,
    contactNumber,
    guests,
    status: "pending",
  });

  // 3️⃣ Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  booking.otp = otp;
  booking.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
  await booking.save();

  // 4️⃣ Send OTP email (MJML template)
  const user = await User.findById(req.user._id);
  await sendEmailFromTemplate({
    to: user.email,
    subject: "Stayzio: Verify Your Booking",
    templateName: "bookingOtp",
    templateData: {
      username: user.username,
      listingTitle: listing.title,
      otp,
      year: new Date().getFullYear(),
    },
  });

  req.flash("success", "OTP sent to your email. Please verify your booking.");
  res.redirect(`/bookings/${booking._id}/verify`);
};

// ====================== VERIFY BOOKING OTP ======================
const verifyBookingOTP = async (req, res) => {
  const { bookingId, otp } = req.body;

  const booking = await Booking.findById(bookingId)
    .populate("listing")
    .populate("user");

  if (!booking) {
    req.flash("error", "Booking not found.");
    return res.redirect("/listings");
  }

  // Check OTP validity
  if (booking.otp !== otp || booking.otpExpiry < Date.now()) {
    req.flash("error", "Invalid or expired OTP.");
    return res.redirect(`/bookings/${booking._id}/verify`);
  }

  // Mark booking as confirmed
  booking.status = "confirmed";
  booking.otp = undefined;
  booking.otpExpiry = undefined;
  await booking.save();

  // Format guest details
  const guestDetails = (booking.guests || [])
    .map((g, i) => `${i + 1}. ${g.name} (${g.type}, Age: ${g.age}, Gender: ${g.gender})`)
    .join("<br/>") || "No guest details provided";

  // Date formatter
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  // Send booking confirmation email
  await sendEmailFromTemplate({
    to: booking.user.email,
    subject: "Stayzio: Booking Confirmed",
    templateName: "bookingConfirmation", // ✅ clearer name
    templateData: {
      username: booking.user.username,
      listingTitle: booking.listing.title,
      checkIn: formatDate(booking.checkIn),
      checkOut: formatDate(booking.checkOut),
      guestDetails,
    },
  });

  req.flash("success", "Booking confirmed! Details sent to your email.");
  res.redirect(`/bookings/${booking._id}`);
};

export default {
  createBooking,
  verifyBookingOTP,
};
