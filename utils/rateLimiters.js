import { rateLimit } from 'express-rate-limit';

// 1. Create a reusable handler function
const rateLimitHandler = (req, res, next, options) => {
  // Log the event for your own records
  console.warn(`RATE LIMIT: IP ${req.ip} hit ${req.originalUrl}. Message: ${options.message}`);
  
  // We don't need req.flash() here, because we are rendering immediately.
  
  // ✅ THE FIX:
  // Pass the error message directly into the template as a local variable.
  res.status(options.statusCode).render("listings/429error", { 
    error: options.message 
  });
};

// 2. General Limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, 
  message: 'Too many requests from this IP, please try again after 15 minutes.',
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: rateLimitHandler, // <-- Use the custom handler
});

// 3. Strict Limiter
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 15,
  message: 'Too many attempts. Please try again after 10 minutes.',
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: rateLimitHandler, // <-- Use the same custom handler
});

export { globalLimiter, authLimiter };