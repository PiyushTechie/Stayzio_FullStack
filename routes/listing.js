import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import { listingSchema } from "../schema.js";
import {isLoggedIn} from "../utils/isLoggedIn.js";
import isOwner from "../utils/isOwner.js";
import listingController from "../controllers/listings.js";
import dotenv from "dotenv";
import multer from "multer";
import methodOverride from "method-override";
import cloudinary from "../cloudConfig.js";
import Listing from "../models/listing.js";

dotenv.config();

// Use memoryStorage instead of disk storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
});

// Middleware for validation
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    req.flash("error", msg);

    // Redirect to previous page if available, otherwise fallback
    const redirectUrl = req.get("Referrer") || "/listings";
    return res.redirect(redirectUrl);
  }
  next();
};

const router = express.Router();

router.route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    wrapAsync(listingController.createListing)
  );

  // ✅ NEW: API route to fetch listing data as JSON for the frontend
router.get("/api/listings", wrapAsync(listingController.apiIndex));
// ✅ Place this BEFORE /:id

router.get("/new", isLoggedIn, listingController.renderNewForm);



router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

export default router;
