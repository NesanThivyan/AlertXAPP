// ADMIN – ASSIGN AMBULANCE TO BOOKING
export const assignAmbulanceToBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { ambulanceId } = req.body;

    if (!ambulanceId) {
      console.error('assignAmbulanceToBooking: Missing ambulanceId in request body');
      return res.status(400).json({ success: false, message: 'Ambulance ID is required.' });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      console.error(`assignAmbulanceToBooking: Booking not found for id ${id}`);
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    const ambulance = await Ambulance.findById(ambulanceId);
    if (!ambulance) {
      console.error(`assignAmbulanceToBooking: Ambulance not found for id ${ambulanceId}`);
      return res.status(404).json({ success: false, message: 'Ambulance not found.' });
    }

    booking.assignedAmbulance = ambulanceId;
    booking.status = 'assigned';
    await booking.save();

    const populatedBooking = await Booking.findById(id)
      .populate('user', 'name email')
      .populate('assignedAmbulance', 'plate driver status');

    // Optionally, notify user via socket.io or email here
    const io = req.app.get('io');
    if (io && populatedBooking.user?._id) {
      io.to(populatedBooking.user._id.toString()).emit('bookingStatusUpdated', populatedBooking);
    }

    res.json({ success: true, data: populatedBooking });
  } catch (err) {
    console.error('assignAmbulanceToBooking error →', err);
    if (err && err.stack) {
      console.error('Stack trace:', err.stack);
    }
    res.status(500).json({ success: false, message: 'Failed to assign ambulance.', error: err.message });
  }
};
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Booking from '../models/booking.model.js';
import Ambulance from '../models/ambulance.model.js';
import {
  notifyBookingStatusUpdate
} from '../server.js';
import sendBookingConfirmationEmail from '../utils/sendBookingConfirmationEmail.js';
import sendBookingRejectionEmail from '../utils/sendBookingRejectionEmail.js';

/* ────────── util ────────── */
const isNonEmpty = (v) => typeof v === 'string' && v.trim().length > 0;

function validateBooking(body) {
  const {
    pickupLocation, dropoffLocation, emergencyType,
    patientName, patientAge, patientCondition,
    contactNumber, date, hospital, name,
  } = body;

  if (![pickupLocation, dropoffLocation, emergencyType, patientName,
    patientCondition, contactNumber, hospital, name]
    .every(isNonEmpty)) {
    return { ok: false, message: 'All text fields are required.' };
  }

  const ageNum = Number(patientAge);
  if (!Number.isFinite(ageNum) || ageNum <= 0) {
    return { ok: false, message: 'patientAge must be a positive number.' };
  }

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate)) {
    return { ok: false, message: 'date must be a valid ISO string.' };
  }

  return {
    ok: true,
    data: {
      pickupLocation, dropoffLocation, emergencyType,
      patientName, patientAge: ageNum, patientCondition,
      contactNumber, date: parsedDate, hospital, name,
    },
  };
}

/* ────────── USER – CREATE ────────── */
export const createBooking = async (req, res) => {
  try {
    const check = validateBooking(req.body);
    if (!check.ok)
      return res.status(400).json({ success: false, message: check.message });

    const userId = req.user?._id;
    if (!mongoose.Types.ObjectId.isValid(userId))
      return res
        .status(401)
        .json({ success: false, message: 'User not authenticated.' });

    const booking = await Booking.create({
      ...check.data,
      user: userId,
      status: 'pending',
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email');

    const io = req.app.get('io');
    if (io) io.to('adminNotifications').emit('newBookingRequest', populatedBooking);
    notifyBookingStatusUpdate(userId, populatedBooking);

    if (populatedBooking.user?.email) {
      sendBookingConfirmationEmail({
        to: populatedBooking.user.email,
        username: populatedBooking.user.name,
        bookingId: populatedBooking._id,
        date: populatedBooking.date,
      }).catch(console.error);
    }

    res.status(201).json({
      success: true,
      message: 'Booking request created. Awaiting admin approval.',
      data: populatedBooking,
    });
  } catch (err) {
    console.error('createBooking →', err);
    res.status(500).json({ success: false, message: 'Failed to create booking.', error: err.message });
  }
};

/* ────────── ADMIN – GET ALL ────────── */
export const getAllBookings = async (_req, res) => {
  try {
    const bookings = await Booking.find()
      .populate({ path: 'user', select: 'name email' })
      .populate({ path: 'assignedAmbulance', select: 'plate driver status' })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    console.error('getAllBookings →', err);
    res.status(500).json({ success: false, message: 'Failed to fetch bookings.', error: err.message });
  }
};

/* ────────── ADMIN – STATUS UPDATE ────────── */
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['pending', 'accepted', 'assigned', 'dispatched', 'arrived', 'pickedup', 'rejected', 'completed', 'cancelled'];
    if (!allowed.includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status value.' });

    const booking = await Booking.findById(id);
    if (!booking)
      return res.status(404).json({ success: false, message: 'Booking not found.' });

    // Set bookingTime if status is "Accepted" and it's not already set
    if (status === 1 && !booking.bookingTime) {
      booking.bookingTime = new Date();
    }

    booking.status = status;
    await booking.save();

    const populatedBooking = await Booking.findById(id)
      .populate('user', 'name email')
      .populate('assignedAmbulance', 'plate driver status');

    const io = req.app.get('io');
    if (io && populatedBooking.user?._id) {
      io.to(populatedBooking.user._id.toString()).emit('bookingStatusUpdated', populatedBooking);
    }

    res.json({ success: true, data: populatedBooking });
  } catch (err) {
    console.error('updateBookingStatus error →', err);
    res.status(500).json({ success: false, message: 'Failed to update status.', error: err.message });
  }
};

/* ────────── ADMIN – CRUD HELPERS ────────── */
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email')
      .populate('assignedAmbulance', 'plate driver status');

    if (!booking)
      return res.status(404).json({ success: false, message: 'Booking not found.' });

    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch.', error: err.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking)
      return res.status(404).json({ success: false, message: 'Booking not found.' });

    res.json({ success: true, message: 'Booking deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete.', error: err.message });
  }
};

// USER - GET BOOKINGS HISTORY
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated.' });
    }

    const bookings = await Booking.find({ user: userId })
      .populate('assignedAmbulance', 'plate driver status')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    console.error('getUserBookings →', err);
    res.status(500).json({ success: false, message: 'Failed to fetch user bookings.', error: err.message });
  }
};
