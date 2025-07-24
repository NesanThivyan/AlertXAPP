// models/booking.model.js
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    /* core info */
    name:            { type: String, required: true },
    hospital:        { type: String, required: true },
    date:            { type: Date,   required: true },
    emergencyType:   { type: String, required: true },

    /* locations */
    pickupLocation:  { type: String, required: true },
    dropoffLocation: { type: String, required: true },

    /* patient */
    patientName:       { type: String, required: true },
    patientAge:        { type: Number, required: true },
    patientCondition:  { type: String, required: true },

    /* contact */
    contactNumber:   { type: String, required: true },

    /* refs */
    user: {                                  // who created booking
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedAmbulance: {                     // set by admin on accept
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ambulance',
      default: null,
    },

    /* status & meta */
    status: {
      type: String,
      enum: ['pending', 'accepted', 'assigned', 'rejected', 'completed', 'cancelled'],
      default: 'pending',
    },
    userConfirmed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Booking', bookingSchema);
