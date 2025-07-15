// /* routes/caretakerBookingRoutes.js */

// import express from "express";
// import {
//   createBooking,
//   getMyBookings,
//   getAllBookings,
//   updateBooking,
//   deleteBooking,
// } from "../controllers/caretakerBookingController.js";

// import {getAllCaretakers} from "../controllers/caretakerAdmin.controller.js"

// import { protect } from "../middleware/auth.middleware.js";   // ✅ from auth.middleware
// import { isCaretakerAdmin } from "../middleware/role.js";      // ✅ from role.js

// const router = express.Router();

// /* ------ user endpoints ------ */
// router.post("/", protect, createBooking);
// router.get("/mine", protect, getMyBookings);

// /* ---- caretaker‑admin endpoints ---- */
// router.get("/", protect, isCaretakerAdmin, getAllBookings);
// router
//   .route("/:id")
//   .patch(protect, isCaretakerAdmin, updateBooking)
//   .delete(protect, isCaretakerAdmin, deleteBooking);

// export default router;
// routes/caretaker.routes.js
import express from 'express';
import {
  getAllCaretakers,
  addCaretaker,
  updateCaretaker,
  deleteCaretaker,
  getAllCaretakerBookings,
  createCaretakerBooking,
  updateCaretakerBooking,
  deleteCaretakerBooking,
} from '../controllers/caretakerAdmin.controller.js';

import { protect, isCaretaker } from '../middleware/auth.middleware.js';

const router = express.Router();

// ------------------- CARETAKER CRUD -------------------
router
  .route('/')
  .get(protect, isCaretaker, getAllCaretakers)
  .post(protect, isCaretaker, addCaretaker);

router
  .route('/:id')
  .put(protect, isCaretaker, updateCaretaker)
  .delete(protect, isCaretaker, deleteCaretaker);

// ------------------- CARETAKER BOOKING CRUD -------------------

// ...existing code...

// Get all bookings
router.get('/bookings', protect, getAllCaretakerBookings);

// Create a booking
router.post('/bookings', protect, createCaretakerBooking);

// Update a booking (optional: keep isCaretaker for admin/caretaker only)
router.put('/bookings/:id', protect, isCaretaker, updateCaretakerBooking);

// Delete a booking (optional: keep isCaretaker for admin/caretaker only)
router.delete('/bookings/:id', protect, isCaretaker, deleteCaretakerBooking);

export default router;
