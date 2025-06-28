import { Router } from 'express';
import { protect, isAdmin } from '../middleware/auth.middleware.js';
import {
  createBooking,
  updateBooking,
  deleteBooking,
  getAllBookings,
  getBookingById
} from '../controllers/booking.controller.js';

const router = Router();

// Create a new booking
router.post('/', protect, createBooking);

// Update a specific booking (by ID)
router.put('/:id', protect, updateBooking);

// Delete a specific booking (by ID)
router.delete('/:id', protect, deleteBooking);

// Admin routes
router.get('/', protect, isAdmin, getAllBookings);        // GET /api/bookings
router.get('/:id', protect, isAdmin, getBookingById);     // GET /api/bookings/:id

export default router;
