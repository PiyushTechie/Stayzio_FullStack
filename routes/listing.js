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
const { client } = redisModule;
import { isHostOrAdmin } from "../middlewares/roleMiddleware.js";

import csurf from "csurf";
const csrfProtection = csurf({ cookie: true });

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
  const { error } = listingSchema.validate(req.body, { allowUnknown: true });
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
  } catch (err) {
    console.error("Redis cache clearing error:", err);
  }
}

const router = express.Router();

// ------------------- ROUTES ------------------- //

router.get("/", csrfProtection, wrapAsync(listingController.index));

router.post(
  "/",
  isLoggedIn,
  isHostOrAdmin,
  authLimiter,
  csrfProtection, 
  upload.single("listing[image]"),
  wrapAsync(async (req, res, next) => {
    await clearListingCache();
    await listingController.createListing(req, res, next);
  })
);

router.get("/api/listings", cacheMiddleware, wrapAsync(listingController.apiIndex));

router.get("/new", isLoggedIn, isHostOrAdmin, csrfProtection, listingController.renderNewForm); 

router
  .route("/:id")
  .get(csrfProtection, wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    authLimiter,

    upload.single("listing[image]"),   // 1. Parse body and file first
    validateListing,                   // 2. Validate the parsed body

    csrfProtection,                    // 3. Now verify CSRF safely

    wrapAsync(async (req, res, next) => {
        await clearListingCache(req.params.id);
    await listingController.updateListing(req, res, next);
  })
)

  .delete(
    isLoggedIn,
    isOwner,
    authLimiter,
    csrfProtection,
    wrapAsync(async (req, res, next) => {
      await clearListingCache(req.params.id);
      await listingController.destroyListing(req, res, next);
    })
  );

router.get("/:id/edit", isLoggedIn, isOwner, isHostOrAdmin, csrfProtection, wrapAsync(listingController.renderEditForm));

export default router;