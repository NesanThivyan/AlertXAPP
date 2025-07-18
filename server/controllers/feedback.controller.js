import Feedback from "../models/feedback.model.js";

/* POST /api/feedback  —— any authenticated user */
export const createFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.create({
      ...req.body
    });
    return res.status(201).json({ success: true, data: feedback });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

/* GET /api/feedback  —— admin only */
export const getAllFeedback = async (req, res) => {
  try {
    const feedbackList = await Feedback.find()
      .sort({ createdAt: -1 });
    return res.json({ success: true, data: feedbackList });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

/* GET /api/feedback/public  —— public access */
export const getPublicFeedback = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    const total = await Feedback.countDocuments();
    const feedbackList = await Feedback.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.json({
      success: true,
      data: feedbackList,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

/* DELETE /api/feedback/:id  —— admin only */
export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, error: "Feedback not found" });
    }
    return res.json({ success: true, message: "Feedback deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
