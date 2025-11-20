import express from "express";
const router = express.Router({mergeParams: true});
import wrapAsync from "../utils/wrapAsync.js";
import {reviewSchema} from "../schema.js"
import ExpressError from "../utils/ExpressError.js";
import {isLoggedIn} from "../utils/isLoggedIn.js";
import isReviewAuthor from "../utils/isreviewAuthor.js";
import reviewControlller from "../controllers/reviews.js";
import { authLimiter } from "../utils/rateLimiters.js";

import csurf from "csurf";
const csrfProtection = csurf({ cookie: true });

const validateReview = (req, res, next) => {
  // { allowUnknown: true } tells Joi to ignore the _csrf token
  const { error } = reviewSchema.validate(req.body, { allowUnknown: true });

  if (error) {
    const errMsg = error.details.map(el => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//REVIEWS
router.post(
  "/", 
  isLoggedIn, 
  authLimiter, 
  csrfProtection,
  validateReview, 
  wrapAsync(reviewControlller.createReview),
);

//DELETE REVIEWS
router.delete(
  "/:reviewId", 
  isLoggedIn, 
  isReviewAuthor, 
  authLimiter, 
  csrfProtection,
  wrapAsync(reviewControlller.destroyReview)
);

export default router;