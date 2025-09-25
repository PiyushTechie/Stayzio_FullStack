import Booking from "../models/booking.js";
import Listing from "../models/listing.js";
import User from "../models/user.js";
import { sendEmailFromMJML } from "../utils/mailer.js";
// ====================== CREATE BOOKING ======================
const createBooking = async (req, res) => {
  const { listingId, checkIn, checkOut, contactNumber, guests } = req.body;

  // 1️⃣ Ensure listing exists
  const listing = await Listing.findById(listingId);
  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }

  const newStart = new Date(checkIn);
  const newEnd = new Date(checkOut);

  // 2️⃣ Validate dates
  if (newStart >= newEnd) {
    req.flash("error", "Check-out date must be after check-in date.");
    return res.redirect(`/listings/${listingId}`);
  }

  // 3️⃣ Check for conflicts (strictly non-overlapping)
  const conflict = await Booking.findOne({
    listing: listingId,
    $or: [
      {
        checkIn: { $lt: newEnd }, // overlap if existing starts before new ends
        checkOut: { $gt: newStart } // and existing ends after new starts
      }
    ],
    status: { $ne: "cancelled" } // ignore cancelled bookings
  });

  if (conflict) {
    req.flash("error", "This listing is already booked for those dates.");
    return res.redirect(`/listings/${listingId}`);
  }

  // 4️⃣ Create booking with pending status
  const booking = new Booking({
    user: req.user._id,
    listing: listingId,
    checkIn: newStart,
    checkOut: newEnd,
    contactNumber,
    guests,
    status: "pending",
  });

  // 5️⃣ Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  booking.otp = otp;
  booking.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
  await booking.save();

  // 6️⃣ Send OTP email (MJML template)
  const user = await User.findById(req.user._id);

  await sendEmailFromMJML({
      to: user.email,
      subject: "Stayzio: Verify your email",
      templateName: "signupOtp",   // matches email-templates/signupOtp.mjml
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

  await sendEmailFromMJML({
      to: booking.user.email,
      subject: "Stayzio: Booking Confirmed",
      templateName: "bookingConfirmation",   // matches email-templates/signupOtp.mjml
      templateData: {
        username: booking.user.username,
        listingTitle: booking.listing.title,
        checkIn: formatDate(booking.checkIn),
        checkOut: formatDate(booking.checkOut),
        guestDetails,
      },
      year: new Date().getFullYear(),
    });

  req.flash("success", "Booking confirmed! Details sent to your email.");
  res.redirect(`/bookings/${booking._id}`);
};

export default {
  createBooking,
  verifyBookingOTP,
};
