import express from "express";
import { createFeedback, getAllFeedback, deleteFeedback } from "../controllers/feedback.controller.js";
import { protect, isAdmin } from "../middleware/auth.middleware.js";
const router = express.Router();

// User can post feedback (must be authenticated)
router.post("/", protect, createFeedback);

// Admin can get all feedback
router.get("/", protect, isAdmin, getAllFeedback);

// Admin can delete feedback by ID
router.delete("/:id", protect, isAdmin, deleteFeedback);

export default router;