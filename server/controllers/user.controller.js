import User from "../models/user.model.js";

/* ---------- Profile & Account ---------- */

// GET /api/users/:id
export const getProfile = async (req, res) => {
  const { id } = req.params;

  if (!req.user) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }

  if (req.user._id.toString() !== id && req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  try {
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, data: user });
  } catch {
    res.status(400).json({ success: false, message: "Invalid user ID" });
  }
};

// PUT /api/users/:id
export const updateProfile = async (req, res) => {
  const { id } = req.params;

  if (req.user._id.toString() !== id && req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  try {
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, message: "Profile updated", data: user });
  } catch (err) {
    res.status(422).json({ success: false, message: err.message });
  }
};

// DELETE /api/users/:id
export const deleteAccount = async (req, res) => {
  const { id } = req.params;

  if (!req.user) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }
  if (req.user._id.toString() !== id && req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ success: false, message: "Account not found" });

    res.status(200).json({ success: true, message: "User deleted" });
  } catch {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
