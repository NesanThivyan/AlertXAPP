import mongoose from "mongoose";
import User from "../models/user.model.js";

export const updateGuardianDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Verify user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Build update object
    const guardianUpdates = {};
    const validFields = ["name", "phone", "relationship", "email", "address"];
    
    validFields.forEach((field) => {
      if (req.body[field] !== undefined && req.body[field] !== "") {
        guardianUpdates[`guardian.${field}`] = req.body[field];
      }
    });

    if (Object.keys(guardianUpdates).length === 0) {
      return res.status(400).json({ message: "No valid guardian fields provided" });
    }

    // Update user with guardian details
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: guardianUpdates },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Guardian details updated successfully",
      guardian: updatedUser.guardian,
    });
  } catch (err) {
    console.error("Error updating guardian details:", err);
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Validation error",
        error: err.message 
      });
    }
    
    res.status(500).json({ 
      message: "Server error",
      error: err.message 
    });
  }
};