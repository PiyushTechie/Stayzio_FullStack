import express from "express";
const router = express.Router({mergeParams: true});
import wrapAsync from "../utils/wrapAsync.js";
import {reviewSchema} from "../schema.js"
import ExpressError from "../utils/ExpressError.js";
import Listing from "../models/listing.js";
import Review from "../models/reviews.js";
import isLoggedIn from "../utils/isLoggedin.js";
import isReviewAuthor from "../utils/isreviewAuthor.js";
import reviewControlller from "../controllers/reviews.js";

const validateReview = (req, res, next) => {
  let {error} = reviewSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el) => el.message).join(",")
    throw new ExpressError(400, errMsg);
  }else{
    next();
  }
}

//REVIEWS
router.post("/", validateReview, isLoggedIn, wrapAsync(reviewControlller.createReview));

//DELETE REVIEWS
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewControlller.destroyReview));

export default router;
