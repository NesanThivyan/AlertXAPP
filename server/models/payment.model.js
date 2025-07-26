import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "inr" },
  status: { type: String, required: true }, // e.g., "paid", "failed"
  customerEmail: { type: String },
  created: { type: Date, default: Date.now },
});

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
