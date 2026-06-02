import mongoose from "mongoose";
import sampleListings from "./data.js";
import Listing from "../models/listing.js";

async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
    console.log("DB Connected Successfully");
  } catch (err) {
    console.error("❌ DB Connection Error:", err);
  }
}

const initDB = async () => {
  await Listing.deleteMany({});

  const listingsWithOwner = sampleListings.map((obj) => ({
    ...obj,
    owner: "68a5cc00337495e3abadf4e9",
  }));

  await Listing.insertMany(listingsWithOwner);
  console.log(" Data was initialized");
};

main().then(initDB);
