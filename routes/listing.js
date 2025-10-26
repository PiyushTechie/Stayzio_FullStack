import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import { listingSchema } from "../schema.js";
import { isLoggedIn } from "../utils/isLoggedIn.js";
import isOwner from "../utils/isOwner.js";
import listingController from "../controllers/listings.js";
import dotenv from "dotenv";
import multer from "multer";
import { authLimiter } from "../utils/rateLimiters.js";

// --- REDIS IMPORTS ---
import { cacheMiddleware } from '../middlewares/cache.js';
import redisModule from "../utils/redisClient.js";
const { client } = redisModule; // destructure the actual client

dotenv.config();

// Multer setup (memory storage)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    cb(null, allowedTypes.includes(file.mimetype));
  },
});

// Validation middleware
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    req.flash("error", msg);
    return res.redirect(req.get("Referrer") || "/listings");
  }
  next();
};

// --- CACHE HELPER ---
async function clearListingCache(listingId) {
  try {
    const keys = await client.keys("listings:/listings/api/listings*");
    for (const key of keys) await client.del(key);
    if (listingId) await client.del(`listings:/listings/api/listings/${listingId}`);
    console.log(`CACHE CLEARED for listing ${listingId || 'all listings'}`);
  } catch (err) {
    console.error("Redis cache clearing error:", err);
  }
}

const router = express.Router();

// ------------------- ROUTES ------------------- //

// GET all listings (normal page)
router.get("/", wrapAsync(listingController.index));

// POST create new listing
router.post(
  "/",
  isLoggedIn,
  authLimiter,
  upload.single("listing[image]"),
  wrapAsync(async (req, res, next) => {
    await clearListingCache(); // clear cache for all listings
    await listingController.createListing(req, res, next);
  })
);

// GET /api/listings (Redis cached)
router.get("/api/listings", cacheMiddleware, wrapAsync(listingController.apiIndex));

// GET new listing form
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Routes for specific listing by ID
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    authLimiter,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(async (req, res, next) => {
      await clearListingCache(req.params.id); // clear both all + specific listing
      await listingController.updateListing(req, res, next);
    })
  )
  .delete(
    isLoggedIn,
    isOwner,
    authLimiter,
    wrapAsync(async (req, res, next) => {
      await clearListingCache(req.params.id);
      await listingController.destroyListing(req, res, next);
    })
  );

// GET edit form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

export default router;
