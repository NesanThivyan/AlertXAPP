import express from "express";
import {
  getProfile,
  updateProfile,
  deleteAccount
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { updateUserDetails } from "../controllers/userdetails.controller.js";
import { updateUserMedical } from "../controllers/usermedical.controller.js";
import { updateGuardianDetails } from "../controllers/userguardians.controller.js";
const router = express.Router();

// Profile routes
router.get("/profile/:id", protect, getProfile);
router.put("/profile/:id", protect, updateProfile);
router.delete("/delete/:id", protect, deleteAccount);

// User details route (POST /api/user/:id/details)
router.post("/:id/details", protect, updateUserDetails);

router.post("/:id/medical", protect, updateUserMedical);
// Guardian details route (POST /api/user/:id/guardian)
router.post("/:id/guardian", protect, updateGuardianDetails);
export default router;