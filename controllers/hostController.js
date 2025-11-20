import Listing from "../models/listing.js";
import Booking from "../models/booking.js";
import Review from "../models/reviews.js";

// --- DASHBOARD HOME ---
const dashboardHome = async (req, res) => {
  try {
    let listings = [];
    let totalBookings = 0;
    let earnings = 0;

    if (req.user.role === "host") {
      listings = await Listing.find({ owner: req.user._id });
    }
    else if (req.user.role === "admin") {
      listings = await Listing.find({});
    }

    // ✅ Get total bookings linked to those listings
     if (listings.length > 0) {
      totalBookings = await Booking.countDocuments({
        listing: { $in: listings.map(l => l._id) }
      });

      const earningsAgg = await Booking.aggregate([
        { $match: { listing: { $in: listings.map(l => l._id) }, status: "confirmed" } },
        { $group: { _id: null, total: { $sum: "$finalTotal" } } }
      ]);
      earnings = earningsAgg[0]?.total || 0;
    }

    res.render("host/dashboardHome", {
      user: req.user,
      listings,
      totalBookings,
      earnings,
      csrfToken: req.csrfToken()
    });
  } catch (err) {
    console.error("❌ Dashboard Error:", err);
    req.flash("error", "Failed to load dashboard.");
    res.redirect("/");
  }
};

// --- LISTINGS OVERVIEW ---
const listingsOverview = async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user._id });

    const listingsWithStats = await Promise.all(
      listings.map(async l => {
        const bookingCount = await Booking.countDocuments({ listing: l._id });
        return { ...l.toObject(), bookingCount };
      })
    );

    res.render("host/listingsOverview", { 
      listings: listingsWithStats,
      csrfToken: req.csrfToken()
	});
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to load listings overview.");
    res.redirect("/host");
  }
};

// --- VIEW SINGLE LISTING ---
const viewListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect("/host/listings");
    }
    res.render("host/viewListing", { 
      listing,
      csrfToken: req.csrfToken()
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to load listing.");
    res.redirect("/host/listings");
  }
};

// --- DYNAMIC PRICING PREVIEW ---
const dynamicPricing = async (req, res) => {
   try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect("/host/listings");
    }

    const dynamicPrices = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      let price = listing.pricing?.basePrice || listing.price;

      // Weekend pricing
      if ([0, 6].includes(date.getDay())) price *= listing.pricing?.weekendMultiplier || 1;

      // Seasonal pricing
      listing.pricing?.seasonalPricing?.forEach(s => {
        if (date >= s.startDate && date <= s.endDate) price *= s.multiplier;
      });

      // Demand-based pricing
      if (listing.pricing?.demandBased?.enabled) price *= listing.pricing.demandBased.multiplier;

      dynamicPrices.push({ date, price });
     }

    res.render("host/dynamicPricing", { 
      listing, 
      dynamicPrices,
      csrfToken: req.csrfToken() 
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to load dynamic pricing.");
    res.redirect("/host/listings");
  }
};

// --- BOOKINGS OVERVIEW ---
const bookingsOverview = async (req, res) => {
try {
const listings = await Listing.find({ owner: req.user._id });

 const bookings = await Booking.find({ 
      listing: { $in: listings.map(l => l._id) },
      hiddenFromHost: { $ne: true } 
    }).populate("listing user");

 res.render("host/bookingsOverview", { 
    bookings,
    csrfToken: req.csrfToken() 
  });
 } catch (err) {
 console.error(err);
 req.flash("error", "Failed to load bookings.");
 res.redirect("/host");
 }
};

// --- BOOKING DETAILS ---
const bookingDetails = async (req, res) => {
try {
   
 const booking = await Booking.findById(req.params.bookingId)
                                 .populate("listing") 
                                 .populate("user");    

 if (!booking) {
 req.flash("error", "Booking not found.");
 return res.redirect("/host/bookings");
 }

if (!booking.listing.owner.equals(req.user._id)) {
   req.flash("error", "You are not authorized to view this booking.");
    return res.redirect("/host/bookings");
    }

 if (booking.hiddenFromHost) {
 req.flash("error", "You no longer have access to this booking.");
 return res.redirect("/host/bookings");
 }

res.render("host/bookingDetails", { 
    booking, 
    csrfToken: req.csrfToken() 
  });
  } catch (err) {
 console.error(err);
req.flash("error", "Failed to load booking details.");
res.redirect("/host/bookings");
}
};

// Hide (archive) booking just for host dashboard view
const hideBookingFromHost = async (req, res) => {
  try {
    const { bookingId } = req.params;
    await Booking.findByIdAndUpdate(bookingId, { hiddenFromHost: true });
    req.flash("success", "Booking removed from your view.");
    res.redirect("/host/bookings");
  } catch (err) {
    console.log(err);
    req.flash("error", "Could not remove booking.");
    res.redirect("/host/bookings");
  }
};

// --- ANALYTICS DASHBOARD ---
const analytics = async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user._id });
    const bookings = await Booking.find({ listing: { $in: listings.map(l => l._id) }, status: "confirmed" });

    // Monthly revenue
    const revenueByMonth = {};
    bookings.forEach(b => {
      const month = new Date(b.checkIn).toLocaleString("default", { month: "short", year: "numeric" });
      revenueByMonth[month] = (revenueByMonth[month] || 0) + b.finalTotal;
    });

    // Average review rating
    const reviews = await Review.find({ listing: { $in: listings.map(l => l._id) } });
    const avgRating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

    res.render("host/analytics", { 
      revenueByMonth, 
      avgRating, 
      totalReviews: reviews.length,
      csrfToken: req.csrfToken()
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to load analytics.");
    res.redirect("/host");
s  }
};

export default {
  dashboardHome,
  listingsOverview,
  viewListing,
  dynamicPricing,
  bookingsOverview,
  bookingDetails,
  hideBookingFromHost,
  analytics
};