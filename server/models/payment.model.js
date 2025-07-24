import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  sessionId: String,
  amount: Number,
  currency: String,
  status: String,
  customerEmail: String,
  created: Date,
}, { collection: 'payments' });

export default mongoose.model("payments", paymentSchema, 'payments');
