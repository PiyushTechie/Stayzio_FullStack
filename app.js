import dotenv from "dotenv";
dotenv.config(); // Load .env file unconditionally for development
import express from "express";
import mongoose from "mongoose";
import path from "path";
import methodOverride from "method-override";
import { fileURLToPath } from "url";
import ejsMate from "ejs-mate";
import flash from "connect-flash";
import session from "express-session";
import passport from "passport";
import LocalStrategy from "passport-local";
import User from "./models/user.js";
import listingRouter from "./routes/listing.js";
import reviewRouter from "./routes/review.js";
import userRouter from "./routes/user.js"; // Updated import
import bookingRoutes from "./routes/booking.js"
import { sendEmailFromMJML }   from "./utils/mailer.js";
import "./utils/passport.js";            // <-- registers Google (and other) strategies
import authRoutes from "./routes/authRoutes.js"; // <-- routes for /auth/google etc.
import hostRoutes from "./routes/hostRoutes.js";
import { globalLimiter } from "./utils/rateLimiters.js";
import redisModule from './utils/redisClient.js'; // default import
const { client, connectRedis } = redisModule;     // destructure after import

// Setup __dirname in ES Module style
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8080;

// App config
app.set('trust proxy', 1);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public"))); 

// DB connection
const dbUrl = process.env.ATLASDB_URL;
const localDb = "mongodb://127.0.0.1:27017/wanderlust";

const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto: {
    secret: process.env.SECRET
  },
  touchAfter: 24 * 3600,
});
store.on("error", () =>{
  console.log("ERROR IN MONGO SESSION STORE", err);
})

// Session Config

const sessionOptions = {
  store,         
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
};

app.use(globalLimiter);

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
app.use("/auth", authRoutes);   
app.use('/bookings', bookingRoutes);
app.use("/host", hostRoutes);


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

app.post("/contact", async (req, res) => {
    const { name, email, subject, message } = req.body;
    const timestamp = Date.now();
    if (!name || !email || !subject || !message) {
        return res.status(400).send("All fields are required");
    }

    try {
        // 1️⃣ Send email to Admin
        await sendEmailFromMJML({
              to: "piyushpraja1336@gmail.com",
              subject: `New Contact Form Submission: ${subject}`,
              templateName: "contactAdmin",
              templateData: { name, email, subject, message, year: new Date().getFullYear() }
            });

        // 2️⃣ Send confirmation email to User
        await sendEmailFromMJML({
            to: email,
            subject: "We received your message – Stayzio",
            templateName: "contactUser",
            templateData: { name, subject, year: new Date().getFullYear(), timestamp }
        });

        // Redirect to thank-you page
        res.redirect("/thank-you");

    } catch (err) {
        console.error("Contact form error:", err);
        res.status(500).send("Something went wrong, please try again later.");
    }
});

app.get("/insurance", (req, res) => {
  res.render("listings/insurance")
})
// Thank You page route
app.get("/thank-you", (req, res) => {
    res.render("users/thankyou");
});
app.get("/experiences", (req, res) => {
  res.render("listings/experiences");
})
app.get("/host-resources", (req, res) => {
  res.render("users/hostresources");
})
app.get("/host-guidelines", (req, res) => {
  res.render("users/hostguidelines");
})

app.get("/host-community", (req, res) => {
  res.render("users/hostcommunity");
})

app.get("/host-insurance", (req, res) => {
  res.render("users/hostinsurance");
})

app.get("/offline", (req, res) => {
  res.render("listings/offline");
});

app.get("/faq", (req, res) => {
  res.render("users/faq");
});


// app.get("/test-error", (req, res) => {
//   // Throw a server error intentionally
//   throw new Error("This is a test 500 error");
// });

// 404 handler
app.use((req, res) => {
  res.status(404).render('listings/404error'); // separate 404 page
});

// ===== 500 handler =====
app.use((err, req, res, next) => {
  res.status(500).render('listings/505error'); // separate 500 page
});

async function startServer() {
  try {
    // 1️⃣ Connect MongoDB
    await mongoose.connect(dbUrl);
    console.log("✅ DB Connected Successfully");

    // 2️⃣ Connect Redis
    await connectRedis();
    console.log('✅ Connected to Redis successfully!');

    // 3️⃣ Start server
    app.listen(port, () => {
      console.log(`🚀 App listening on port ${port}`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to DB or Redis:', err);
    process.exit(1);
  }
}

startServer();