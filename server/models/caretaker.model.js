import mongoose from 'mongoose';

const caretakerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  location: { type: String, default: 'Colombo' },
  specialization: { type: String },
  rate: { type: Number },
  bio: { type: String },
}, { timestamps: true });

const Caretaker = mongoose.model('Caretaker', caretakerSchema);
export default Caretaker;
