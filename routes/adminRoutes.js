import express from "express";
import { isAdmin } from "../middlewares/roleMiddleware.js";
import User from "../models/user.js";
import Listing from "../models/listing.js";
import Booking from "../models/booking.js";

const router = express.Router();

router.use(isAdmin);

router.get("/", async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const listingsCount = await Listing.countDocuments();
    const bookingsCount = await Booking.countDocuments();

    const users = await User.find({}).sort({ createdAt: -1 }).limit(20);
    const listings = await Listing.find({}).populate("owner").sort({ createdAt: -1 }).limit(20);
    const bookings = await Booking.find({}).populate("user listing").sort({ createdAt: -1 }).limit(20);

    res.render("admin/dashboard", {
      users, listings, bookings,
      usersCount, listingsCount, bookingsCount,
      csrfToken: req.csrfToken()
    });
  } catch (error) {
    req.flash("error", "Error loading admin dashboard");
    res.redirect("/");
  }
});

router.post("/users/:id/ban", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user && user.role !== "admin") {
      user.role = "banned";
      await user.save();
      req.flash("success", "User banned successfully.");
    }
  } catch (err) {
    req.flash("error", "Failed to ban user.");
  }
  res.redirect("/admin");
});

router.post("/listings/:id/delete", async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Listing removed successfully.");
  } catch (err) {
    req.flash("error", "Failed to remove listing.");
  }
  res.redirect("/admin");
});

router.post("/bookings/:id/cancel", async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.id, { status: "cancelled" });
    req.flash("success", "Booking cancelled successfully.");
  } catch (err) {
    req.flash("error", "Failed to cancel booking.");
  }
  res.redirect("/admin");
});

export default router;
