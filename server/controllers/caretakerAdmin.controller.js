// /* controllers/caretakerBookingController.js
//    ---------------------------------------------------------
//    CRUD operations for caretaker bookings
//    --------------------------------------------------------- */

// import CaretakerBooking from "../models/CaretakerBooking.js";

// /* ---------- shared helpers ---------- */
// const populateQuery = [
//   { path: "user", select: "name email" },
//   { path: "caretaker", select: "name specialization" },
// ];

// /* ─────────── USER ENDPOINTS ─────────── */

// /**
//  * POST /api/caretaker-bookings
//  * Role: user
//  * Create a new booking for the logged‑in user.
//  */
// export const createBooking = async (req, res, next) => {
//   try {
//     const booking = await CaretakerBooking.create({
//       ...req.body,
//       user: req.user._id,          // req.user injected by protect middleware
//       status: "Pending",           // default capitalised to match enum
//     });

//     // return populated doc for immediate UI use
//     const populated = await booking.populate(populateQuery);
//     res.status(201).json(populated);
//   } catch (err) {
//     next(err);
//   }
// };

// /**
//  * GET /api/caretaker-bookings/mine
//  * Role: user
//  * Return bookings that belong to the logged‑in user.
//  */
// export const getMyBookings = async (req, res, next) => {
//   try {
//     const bookings = await CaretakerBooking.find({ user: req.user._id })
//       .populate(populateQuery)
//       .sort("-createdAt");

//     res.json(bookings);
//   } catch (err) {
//     next(err);
//   }
// };

// /* ──────── CARETAKER‑ADMIN ENDPOINTS ──────── */

// /**
//  * GET /api/caretaker-bookings
//  * Role: caretakeradmin
//  * Return every caretaker booking, newest first.
//  */
// export const getAllBookings = async (_req, res, next) => {
//   try {
//     const bookings = await CaretakerBooking.find()
//       .populate(populateQuery)
//       .sort("-createdAt");

//     res.json(bookings);
//   } catch (err) {
//     next(err);
//   }
// };

//       const token = loc
// /**
//  * PATCH /api/caretaker-bookings/:id
//  * Role: caretakeradmin
//  * Update a specific booking (status, dates, etc.).
//  */
// export const updateBooking = async (req, res, next) => {
//   try {
//     const updated = await CaretakerBooking.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     ).populate(populateQuery);

//     if (!updated)
//       return res.status(404).json({ message: "Booking not found" });

//     res.json(updated);
//   } catch (err) {
//     next(err);
//   }
// };

// /**
//  * DELETE /api/caretaker-bookings/:id
//  * Role: caretakeradmin
//  * Remove a booking from the system.
//  */
// export const deleteBooking = async (req, res, next) => {
//   try {
//     const deleted = await CaretakerBooking.findByIdAndDelete(req.params.id);
//     if (!deleted)
//       return res.status(404).json({ message: "Booking not found" });

//     res.status(204).end();
//   } catch (err) {
//     next(err);
//   }
// };


// // In caretaker.controller.js
// // export const getAllCaretakers = async (req, res) => {
// //   try {
// //     const caretakers = await Caretaker.find(); // Adjust if populated
// //     res.json(caretakers);
// //   } catch (error) {
// //     res.status(500).json({ error: "Failed to fetch caretakers" });
// //   }
// // };

// export const getAllCaretakers = async (req, res) => {
//   try {
//     const caretakers = await Caretaker.find();
//     res.json({ data: caretakers });  // ✅ matches frontend expectation
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch caretakers" });
//   }
// };
import Caretaker from '../models/caretaker.model.js';
import CaretakerBooking from '../models/caretakerBooking.model.js';

// -------------------- CARETAKER CRUD --------------------

// GET all caretakers
export const getAllCaretakers = async (req, res) => {
  try {
    const caretakers = await Caretaker.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: caretakers });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// POST add caretaker
export const addCaretaker = async (req, res) => {
  try {
    const caretaker = await Caretaker.create(req.body);
    res.status(201).json({ success: true, data: caretaker });
  } catch (err) {
    res.status(400).json({ message: 'Add Failed', error: err.message });
  }
};

// PUT update caretaker
export const updateCaretaker = async (req, res) => {
  try {
    const caretaker = await Caretaker.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!caretaker) {
      return res.status(404).json({ message: 'Caretaker not found' });
    }

    res.json({ success: true, data: caretaker });
  } catch (err) {
    res.status(500).json({ message: 'Update Failed', error: err.message });
  }
};

// DELETE caretaker
export const deleteCaretaker = async (req, res) => {
  try {
    const caretaker = await Caretaker.findByIdAndDelete(req.params.id);

    if (!caretaker) {
      return res.status(404).json({ message: 'Caretaker not found' });
    }

    res.json({ success: true, message: 'Caretaker deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete Failed', error: err.message });
  }
};

// -------------------- CARETAKER BOOKING MANAGEMENT --------------------

// GET all caretaker bookings
export const getAllCaretakerBookings = async (req, res) => {
  try {
    const bookings = await CaretakerBooking.find()
      .populate('user', 'name email')
      .populate('caretaker', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookings', error: err.message });
  }
};

// POST create new caretaker booking
export const createCaretakerBooking = async (req, res) => {
  try {
    const { userId, caretakerId, date, time, notes } = req.body;

    const booking = await CaretakerBooking.create({
      user: userId,
      caretaker: caretakerId,
      date,
      time,
      notes,
    });

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    res.status(400).json({ message: 'Booking creation failed', error: err.message });
  }
};

// PUT update caretaker booking
export const updateCaretakerBooking = async (req, res) => {
  try {
    const booking = await CaretakerBooking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(400).json({ message: 'Booking update failed', error: err.message });
  }
};

// DELETE caretaker booking
export const deleteCaretakerBooking = async (req, res) => {
  try {
    const booking = await CaretakerBooking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ success: true, message: 'Booking deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Booking deletion failed', error: err.message });
  }
};
