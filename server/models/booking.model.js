// models/booking.model.js
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    /* ------------- core booking info ------------- */
    name:            { type: String,  required: true }, // the “booking name” you send from the form
    hospital:        { type: String,  required: true },
    date:            { type: Date,    required: true }, // includes time
    emergencyType:   { type: String,  required: true },

    /* ------------- locations ------------- */
    pickupLocation:  { type: String,  required: true },
    dropoffLocation: { type: String,  required: true },

    /* ------------- patient details ------------- */
    patientName:       { type: String,  required: true },
    patientAge:        { type: Number,  required: true },
    patientCondition:  { type: String,  required: true },

    /* ------------- contact ------------- */
    contactNumber:   { type: String,  required: true },

    /* ------------- refs ------------- */
    user: {                                 // who made the booking
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedAmbulance: {                    // set only when admin accepts
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ambulance',
      default: null,
    },

    /* ------------- status & meta ------------- */
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Booking', bookingSchema);
