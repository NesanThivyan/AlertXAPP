import express from 'express';
import {
  getAllUsers,
  deleteUser,
  updateUserRole,
  getAllCaretakers,
  addCaretaker,
  updateCaretaker,
  deleteCaretaker
} from '../controllers/admin.controller.js';
import { protect, isAdmin, isSuperAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// User management
router.get('/users', protect, isAdmin, getAllUsers);
router.delete('/users/:id', protect, isSuperAdmin, deleteUser);
router.put('/users/:id/role', protect, isSuperAdmin, updateUserRole);

// Caretaker management
router.get('/caretakers', protect, isAdmin, getAllCaretakers);
router.post('/caretaker', protect, isAdmin, addCaretaker);
router.put('/caretaker/:id', protect, isAdmin, updateCaretaker);
router.delete('/caretaker/:id', protect, isAdmin, deleteCaretaker);

export default router;
