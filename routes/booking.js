import express from "express";
import mongoose from "mongoose";
import Booking from "../models/booking.js";
import Listing from "../models/listing.js";
import { isLoggedIn } from "../utils/isLoggedIn.js";
import { sendEmailFromMJML } from "../utils/mailer.js";
import { calculateDynamicPrice } from "../utils/calculatePrice.js";
import { authLimiter } from "../utils/rateLimiters.js";
const router = express.Router();

// --- STEP 1: Show Guest Details Page ---
router.get("/details", isLoggedIn, (req, res) => {
  const { listingId, checkIn, checkOut } = req.query;
  req.session.bookingData = { listingId, checkIn, checkOut };
  res.render("listings/bookingDetails");
});

// --- STEP 2: Process Guest Details ---
router.post("/details", isLoggedIn, authLimiter, (req, res) => {
  if (!req.session.bookingData) {
    req.flash("error", "Session expired. Please start again.");
    return res.redirect("/listings");
  }
  req.session.bookingData.guests = req.body.guests;
  req.session.bookingData.contactNumber = req.body.contactNumber;
  res.redirect("/bookings/confirm");
});


// --- STEP 3: Show Confirmation Page ---
router.get("/confirm", isLoggedIn, async (req, res) => {
  try {
    if (!req.session.bookingData) {
      req.flash("error", "Your booking session has expired. Please start again.");
      return res.redirect("/listings");
    }

    const { listingId, checkIn, checkOut, guests, contactNumber } = req.session.bookingData;

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      req.flash("error", "Invalid listing reference.");
      return res.redirect("/listings");
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect("/listings");
    }

    // --- Ensure pricing exists for old listings ---
    if (!listing.pricing) {
      listing.pricing = {
        basePrice: listing.price || 1000, // fallback to existing price
        weekendMultiplier: 1.2,
        seasonalPricing: [],
        demandBased: { enabled: false, multiplier: 1.1 },
      };
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const numberOfNights = Math.ceil((checkOutDate - checkInDate) / (1000 * 3600 * 24));

    if (numberOfNights <= 0) {
      req.flash("error", "Invalid date range.");
      return res.redirect(`/listings/${listingId}`);
    }

    // --- Dynamic pricing calculation ---
    let subtotal = 0;
    const perNightPrices = [];

    for (let i = 0; i < numberOfNights; i++) {
      const nightDate = new Date(checkInDate);
      nightDate.setDate(checkInDate.getDate() + i);

      const { price: priceForNight, isWeekend, seasonalMultiplier, demandMultiplier } = calculateDynamicPrice(listing, nightDate);

      subtotal += priceForNight;

      perNightPrices.push({
        date: new Date(nightDate),
        price: priceForNight,
        isWeekend,
        seasonalMultiplier,
        demandMultiplier,
      });
    }

    const gst = subtotal * 0.18;
    const convenienceFee = subtotal * 0.05;
    const finalTotal = subtotal + gst + convenienceFee;

    res.render("listings/confirmBooking", {
      listing,
      checkIn,
      checkOut,
      numberOfNights,
      guests,
      contactNumber,
      subtotal,
      gst,
      convenienceFee,
      finalTotal,
      perNightPrices, // for EJS night-by-night breakdown
    });
  } catch (err) {
    console.error("--- CONFIRM PAGE ERROR ---", err);
    req.flash("error", "Could not load confirmation page.");
    res.redirect("/listings");
  }
});


// --- STEP 4: Create Booking + Send OTP ---
router.post("/", isLoggedIn, authLimiter, async (req, res) => {
  try {
    if (!req.session.bookingData) {
      req.flash("error", "Booking session expired.");
      return res.redirect("/listings");
    }

    const { listingId, checkIn, checkOut, guests, contactNumber } = req.session.bookingData;

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      req.flash("error", "Invalid listing reference.");
      return res.redirect("/listings");
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect("/listings");
    }

    if (listing.owner.equals(req.user._id)) {
      req.flash("error", "You cannot book your own listing.");
      return res.redirect(`/listings/${listingId}`);
    }

    // --- Calculate Total Price Dynamically ---
   // --- Calculate Total Price Dynamically ---
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    let subtotal = 0; // Renamed for clarity
    let current = new Date(checkInDate);

    while (current < checkOutDate) {
      // Destructure the 'price' from the returned object
      const { price } = calculateDynamicPrice(listing, current); 
      subtotal += price; // Add the number, not the object
      current.setDate(current.getDate() + 1);
    }

    // Add GST & Convenience Fee
    const gst = subtotal * 0.18;
    const convenienceFee = subtotal * 0.05;
    const finalTotal = subtotal + gst + convenienceFee;
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newBooking = await Booking.create({
      user: req.user._id,
      listing: listingId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      contactNumber,
      finalTotal,
      status: "pending",
      otp,
      otpExpiresAt: Date.now() + 10 * 60 * 1000,
    });

    await sendEmailFromMJML({
      to: req.user.email,
      subject: "Stayzio: Booking OTP Verification",
      templateName: "bookingOtp",
      templateData: {
        username: req.user.username,
        listingTitle: listing.title,
        otp,
        year: new Date().getFullYear(),
      },
    });

    delete req.session.bookingData;

    res.redirect(`/bookings/${newBooking._id}/verify-otp`);
  } catch (err) {
    console.error("--- BOOKING CREATION FAILED ---", err);
    req.flash("error", "Booking failed. Please try again.");
    res.redirect("/listings");
  }
});

// --- STEP 5: Show OTP Verification Page ---
router.get("/:id/verify-otp", isLoggedIn, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("listing");
    if (!booking) {
      req.flash("error", "Booking not found.");
      return res.redirect("/listings");
    }

    res.render("listings/verifyBookingOtp", { 
      booking,
      messages: {
        error: req.flash("error"),
        success: req.flash("success")
      }
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong.");
    res.redirect("/listings");
  }
});

// --- STEP 6: Verify OTP ---
router.post("/:id/verify-otp", isLoggedIn, authLimiter, async (req, res) => {
  try {
    const { otp } = req.body;
    const booking = await Booking.findById(req.params.id).populate("listing user");

    if (!booking) {
      req.flash("error", "Booking not found.");
      return res.redirect("/listings");
    }

    if (booking.otp !== otp || booking.otpExpiresAt < Date.now()) {
      req.flash("error", "Invalid or expired OTP.");
      return res.redirect(`/bookings/${booking._id}/verify-otp`);
    }

    booking.status = "confirmed";
    booking.otp = undefined;
    booking.otpExpiresAt = undefined;
    await booking.save();

    const guestDetails = (booking.guests || [])
      .map((g, i) => `${i + 1}. ${g.name} (${g.type}, Age: ${g.age}, Gender: ${g.gender})`)
      .join("<br/>") || "No guest details provided";

    const formatDate = (date) =>
      new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

    await sendEmailFromMJML({
      to: booking.user.email,
      subject: "Stayzio: Booking Confirmed 🎉",
      templateName: "bookingConfirmation",
      templateData: {
        username: booking.user.username,
        listingTitle: booking.listing.title,
        checkIn: formatDate(booking.checkIn),
        checkOut: formatDate(booking.checkOut),
        guestDetails,
      },
    });

    res.redirect(`/bookings/${booking._id}/success`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Could not verify OTP.");
    res.redirect("/listings");
  }
});

// --- STEP 7: Success Page ---
router.get("/:id/success", isLoggedIn, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("listing");
    if (!booking) {
      req.flash("error", "Booking not found.");
      return res.redirect("/listings");
    }
    res.render("listings/bookingSuccess", { booking });
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong.");
    res.redirect("/listings");
  }
});

// --- User Bookings ---
router.get("/my", isLoggedIn,  async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("listing")
    .sort({ checkIn: -1 });
  res.render("listings/bookings_my", { bookings });
});

// --- Cancel Booking ---
router.post("/:id/cancel", isLoggedIn, authLimiter ,async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking || !booking.user.equals(req.user._id)) {
      req.flash("error", "Booking not found or you are not authorized.");
      return res.redirect("/bookings/my");
    }

    const now = new Date();
    if (booking.checkIn <= now) {
      req.flash("error", "Cannot cancel a booking that has already started.");
      return res.redirect("/bookings/my");
    }

    booking.status = "cancelled";
    await booking.save();
    req.flash("success", "Booking successfully cancelled.");
    return res.redirect("/bookings/my");
  } catch (err) {
    console.error(err);
    req.flash("error", "Could not cancel booking.");
    return res.redirect("/bookings/my");
  }
});

// --- API: Get Booked Dates ---
router.get("/api/booked-dates", async (req, res) => {
  try {
    const { listingId } = req.query;
    const bookings = await Booking.find({
      listing: listingId,
      status: "confirmed",
    }).select("checkIn checkOut -_id");
    res.json({ bookings });
  } catch (err) {
    console.error(err);
    res.json({ bookings: [] });
  }
});

export default router;
