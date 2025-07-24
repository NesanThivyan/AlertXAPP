
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import Stripe from "stripe";
import Payment from "../models/payment.model.js";
const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Health check endpoint for debugging
router.get("/webhook", async (req, res) => {
  try {
    // Try a simple MongoDB query
    const count = await Payment.countDocuments();
    res.json({ status: "ok", paymentCount: count });
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message });
  }
});

router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Stripe webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("Stripe webhook received:", event.type);
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    // Log all session fields for debugging
    console.log("Session fields:", Object.keys(session));
    console.log("Session data:", session);
    try {
      if (!Payment || typeof Payment.create !== 'function') {
        throw new Error("Payment model is not connected or not a function");
      }
      await Payment.create({
        sessionId: session.id,
        amount: session.amount_total,
        currency: session.currency,
        status: session.payment_status,
        customerEmail: session.customer_details?.email,
        created: new Date(session.created * 1000),
      });
      console.log("Payment saved to MongoDB");
    } catch (dbErr) {
      console.error("Error saving payment to MongoDB:", dbErr);
    }
  } else if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    console.log("PaymentIntent fields:", Object.keys(paymentIntent));
    console.log("PaymentIntent data:", paymentIntent);
    try {
      if (!Payment || typeof Payment.create !== 'function') {
        throw new Error("Payment model is not connected or not a function");
      }
      await Payment.create({
        sessionId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        customerEmail: paymentIntent.receipt_email || paymentIntent.metadata?.userEmail || null,
        created: new Date(paymentIntent.created * 1000),
      });
      console.log("PaymentIntent saved to MongoDB");
    } catch (dbErr) {
      console.error("Error saving PaymentIntent to MongoDB:", dbErr);
    }
  }
  // Always send a response to Stripe
  res.json({ received: true });
});

export default router;
