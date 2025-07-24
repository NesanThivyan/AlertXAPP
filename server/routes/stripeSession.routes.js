
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import Stripe from "stripe";
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// Get all Stripe Checkout Sessions (for admin dashboard)
router.get("/sessions", async (req, res) => {
  try {
    // List the most recent 100 sessions
    const sessions = await stripe.checkout.sessions.list({ limit: 100 });
    res.json({ data: sessions.data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
