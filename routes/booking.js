import express from "express";
import mongoose from "mongoose";
import Booking from "../models/booking.js";
import Listing from "../models/listing.js";
import { isLoggedIn } from "../utils/isLoggedIn.js";
import { sendEmailFromMJML } from "../utils/mailer.js";
import Notification from "../models/Notification.js";
import { calculateDynamicPrice } from "../utils/calculatePrice.js";
import { authLimiter } from "../utils/rateLimiters.js";
const router = express.Router();
import PDFDocument from "pdfkit";
import path from "path";
import { generateBookingPDF } from "../utils/pdfGenerator.js";
import csurf from "csurf";
const csrfProtection = csurf({ cookie: true });


router.get("/details", isLoggedIn, csrfProtection, (req, res) => {
  const { listingId, checkIn, checkOut } = req.query;
  req.session.bookingData = { listingId, checkIn, checkOut };
  res.render("listings/bookingDetails", { csrfToken: req.csrfToken() });
});

router.post("/details", isLoggedIn, authLimiter, csrfProtection, (req, res) => {
  if (!req.session.bookingData) {
    req.flash("error", "Session expired. Please start again.");
    return res.redirect("/listings");
  }
  req.session.bookingData.guests = req.body.guests;
  req.session.bookingData.contactNumber = req.body.contactNumber;
  res.redirect("/bookings/confirm");
});


router.get("/confirm", isLoggedIn, csrfProtection, async (req, res) => {
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

    if (!listing.pricing) {
      listing.pricing = {
        basePrice: listing.price || 1000,
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
      perNightPrices,
      csrfToken: req.csrfToken()
    });
  } catch (err) {
    console.error("--- CONFIRM PAGE ERROR ---", err);
    req.flash("error", "Could not load confirmation page.");
    res.redirect("/listings");
  }
});


router.post("/", isLoggedIn, authLimiter, csrfProtection, async (req, res) => {
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

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    let subtotal = 0;
    let current = new Date(checkInDate);

    while (current < checkOutDate) {
      const { price } = calculateDynamicPrice(listing, current);
      subtotal += price;
      current.setDate(current.getDate() + 1);
    }

    const gst = subtotal * 0.18;
    const convenienceFee = subtotal * 0.05;
    const finalTotal = subtotal + gst + convenienceFee;

    const newBooking = await Booking.create({
      user: req.user._id,
      listing: listingId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      contactNumber,
      finalTotal,
      status: "payment_pending",
    });

    delete req.session.bookingData;

    res.redirect(`/payments/checkout/${newBooking._id}`);
  } catch (err) {
    console.error("--- BOOKING CREATION FAILED ---", err);
    req.flash("error", "Booking failed. Please try again.");
    res.redirect("/listings");
  }
});

router.get("/:id/verify-otp", isLoggedIn, csrfProtection, async (req, res) => {
  try {

    if (req.session.otpVerified) {
      req.flash("info", "Your booking has already been verified.");
      return res.redirect("/listings");
    }

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
      },
      csrfToken: req.csrfToken()
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong.");
    res.redirect("/listings");
  }
});

router.post("/:id/verify-otp", isLoggedIn, authLimiter, csrfProtection, async (req, res) => {
  try {
    const { otp } = req.body;

    const booking = await Booking.findById(req.params.id)
      .populate({
        path: "listing",
        populate: { path: "owner" }
      })
      .populate("user");

    if (!booking) {
      req.flash("error", "Booking not found.");
      return res.redirect("/listings");
    }

    if (!otp || !booking.otp || booking.otp !== otp.trim() || booking.otpExpiresAt < Date.now()) {
      req.flash("error", "Invalid or expired OTP.");
      return res.redirect(`/bookings/${booking._id}/verify-otp`);
    }

    booking.status = "payment_pending";
    booking.otp = undefined;
    booking.otpExpiresAt = undefined;
    await booking.save();

    req.session.otpVerified = true;
    res.redirect(`/payments/checkout/${booking._id}`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Could not verify OTP.");
    res.redirect("/listings");
  }
});

router.get("/:id/success", isLoggedIn, csrfProtection, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("listing");
    if (!booking) {
      req.flash("error", "Booking not found.");
      return res.redirect("/listings");
    }
    res.render("listings/bookingSuccess", { booking, csrfToken: req.csrfToken() });
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong.");
    res.redirect("/listings");
  }
});

router.get("/my", isLoggedIn, csrfProtection, async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate({
      path: "listing",
      populate: { path: "owner" }
    })
    .sort({ checkIn: -1 });
  res.render("listings/bookings_my", { bookings, csrfToken: req.csrfToken() });
});

router.post("/:id/cancel", isLoggedIn, authLimiter, csrfProtection, async (req, res) => {
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

//Remove Listing
router.post("/:id/delete", isLoggedIn, authLimiter, csrfProtection, async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking || !booking.user.equals(req.user._id)) {
      req.flash("error", "Booking not found or unauthorized.");
      return res.redirect("/bookings/my");
    }

    if (booking.status !== "cancelled") {
      req.flash("error", "Only cancelled bookings can be removed.");
      return res.redirect("/bookings/my");
    }

    await Booking.findByIdAndDelete(id);

    req.flash("success", "Booking permanently removed from your history.");
    return res.redirect("/bookings/my");

  } catch (err) {
    console.error("--- BOOKING DELETE FAILED ---", err);
    req.flash("error", "Could not remove booking.");
    return res.redirect("/bookings/my");
  }
});


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

router.get("/:id/download", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: "listing",
        populate: { path: "owner" }
      })
      .populate("user");

    if (!booking) return res.status(404).send("Booking not found");

    const pdfBuffer = await generateBookingPDF(booking);

    res.setHeader("Content-Disposition", `inline; filename=Stayzio_Booking_${booking._id}.pdf`);
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating PDF");
  }
});


export default router;