import Booking from "../models/booking.js";
import Listing from "../models/listing.js";
import User from "../models/user.js";
import { sendEmailFromMJML } from "../utils/mailer.js";
import { calculateDynamicPrice } from "../utils/calculatePrice.js";

// ====================== CREATE BOOKING ======================

const createBooking = async (req, res) => {
  try {
    const { listingId, checkIn, checkOut, contactNumber, guests } = req.body;

    // 1️⃣ Ensure listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect("/listings");
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // 2️⃣ Validate dates
    if (checkInDate >= checkOutDate) {
      req.flash("error", "Check-out date must be after check-in date.");
      return res.redirect(`/listings/${listingId}`);
    }

    // 3️⃣ Check for booking conflicts (non-cancelled bookings)
    const conflict = await Booking.findOne({
      listing: listingId,
      $or: [
        { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } }
      ],
      status: { $ne: "cancelled" }
    });

    if (conflict) {
      req.flash("error", "This listing is already booked for those dates.");
      return res.redirect(`/listings/${listingId}`);
    }

    // 4️⃣ Calculate number of nights
    const numberOfNights = Math.ceil((checkOutDate - checkInDate) / (1000 * 3600 * 24));

    // 5️⃣ Calculate subtotal using dynamic pricing
    let subtotal = 0;
    for (let i = 0; i < numberOfNights; i++) {
      const date = new Date(checkInDate);
      date.setDate(checkInDate.getDate() + i);
      const { price } = calculateDynamicPrice(listing, date);
      subtotal += price;
    }

    // 6️⃣ GST & convenience fee
    const gst = subtotal * 0.18;
    const convenienceFee = subtotal * 0.05;

    // 7️⃣ Final total
    const finalTotal = subtotal + gst + convenienceFee;

    // 8️⃣ Create booking with pending status
    const booking = new Booking({
      user: req.user._id,
      listing: listingId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      contactNumber,
      guests,
      status: "pending",
      finalTotal
    });

    // 9️⃣ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    booking.otp = otp;
    booking.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await booking.save();

    // 🔟 Send OTP email
    const user = await User.findById(req.user._id);
    await sendEmailFromMJML({
      to: user.email,
      subject: "Stayzio: Verify your booking",
      templateName: "signupOtp",
      templateData: {
        username: user.username,
        listingTitle: listing.title,
        otp,
        nights: numberOfNights,
        totalPrice: booking.finalTotal.toFixed(2),
        year: new Date().getFullYear()
      }
    });

    req.flash("success", "Booking created! OTP sent to your email. Please verify.");
    res.redirect(`/bookings/${booking._id}/verify`);

  } catch (err) {
    console.error("Booking error:", err);
    req.flash("error", "Something went wrong. Please try again.");
    res.redirect(`/listings/${req.body.listingId}`);
  }
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
      templateName: "bookingConfirmation",
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
