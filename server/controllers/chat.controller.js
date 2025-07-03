import Chat from "../models/chat.model.js";

// Create conversation ID helper
const generateConversationId = (userId, hospitalId) => {
  return [userId, hospitalId].sort().join('_');
};

/* POST /api/chat - create message */
export const sendMessage = async (req, res) => {
  try {
    const { sender, senderType, receiver, receiverType, text } = req.body;
    
    const conversationId = generateConversationId(sender, receiver);
    
    const message = await Chat.create({
      sender,
      senderType,
      receiver,
      receiverType,
      text,
      conversationId
    });
    
    // Emit real-time event here if using Socket.io
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/* GET /api/chat - get conversation */
export const getMessages = async (req, res) => {
  try {
    const { userId, hospitalId } = req.query;
    
    if (!userId || !hospitalId) {
      return res.status(400).json({ error: "Missing conversation parameters" });
    }
    
    const conversationId = generateConversationId(userId, hospitalId);
    const messages = await Chat.find({ conversationId }).sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};