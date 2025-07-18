import express from "express";
import {
  createFeedback,
  getAllFeedback,
  getPublicFeedback,
  deleteFeedback,
} from "../controllers/feedback.controller.js";
import { protect, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// ✅ Public route to fetch feedback for frontend display
router.get("/public", getPublicFeedback);

// 👤 Authenticated users can submit feedback
router.post("/", protect, createFeedback);

// 🛡️ Admin-only access to all feedback and delete
router.get("/", protect, isAdmin, getAllFeedback);
router.delete("/:id", protect, isAdmin, deleteFeedback);

export default router;
