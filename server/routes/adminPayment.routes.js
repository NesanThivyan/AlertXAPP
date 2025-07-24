import express from "express";
import Booking from "../models/booking.model.js";
import Payment from "../models/payment.model.js";

const router = express.Router();

// Get all bookings with payment status for admin dashboard
router.get("/bookings-with-payment", async (req, res) => {
  try {
    // Add paymentStatus field if you add payment tracking later
    const bookings = await Booking.find().populate("user").populate("assignedAmbulance").sort({ createdAt: -1 });
    res.json({ data: bookings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// New route to get all payments from MongoDB
router.get("/payments", async (req, res) => {
  try {
    const payments = await Payment.find().sort({ created: -1 });
    res.json({ data: payments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
