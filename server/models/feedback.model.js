import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    email:    { type: String, required: true },
    rating:   { type: Number, min: 1, max: 5, default: 5 },
    message:  { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
