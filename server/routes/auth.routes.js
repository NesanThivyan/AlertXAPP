import express from 'express';
import {
  register,
  getMe,
  logout,
  login,
} from '../controllers/auth.controller.js';
import {
  protect,
  isAdmin,
  isSuperAdmin,
  isCaretaker,         // ⬅️ added
} from '../middleware/auth.middleware.js';

const router = express.Router();

/* ────── Public auth endpoints ────── */
router.post('/signup', register);
router.post('/signin', login);

/* ────── Logged‑in user endpoints ────── */
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

/* ────── Role‑based sample routes ────── */
router.get('/admin-only', protect, isAdmin, (req, res) => {
  res.json({ message: 'This is an admin‑only route.' });
});

router.get('/superadmin-only', protect, isSuperAdmin, (req, res) => {
  res.json({ message: 'This is a superadmin‑only route.' });
});

router.get('/caretaker-only', protect, isCaretaker, (req, res) => {
  res.json({ message: 'This is a caretaker‑only route.' });
});

export default router;
