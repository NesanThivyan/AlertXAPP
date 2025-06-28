import express from 'express';
import { register, getMe, logout, login } from '../controllers/auth.controller.js';
import { protect, isAdmin, isSuperAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', register);
router.post('/signin', login); // handles user and hospital signin based on `type`
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

router.get('/admin-only', protect, isAdmin, (req, res) => {
  res.json({ message: "This is an admin-only route." });
});

router.get('/superadmin-only', protect, isSuperAdmin, (req, res) => {
  res.json({ message: "This is a superadmin-only route." });
});

export default router;
