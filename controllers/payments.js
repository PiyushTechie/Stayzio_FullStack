import crypto from "crypto";
import Booking from "../models/booking.js";
import Notification from "../models/Notification.js";
import { generateBookingPDF } from "../utils/pdfGenerator.js";
import { sendEmailFromMJML } from "../utils/mailer.js";

const checkout = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const booking = await Booking.findById(bookingId).populate("listing").populate("user");

    if (!booking) {
      req.flash("error", "Booking not found.");
      return res.redirect("/listings");
    }

    if (booking.status !== "pending" && booking.status !== "payment_pending") {
      req.flash("error", "Invalid booking status for payment.");
      return res.redirect("/listings");
    }

    booking.paymentStatus = "pending";
    booking.status = "payment_pending";
    await booking.save();

    res.render("bookings/mockGateway", {
      booking,
      csrfToken: req.csrfToken(),
    });
  } catch (err) {
    console.error("Payment Init Error:", err);
    req.flash("error", "Could not initialize payment.");
    res.redirect("/listings");
  }
};

const processPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate({
        path: "listing",
        populate: { path: "owner" }
      })
      .populate("user");

    if (!booking) {
      req.flash("error", "Booking not found.");
      return res.redirect("/listings");
    }

    const mockTransactionId = "txn_" + crypto.randomBytes(12).toString("hex");

    booking.paymentStatus = "paid";
    booking.status = "confirmed";
    booking.transactionId = mockTransactionId;
    await booking.save();

    await Notification.create({
      user: booking.listing.owner._id,
      type: "booking_confirmed",
      title: "New Booking Confirmed!",
      message: `${booking.user.username} just booked ${booking.listing.title}`,
      link: `/host/bookings`
    });

    const guestDetails = (booking.guests || [])
      .map((g, i) => `${i + 1}. ${g.name} (${g.type}, Age: ${g.age}, Gender: ${g.gender})`)
      .join("<br/>") || "No guest details provided";

    const formatDate = (date) =>
      new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

    const pdfBuffer = await generateBookingPDF(booking);

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
        year: new Date().getFullYear(),
      },
      attachments: [
        {
          filename: `Stayzio_Booking_${booking._id}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    req.flash("success", "Payment successful! Booking confirmed.");
    return res.redirect(`/payments/success/${booking._id}`);

  } catch (err) {
    console.error("Process Payment Error:", err);
    req.flash("error", "Error verifying payment.");
    res.redirect("/listings");
  }
};

const success = async (req, res) => {
  const booking = await Booking.findById(req.params.bookingId).populate("listing");
  if (!booking || booking.paymentStatus !== "paid") {
    return res.redirect("/listings");
  }
  res.render("bookings/paymentSuccess", {
    booking,
    csrfToken: req.csrfToken()
  });
};

export default { checkout, processPayment, success };
