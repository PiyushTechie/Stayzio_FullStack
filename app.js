import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import path from "path";
import methodOverride from "method-override";
import { fileURLToPath } from "url";
import ejsMate from "ejs-mate";
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local";
import User from "./models/user.js";
import listingRouter from "./routes/listing.js";
import reviewRouter from "./routes/review.js";
import userRouter from "./routes/user.js";
import bookingRoutes from "./routes/booking.js"
import { sendEmailFromMJML }   from "./utils/mailer.js";
import "./utils/passport.js";            
import authRoutes from "./routes/authRoutes.js";
import hostRoutes from "./routes/hostRoutes.js";
import { globalLimiter } from "./utils/rateLimiters.js";
import redisModule from './utils/redisClient.js'; 
const { client, connectRedis } = redisModule;     
import helmet from "helmet";
import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import cors from "cors";
import csurf from "csurf";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import csrfProtection from "./utils/csrf.js";
import MongoStore from "connect-mongo";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8080;

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "blob:",
          "https://cdn.tailwindcss.com",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com",
          "https://api.mapbox.com"
        ],

        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.tailwindcss.com",
          "https://cdn.jsdelivr.net",
          "https://cdnjs.cloudflare.com",
          "https://fonts.googleapis.com",
          "https://api.mapbox.com"
        ],

        workerSrc: [
          "'self'",
          "blob:"
        ],

        fontSrc: [
          "'self'",
          "data:",
          "https://fonts.gstatic.com",
          "https://cdnjs.cloudflare.com"
        ],

        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "https://res.cloudinary.com",
          "https://i.natgeofe.com",
          "https://images.unsplash.com",
          "https://api.mapbox.com",
          "https://*.tiles.mapbox.com",
           "https://static-assets.render.com",
        ],

        connectSrc: [
          "'self'",
          "https://api.mapbox.com",
          "https://events.mapbox.com",
          "https://cdn.jsdelivr.net",
          "https://stayzio-app.onrender.com"
        ],

        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'self'"],
      },
    },
  })
);



app.use(compression());
// App config
app.set('trust proxy', 1);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public"))); 

// app.use(mongoSanitize());

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

app.use(cookieParser(process.env.SECRET));
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
  res.locals.currentUser = req.user; 
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

app.get("/contact", csrfProtection, (req, res) => {
  res.render("listings/contact", { csrfToken: req.csrfToken() });
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

app.post("/contact", csrfProtection ,async (req, res) => {
    const { name, email, subject, message } = req.body;
    const timestamp = Date.now();
    if (!name || !email || !subject || !message) {
        return res.status(400).send("All fields are required");
    }

    try {
        await sendEmailFromMJML({
              to: "piyushpraja1336@gmail.com",
              subject: `New Contact Form Submission: ${subject}`,
              templateName: "contactAdmin",
              templateData: { name, email, subject, message, year: new Date().getFullYear() }
            });

        await sendEmailFromMJML({
            to: email,
            subject: "We received your message – Stayzio",
            templateName: "contactUser",
            templateData: { name, subject, year: new Date().getFullYear(), timestamp }
        });

        res.redirect("/thank-you");

    } catch (err) {
        console.error("Contact form error:", err);
        res.status(500).send("Something went wrong, please try again later.");
    }
});

app.get("/insurance", (req, res) => {
  res.render("listings/insurance")
})

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

app.get("/faq", (req, res) => {
  res.render("users/faq");
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

// 404 handler
app.use((req, res) => {
  res.status(404).render('listings/404error'); 
});

app.use((err, req, res, next) => {
  res.status(500).render('listings/505error'); 
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