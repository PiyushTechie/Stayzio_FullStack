import mongoose from "mongoose";
import Review from "./reviews.js";

const { Schema } = mongoose;

// --- Dynamic Pricing Schema ---
const pricingSchema = new Schema({
  basePrice: { type: Number, required: true },
  weekendMultiplier: { type: Number, default: 1.2 },
  seasonalPricing: [
    {
      startDate: Date,
      endDate: Date,
      multiplier: Number
    }
  ],
  demandBased: {
    enabled: { type: Boolean, default: false },
    multiplier: { type: Number, default: 1.1 }
  }
});

// --- Listing Schema ---
const listingSchema = new Schema({
  title: String,
  description: String,
  image: {
    url: String,
    filename: String
  },
  price: Number,
  location: String,
  country: String,
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  owner: { type: Schema.Types.ObjectId, ref: "User", index: true },
  category: {
    type: String,
    enum: [
      "rooms","cities","mountains","castles","pools","camping",
      "farms","beach","luxury","cabins","boats","all"
    ],
    default: "all"
  },
  geometry: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  pricing: { type: pricingSchema }
});

// --- Pre-save hook to ensure pricing exists ---
listingSchema.pre("save", function(next) {
  if (!this.pricing) {
    this.pricing = {
      basePrice: this.price || 1000,
      weekendMultiplier: 1.2,
      seasonalPricing: [],
      demandBased: { enabled: false, multiplier: 1.1 }
    };
  }
  next();
});

// --- Clean up reviews on listing deletion ---
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
