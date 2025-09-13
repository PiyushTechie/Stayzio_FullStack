import Listing from "../models/listing.js";
import User from "../models/user.js";
import cloudinary from "../cloudConfig.js";
import DatauriParser from "datauri/parser.js";
import path from "path";
const parser = new DatauriParser();
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding.js';
import mbxTilesets from '@mapbox/mapbox-sdk/services/tilesets.js';
import mongoose from "mongoose";
const { Schema, connect } = mongoose;
import methodOverride from "method-override";


const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

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
  res.render("listings/show", { 
  listing, 
  mapToken: process.env.MAP_TOKEN 
});

};

// Create a new listing (with Cloudinary upload)
const createListing = async (req, res) => {
  if (!req.user) {
    req.flash("error", "You must be logged in first!");
    return res.redirect("/login");
  }

  let response;
  try {
    response = await geocodingClient.forwardGeocode({
      query: req.body.listing?.location,
      limit: 1,
    }).send();
  } catch (geoErr) {
    req.flash("error", "Location lookup failed. Try again.");
    return res.redirect("/listings/new");
  }

  if (!response.body.features.length) {
    req.flash("error", "Invalid location. Try again!");
    return res.redirect("/listings/new");
  }

  if (!req.file) {
    req.flash("error", "Please upload an image.");
    return res.redirect(req.get("referer") || "/listings/new");
  }

  try {
    const fileExt = path.extname(req.file.originalname).toString();
    const base64File = parser.format(fileExt, req.file.buffer).content;

    const result = await cloudinary.uploader.upload(base64File, {
      folder: "stayzio_DEV",
      resource_type: "image",
    });

    if (!result.secure_url) {
      throw new Error("Cloudinary did not return secure_url");
    }

    const newListing = new Listing({
      ...req.body.listing,
      geometry: response.body.features[0].geometry,
      image: { url: result.secure_url, filename: result.public_id },
      owner: req.user._id,
    });

    const savedListing = await newListing.save();

    await User.findByIdAndUpdate(req.user._id, {
      $push: { listings: savedListing._id },
    });

    req.flash("success", "New listing created!");
    return res.redirect(`/listings/${savedListing._id}`);
  } catch (error) {
    req.flash("error", `Failed to create listing: ${error.message}`);
    return res.redirect("/listings/new");
  }
};


const updateListing = async (req, res) => {
  const { id } = req.params;
  const listingData = req.body.listing;

  // Find and update the listing in one step
  let updatedListing = await Listing.findByIdAndUpdate(id, { ...listingData }, { new: true });

  // Handle new image upload
  if (req.file) {
    // If there was a previous image, delete it from Cloudinary
    if (updatedListing.image?.filename) {
      await cloudinary.uploader.destroy(updatedListing.image.filename);
    }
    
    // Format and upload the new image
    const base64File = parser.format(
      path.extname(req.file.originalname).toString(),
      req.file.buffer
    ).content;
    const result = await cloudinary.uploader.upload(base64File, {
      folder: "stayzio_DEV",
    });

    // Save the new image details to the listing
    updatedListing.image = { url: result.secure_url, filename: result.public_id };
    await updatedListing.save(); // A quick save is needed just for the new image
  }

  req.flash("success", "✏️ Listing Updated Successfully!");
  res.redirect(`/listings/${id}`);
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