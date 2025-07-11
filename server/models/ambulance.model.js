import mongoose from 'mongoose';

const ambulanceSchema = new mongoose.Schema({
  plate: { type: String, required: true },
  driver: { type: String, required: true },
  phone: { type: String, required: true },
  status: {
    type: String,
    enum: ['Available', 'On Call', 'Maintenance', 'Unavailable'],
    default: 'Available'
  }
}, { timestamps: true });

export default mongoose.model('Ambulance', ambulanceSchema);
