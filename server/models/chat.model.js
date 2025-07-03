import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'senderType' },
  senderType: { type: String, required: true, enum: ['User', 'HospitalStaff'] },
  receiver: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'receiverType' },
  receiverType: { type: String, required: true, enum: ['User', 'HospitalStaff'] },
  text: { type: String, required: true },
  conversationId: { type: mongoose.Schema.Types.ObjectId, required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });

// Index for faster querying
chatSchema.index({ conversationId: 1, createdAt: 1 });

export default mongoose.model('Chat', chatSchema);