import dotenv from "dotenv";
dotenv.config();
import express from "express";
const router = express.Router();
import Stripe from "stripe";
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Always use the real key from .env

// Payment controller
import * as paymentController from "../controllers/payment.controller.js";

// Stripe Checkout Session endpoint (recommended for redirect-based payment)
router.post("/create-checkout-session", async (req, res) => {
  const { amount, bookingId, userEmail } = req.body;
  try {
    // Only include customer_email if it's a non-empty string and looks like an email
    const sessionConfig = {
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Ambulance Booking #${bookingId}`,
            },
            unit_amount: amount, // amount in paise
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5173/payment-cancelled",
      metadata: { bookingId },
    };
    if (userEmail && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(userEmail)) {
      sessionConfig.customer_email = userEmail;
    }
    const session = await stripe.checkout.sessions.create(sessionConfig);
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// (Optional) Keep the PaymentIntent endpoint if you use it elsewhere
router.post("/create-payment-intent", async (req, res) => {
  const { amount, bookingId } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "inr",
      metadata: { bookingId },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

// --- RESTful Payment API ---
// Get all payments
router.get("/", paymentController.getAllPayments);
// Get payment by ID
router.get("/:id", paymentController.getPaymentById);
// Create payment
router.post("/", paymentController.createPayment);
// Update payment
router.put("/:id", paymentController.updatePayment);
// Delete payment
router.delete("/:id", paymentController.deletePayment);
