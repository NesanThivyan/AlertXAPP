// backend/routes/booking.routes.js
import { Router } from 'express';
import { protect, isAdmin } from '../middleware/auth.middleware.js';
import {
  createBooking,         // user creates a booking
  updateBooking,         // admin edits any booking field
  updateBookingStatus,   // admin sets status (pending, en‑route, done…)
  acceptBooking,         // admin ACCEPTS booking → sends email
  deleteBooking,         // admin deletes a booking
  getAllBookings,        // admin list
  getBookingById         // admin details view
} from '../controllers/booking.controller.js';

const router = Router();

/* ────────────────────────  USER  ──────────────────────── */

// POST /api/bookings
router.post('/', protect, createBooking);          // create new booking

/* ────────────────────────  ADMIN  ──────────────────────── */

// PUT /api/bookings/:id
router.put('/:id', protect, isAdmin, updateBooking);          // general edit

// PUT /api/bookings/:id/status
router.put('/:id/status', protect, isAdmin, updateBookingStatus); // change status only

// PUT /api/bookings/:id/accept
router.put('/:id/accept', protect, isAdmin, acceptBooking);   // accept + email user

// DELETE /api/bookings/:id
router.delete('/:id', protect, isAdmin, deleteBooking);       // delete booking

// GET /api/bookings
router.get('/', protect, isAdmin, getAllBookings);            // list all

// GET /api/bookings/:id
router.get('/:id', protect, isAdmin, getBookingById);         // single booking

export default router;
