import { rateLimit } from 'express-rate-limit';

const rateLimitHandler = (req, res, next, options) => {
  res.status(options.statusCode).render("listings/429error", {
    error: options.message
  });
};

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes.',
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: rateLimitHandler,
});

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 15,
  message: 'Too many attempts. Please try again after 10 minutes.',
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: rateLimitHandler,
});

export { globalLimiter, authLimiter };