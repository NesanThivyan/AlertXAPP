import Booking from '../models/booking.model.js';
import { notifyBookingStatusUpdate } from '../server.js';      // emits to user + admin rooms
import sendBookingConfirmationEmail from '../utils/sendBookingConfirmationEmail.js';
import jwt from 'jsonwebtoken';

/**
 * Booking Controller
 * Handles creating, updating, deleting, and fetching bookings.
 * Realtime: uses Socket.IO events via notifyBookingStatusUpdate helper.
 */

/* ─────────────────────────  USER – CREATE  ───────────────────────── */

// @desc    Create a new booking (user)
// @route   POST /api/bookings
// @access  Private (User)
export const createBooking = async (req, res) => {
  console.log('BookingController: createBooking body →', req.body);

  try {
    const {
      pickupLocation,
      dropoffLocation,
      emergencyType,
      patientName,
      patientAge,
      patientCondition,
      contactNumber,
      date,
      hospital,
      name, // bookingName from frontend
    } = req.body;

    // Validate required fields
    if (
      !pickupLocation ||
      !dropoffLocation ||
      !emergencyType ||
      !patientName ||
      !patientAge ||
      !patientCondition ||
      !contactNumber ||
      !date ||
      !hospital ||
      !name
    ) {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide all required fields.' });
    }

    // Authenticated user
    const userId = req.user?._id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: 'User not authenticated.' });
    }

    // Create booking document
    const booking = await Booking.create({
      user: userId,
      pickupLocation,
      dropoffLocation,
      emergencyType,
      patientName,
      patientAge,
      patientCondition,
      contactNumber,
      date,
      hospital,
      name,
      status: 'pending',
    });

    // Populate user for nice payloads
    const populatedBooking = await Booking.findById(booking._id).populate(
      'user',
      'name email'
    );

    // Socket.IO instance
    const io = req.app.get('io');

    // Notify all admins of NEW booking request
    io.to('adminNotifications').emit('newBookingRequest', populatedBooking);

    // Notify user + admins of current status via helper ("pending")
    notifyBookingStatusUpdate(userId, populatedBooking);

    // SEND BOOKING CONFIRMATION EMAIL TO USER
    if (populatedBooking.user?.email) {
      try {
        await sendBookingConfirmationEmail({
          to: populatedBooking.user.email,
          username: populatedBooking.user.name,
          bookingId: populatedBooking._id,
          date: new Date(populatedBooking.date),
        });
      } catch (emailError) {
        console.error('Error sending booking confirmation email:', emailError);
        // Optionally continue without failing the booking creation
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Booking request created. Awaiting admin approval.',
      data: populatedBooking,
    });
  } catch (error) {
    console.error('createBooking error:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Failed to create booking.', error: error.message });
  }
};

/* ─────────────────────────  ADMIN – STATUS UPDATE  ───────────────────────── */

// @desc    Update booking status (admin)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Emit realtime update
    notifyBookingStatusUpdate(booking.user._id, booking);

    return res.json({ success: true, data: booking });
  } catch (error) {
    console.error('updateBookingStatus error:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Failed to update status.', error: error.message });
  }
};

/* ─────────────────────────  ADMIN – ACCEPT + EMAIL  ───────────────────────── */

// @desc    Accept booking (admin) → send confirmation email to user
// @route   PUT /api/bookings/:id/accept
// @access  Private/Admin
export const acceptBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id).populate('user', 'name email');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Already accepted?
    if (booking.status === 'accepted') {
      return res.json({ success: true, message: 'Booking already accepted.', data: booking });
    }

    booking.status = 'accepted';
    await booking.save();

    // Notify sockets
    notifyBookingStatusUpdate(booking.user._id, booking);

    // Generate token (expires in 1h)
    const token = jwt.sign({ bookingId: booking._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Send confirmation email
    await sendBookingConfirmationEmail({
      to: booking.user.email,
      bookingId: booking._id,
      token,
    });

    return res.json({
      success: true,
      message: 'Booking accepted and confirmation email sent.',
      data: booking,
    });
  } catch (error) {
    console.error('acceptBooking error:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Failed to accept booking.', error: error.message });
  }
};

/* ─────────────────────────  USER – CLICK EMAIL LINK  ───────────────────────── */

// @desc    User confirms booking via emailed link
// @route   GET /api/bookings/confirm/:token
// @access  Public
export const confirmBooking = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const booking = await Booking.findById(decoded.bookingId).populate('user', 'name email');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    booking.userConfirmed = true;
    await booking.save();

    // Notify sockets
    notifyBookingStatusUpdate(booking.user._id, booking);

    return res.json({ success: true, message: 'Booking confirmed.', data: booking });
  } catch (error) {
    console.error('confirmBooking error:', error);
    return res
      .status(400)
      .json({ success: false, message: 'Invalid or expired token.', error: error.message });
  }
};

/* ─────────────────────────  REMAINING CRUD  ───────────────────────── */

export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!booking)
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    res.json({ success: true, data: booking });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to update.', error: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking)
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    res.json({ success: true, message: 'Booking deleted.' });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to delete.', error: error.message });
  }
};

export const getAllBookings = async (_req, res) => {
  try {
    const bookings = await Booking.find().populate('user', 'name email');
    res.json({ success: true, data: bookings });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch.', error: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('user', 'name email');
    if (!booking)
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    res.json({ success: true, data: booking });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Failed to fetch.', error: error.message });
  }
};
