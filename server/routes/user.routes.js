import express from "express";
import {
  getProfile,            // GET  /api/users/profile/:id        – user fetches own profile
  updateProfile,         // PUT  /api/users/profile/:id        – user edits own profile
  deleteAccount          // DELETE /api/users/delete/:id       – user deletes own account
} from "../controllers/user.controller.js";

import {
  updateUserDetails,     // PUT  /api/users/:id/details        – user edits own details
  getUserDetailsByAdmin  // GET  /api/users/:id/details        – admin fetches any user's details
} from "../controllers/userdetails.controller.js";

import { updateUserMedical } from "../controllers/usermedical.controller.js";
import { updateGuardianDetails } from "../controllers/userguardians.controller.js";

import { protect, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

/* ───────────────── Profile (user self‑service) ───────────────── */
router
  .route("/profile/:id")
  .get(protect, getProfile)
  .put(protect, updateProfile);

router.delete("/delete/:id", protect, deleteAccount);

/* ───────────────── User Details ───────────────── */
// Admin fetches a user's full details
router.get("/:id/details", protect, isAdmin, getUserDetailsByAdmin);

// User updates own details
router.put("/:id/details", protect, updateUserDetails);

/* ───────────────── Medical & Guardian ───────────────── */
router.patch("/:id/medical", protect, updateUserMedical);  // Changed to PATCH for partial updates
router.patch("/:id/guardian", protect, updateGuardianDetails);  // Changed to PATCH

export default router;