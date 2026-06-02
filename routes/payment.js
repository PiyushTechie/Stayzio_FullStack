import express from "express";
const router = express.Router();
import paymentController from "../controllers/payments.js";
import { isLoggedIn } from "../utils/isLoggedIn.js";
import csurf from "csurf";
const csrfProtection = csurf({ cookie: true });

router.get("/checkout/:bookingId", isLoggedIn, csrfProtection, paymentController.checkout);
router.post("/process", isLoggedIn, csrfProtection, paymentController.processPayment);
router.get("/success/:bookingId", isLoggedIn, csrfProtection, paymentController.success);

export default router;
