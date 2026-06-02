import mongoose from "mongoose";
const { Schema, connect } = mongoose;

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min : 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
     author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    listing: {
        type: Schema.Types.ObjectId,
        ref: "Listing"
    }
});
reviewSchema.index({ listing: 1, createdAt: -1 });
reviewSchema.index({ author: 1, createdAt: -1 });

export default mongoose.model("Review", reviewSchema);