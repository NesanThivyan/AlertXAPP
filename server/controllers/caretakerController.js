/* controllers/caretakerBookingController.js
   ---------------------------------------------------------
   CRUD operations for caretaker bookings
   --------------------------------------------------------- */

import CaretakerModa from "../models/CaretakerBooking.js";

/* ─────────── USER ENDPOINTS ─────────── */

/**
 * POST /api/caretaker-bookings
 * Role: user
 * Create a new booking for the logged‑in user.
 */
export const createBooking = async (req, res, next) => {
  try {
    const booking = await CaretakerModa.create({
      ...req.body,
      user: req.user.id,
      status: "pending",
    });
    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/caretaker-bookings/mine
 * Role: user
 * Return bookings that belong to the logged‑in user.
 */
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await CaretakerModa.find({ user: req.user.id }).sort(
      "-createdAt"
    );
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

/* ──────── CARETAKER‑ADMIN ENDPOINTS ──────── */

/**
 * GET /api/caretaker-bookings
 * Role: caretakeradmin
 * Return **all** bookings in the system.
 */
export const getAllBookings = async (_req, res, next) => {
  try {
    const bookings = await CaretakerModa.find()
      .populate("user", "name email")
      .populate("caretaker", "name")
      .sort("-createdAt");
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/caretaker-bookings/:id
 * Role: caretakeradmin
 * Update a specific booking (status, date, etc.).
 */
export const updateBooking = async (req, res, next) => {
  try {
    const booking = await CaretakerModa.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!booking)
      return next({ status: 404, message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/caretaker-bookings/:id
 * Role: caretakeradmin
 * Remove a booking from the system.
 */
export const deleteBooking = async (req, res, next) => {
  try {
    const booking = await CaretakerModa.findByIdAndDelete(req.params.id);
    if (!booking)
      return next({ status: 404, message: "Booking not found" });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
