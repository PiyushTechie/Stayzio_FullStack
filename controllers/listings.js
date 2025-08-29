import Listing from "../models/listing.js";
import User from "../models/user.js";
import cloudinary from "../cloudConfig.js";
import DatauriParser from "datauri/parser.js";
import path from "path";

const parser = new DatauriParser();

// Get all listings with average rating
// Get all listings with average rating (and search functionality)
const index = async (req, res) => {
  // 1. Get the search query from the URL (e.g., /listings?q=beach)
  const { q } = req.query;

  // 2. Create a base query object
  let findQuery = {};

  // 3. If a search query 'q' exists, build a search filter
  if (q) {
    findQuery = {
      $or: [
        { title: { $regex: q, $options: "i" } },
        { location: { $regex: q, $options: "i" } },
        { country: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ],
    };
  }

  // 4. Use the findQuery to get listings. It will be {} if not searching,
  //    or the search filter object if a query is present.
  const allListings = await Listing.find(findQuery).populate("reviews");

  // 5. Your existing average rating logic now works on the filtered results
  const listingsWithAvg = allListings.map((listing) => {
    let avg = 4.5; // Changed default from 4.5 to 0 for accuracy
    if (listing.reviews && listing.reviews.length > 0) {
      const sum = listing.reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      avg = (sum / listing.reviews.length).toFixed(1);
    }
    return { ...listing.toObject(), avgRating: avg };
  });

  // 6. Pass the (potentially filtered) listings and the search query to the template
  res.render("listings/index", { listings: listingsWithAvg, searchQuery: q });
};

// Render new form
const renderNewForm = (req, res) => {
  res.render("listings/new");
};

// Show a listing
const showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author", model: "User" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "❌ Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/show", { listing });
};

// Create a new listing (with Cloudinary upload)
const createListing = async (req, res) => {
  if (!req.user) {
    req.flash("error", "You must be logged in first!");
    return res.redirect("/login");
  }

  if (!req.file) {
    req.flash("error", "Please upload an image.");
    return res.redirect(req.get("referer") || "/listings/new"); // ✅ safer than "back"
  }

  try {
    const base64File = parser.format(
      path.extname(req.file.originalname).toString(),
      req.file.buffer
    ).content;

    const result = await cloudinary.uploader.upload(base64File, {
      folder: "stayzio_DEV",
      resource_type: "image",
    });

    const newListing = new Listing({
      ...req.body.listing,
      image: { url: result.secure_url, filename: result.public_id },
      owner: req.user._id,
    });

    await newListing.save();
    await User.findByIdAndUpdate(req.user._id, {
      $push: { listings: newListing._id },
    });

    req.flash("success", "New listing created!");
    return res.redirect(`/listings/${newListing._id || ""}`); // ✅ fallback safe
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    req.flash("error", `Failed to upload image: ${error.message}`);
    return res.redirect("/listings/new");
  }
};

// Update listing
const updateListing = async (req, res) => {
  const { id } = req.params;

  // Ensure it's a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    req.flash("error", "Invalid listing ID.");
    return res.redirect("/listings");
  }

  const listingData = req.body.listing;
  const originalListing = await Listing.findById(id);

  if (!originalListing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  originalListing.set(listingData);

  if (req.file) {
    if (originalListing.image?.filename) {
      await cloudinary.uploader.destroy(originalListing.image.filename);
    }

    const base64File = parser.format(
      path.extname(req.file.originalname).toString(),
      req.file.buffer
    ).content;

    const result = await cloudinary.uploader.upload(base64File, {
      folder: "stayzio_DEV",
    });

    originalListing.image = { url: result.secure_url, filename: result.public_id };
  }

  await originalListing.save();

  req.flash("success", "✏️ Listing Updated Successfully!");
  return res.redirect(`/listings/${id}`);
};


// Render edit form
const renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "❌ Listing not found");
    return res.redirect("/listings");
  }

  res.render("listings/edit", { listing });
};


// Delete a listing
const destroyListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (listing.image?.filename && listing.image.filename !== "default.jpg") {
    await cloudinary.uploader.destroy(listing.image.filename);
  }
  await Listing.findByIdAndDelete(id);
  req.flash("success", "🗑️ Listing Deleted Successfully!");
  res.redirect("/listings");
};

export default {
  index,
  renderNewForm,
  showListing,
  createListing,
  renderEditForm,
  updateListing,
  destroyListing,
};