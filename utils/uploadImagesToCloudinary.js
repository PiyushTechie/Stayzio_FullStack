import fs from "fs";
import axios from "axios";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";
import Listing from "../models/listing.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function downloadImage(url, localPath) {
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(localPath);
    response.data.pipe(writer);
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

async function uploadToCloudinary(localPath, listingId) {
  return cloudinary.uploader.upload(localPath, {
    folder: "stayzio_listings",
    public_id: listingId,
  });
}

async function processListings() {
  await mongoose.connect(process.env.MONGO_URI);
  const listings = await Listing.find();

  for (const listing of listings) {
    const imageUrl = listing.image?.url;
    if (!imageUrl) {
      console.log(`⚠ No image for: ${listing.title}`);
      continue;
    }

    if (imageUrl.includes("res.cloudinary.com")) {
      console.log(`Already on Cloudinary: ${listing.title}`);
      continue;
    }

    if (imageUrl.includes("encrypted-tbn0.gstatic.com")) {
      console.log(`Skipping low-quality Google thumbnail: ${listing.title}`);
      continue;
    }

    console.log(`⬇ Downloading for: ${listing.title}`);
    const localPath = path.join(__dirname, `temp_${listing._id}.jpg`);

    try {
      await downloadImage(imageUrl, localPath);

      console.log(`⬆ Uploading to Cloudinary: ${listing.title}`);
      const uploadRes = await uploadToCloudinary(localPath, listing._id);

      listing.image.url = uploadRes.secure_url;
      await listing.save();
      console.log(`Updated: ${listing.title}`);

    } catch (err) {
      console.log(`Error with "${listing.title}": ${err.message}`);
    } finally {
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
        console.log(`🗑 Deleted temp file for ${listing.title}`);
      }
    }
  }

  console.log("All listings processed!");
  process.exit();
}

processListings();
