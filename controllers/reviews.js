// reviews.js (controller)

import Review from "../models/reviews.js";
import Listing from "../models/listing.js";
import User from "../models/user.js"; // You already have this import, which is great!

const createReview = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  newReview.listing = listing._id;
  listing.reviews.push(newReview);

  // --- ADD THESE 3 LINES ---
  const currentUser = await User.findById(req.user._id);
  currentUser.reviews.push(newReview._id);
  await currentUser.save();
  // --- END OF ADDED LINES ---

  await newReview.save();
  await listing.save();
  
  req.flash("success", "Listing Review Created Successfully!");
  res.redirect(`/listings/${listing._id}`);
};

// reviews.js (controller)

const destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;

  // --- ADD THIS LINE ---
  // Pull the review from the author's review array
  await User.findOneAndUpdate({ reviews: reviewId }, { $pull: { reviews: reviewId } });
  // --- END OF ADDED LINE ---

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  
  req.flash("success", "Review Deleted Successfully!");
  res.redirect(`/listings/${id}`);
};

export default {createReview, destroyReview};