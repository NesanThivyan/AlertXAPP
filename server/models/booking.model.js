import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    hospital: { type: String, required: true },
    date: { type: Date, required: true },        // we’ll combine date+time here
    condition: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'pending' }, // optional
  },
  { timestamps: true }
);


export default mongoose.model('Booking', bookingSchema);
