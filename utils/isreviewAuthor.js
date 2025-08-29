import Review from "../models/reviews.js";

const isReviewAuthor = async (req, res, next) => {
    let{ id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currentUser._id)){
        req.flash("error", "You don't have access to delete others review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

export default isReviewAuthor;