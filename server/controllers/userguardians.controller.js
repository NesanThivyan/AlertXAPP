// server/controllers/userguardians.controller.js
import mongoose from "mongoose";
import User from "../models/user.model.js";

// @desc    Create or update guardian information
// @route   PATCH /api/user/:id/guardian
// @access  Private
export const updateGuardianDetails = async (req, res) => {
  try {
    const { id } = req.params;                 // <-- it's /user/:id/guardian
    if (!mongoose.isValidObjectId(id))
      return res.status(400).json({ message: "Invalid user ID" });

    // Build an update object only for the fields the client sent
    const up = {};
    ["name", "phone", "relationship", "email", "address"].forEach((k) => {
      if (req.body[k] !== undefined && req.body[k] !== "")
        up[`guardian.${k}`] = req.body[k];
    });

    // If nothing to update, bail early
    if (Object.keys(up).length === 0)
      return res.status(400).json({ message: "No guardian fields provided" });

    const user = await User.findByIdAndUpdate(
      id,
      { $set: up },
      { new: true, runValidators: true }
    );

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json({
      success: true,
      message: "Guardian details updated successfully",
      guardian: user.guardian,
    });
  } catch (err) {
    console.error("Error updating guardian details:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
