import { Router } from 'express';
import { protect, isAdmin } from '../middleware/auth.middleware.js';
import {
  createBooking,
  // updateBooking,
  updateBookingStatus,
  // acceptBooking,   // no longer needed separately
  deleteBooking,
  getAllBookings,
  getBookingById,
  getUserBookings,
  assignAmbulanceToBooking,
} from '../controllers/booking.controller.js';

const router = Router();

// ADMIN: assign ambulance to booking
router.put('/:id/assignAmbulance', protect, isAdmin, assignAmbulanceToBooking);

// USER: create booking
router.post('/', protect, createBooking);

// USER: get booking history
router.get('/user/history', protect, getUserBookings);

// ADMIN: general edit booking
// router.put('/:id', protect, isAdmin, updateBooking);

// ADMIN: update booking status (accepted, rejected, completed, cancelled)
router.put('/:id/status', protect, isAdmin, updateBookingStatus);

// ADMIN: delete booking
router.delete('/:id', protect, isAdmin, deleteBooking);

// ADMIN: list all bookings
router.get('/', protect, isAdmin, getAllBookings);

// ADMIN: get booking by id
router.get('/:id', protect, isAdmin, getBookingById);

export default router;
