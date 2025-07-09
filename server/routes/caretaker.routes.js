/* routes/caretakerRoutes.js
   ---------------------------------------------------------
   Caretaker‑booking endpoints
   --------------------------------------------------------- */

import express from "express";
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBooking,
  deleteBooking,
} from "../controllers/caretakerBookingController.js";
import { protect } from "../middleware/auth.js";
import { allowRoles } from "../middleware/role.js";

const router = express.Router();

/* ────────── USER ENDPOINTS ────────── */

/** POST /api/caretaker-bookings
 *  Create a new booking (role: user)
 */
router.post("/", protect, allowRoles("user"), createBooking);

/** GET /api/caretaker-bookings/mine
 *  List bookings that belong to the current user (role: user)
 */
router.get("/mine", protect, allowRoles("user"), getMyBookings);

/* ───── CARETAKER‑ADMIN ENDPOINTS ───── */

/** GET /api/caretaker-bookings
 *  List **all** bookings (role: caretakeradmin)
 */
router.get("/", protect, allowRoles("caretakeradmin"), getAllBookings);

/** PATCH /api/caretaker-bookings/:id
 *  DELETE /api/caretaker-bookings/:id
 *  Update or delete a booking (role: caretakeradmin)
 */
router
  .route("/:id")
  .patch(protect, allowRoles("caretakeradmin"), updateBooking)
  .delete(protect, allowRoles("caretakeradmin"), deleteBooking);

export default router;
