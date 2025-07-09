/* models/CaretakerBooking.js */
import { Schema, model } from "mongoose";

const caretakerBookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    caretaker: {
      type: Schema.Types.ObjectId,
      ref: "Caretaker",
      required: true,
    },

    serviceDate: {
      type: Date,
      required: true,
    },

    serviceType: {
      type: String,
      enum: ["home‑visit", "day‑care", "overnight"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "completed", "cancelled"],
      default: "pending",
    },

    notes: String,
  },
  { timestamps: true }
);

export default model("CaretakerModa", caretakerBookingSchema);
