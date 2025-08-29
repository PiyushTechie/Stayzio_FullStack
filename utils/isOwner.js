// utils/isOwner.js
import Listing from "../models/listing.js";

const isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "❌ Listing not found!");
    return res.redirect("/listings");
  }

  if (!listing.owner.equals(res.locals.currentUser._id)) {
    req.flash("error", "🚫 You don't have permission to do that!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

export default isOwner;
