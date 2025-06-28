import Chat from "../models/chat.model.js";

/* POST /api/chat  – create */
export const sendMessage = async (req, res) => {
  try {
    const { sender, text } = req.body;
    const message = await Chat.create({ sender, text });
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* GET /api/chat  – list all */
export const getMessages = async (req, res) => {
  try {
    const messages = await Chat.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* PATCH /api/chat/:id  – update text */
export const updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const updated = await Chat.findByIdAndUpdate(
      id,
      { text },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* DELETE /api/chat/:id  – remove message */
export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Chat.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
