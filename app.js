import dotenv from "dotenv";
dotenv.config(); // Load .env file unconditionally for development
import express from "express";
import mongoose from "mongoose";
import path from "path";
import methodOverride from "method-override";
import { fileURLToPath } from "url";
import ejsMate from "ejs-mate";
import ExpressError from "./utils/ExpressError.js";
import flash from "connect-flash";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import LocalStrategy from "passport-local";
import User from "./models/user.js";
import listingRouter from "./routes/listing.js";
import reviewRouter from "./routes/review.js";
import userRouter from "./routes/user.js"; // Updated import
import bookingRoutes from "./routes/booking.js"

// Setup __dirname in ES Module style
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8080;

// App config
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public"))); 

// DB connection
const dbUrl = process.env.ATLASDB_URL;

async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
    console.log("✅ DB Connected Successfully");
  } catch (err) {
    console.log("❌ Connection error:", err);
    process.exit(1); // Exit if DB connection fails
  }
}
main();

//MongoDb Atlas Config
// const store = MongoStore.create({
//   mongoUrl:dbUrl,
//   crypto: {
//     secret: process.env.SECRET
//   },
//   touchAfter: 24 * 3600,
// });
// store.on("error", () =>{
//   console.log("ERROR IN MONGO SESSION STORE", err);
// })

// Session Config
//store,
const sessionOptions = {
  
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
};



app.use(session(sessionOptions));
app.use(flash());

// Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user; // passport sets req.user
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  res.set("Surrogate-Control", "no-store");
  next();
});

// Routes
app.get("/", (req, res) => {
  res.render("users/homepage");
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use('/bookings', bookingRoutes);

app.get("/privacy", (req, res) => {
    res.render("listings/privacy");
});

app.get("/terms", (req, res) => {
    res.render("listings/terms");
});

app.get("/contact", (req, res) => {
  res.render("listings/contact");
});

app.get("/cookie", (req, res) => {
  res.render("users/cookiepolicy");
});

app.get("/safety", (req, res) => {
  res.render("users/safetytips");
});

app.get("/about", (req, res) => {
  res.render("users/about");
});

app.get("/cancelPolicy", (req, res) => {
  res.render("users/cancellationpolicy");
});


// 404 handler
app.all("/*\w", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Error handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(statusCode).render("listings/error", { err });
});

// Server
app.listen(port, () => {
  console.log(`🚀 App is listening on port ${port}`);
});