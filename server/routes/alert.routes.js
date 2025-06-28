import { Router } from 'express';
import { protect, isAdmin } from '../middleware/auth.middleware.js';
import {
  createAlert,
  getAlerts,
  getAlertById,
  updateAlertStatus
} from '../controllers/alert.controller.js';

const router = Router();

// Note: Paths do not include '/alerts' prefix here
router.post('/create', protect, createAlert);
router.get('/:id', protect, isAdmin, getAlertById);
router.get('/', protect, isAdmin, getAlerts);
router.put('/:id/status', protect, isAdmin, updateAlertStatus);

export default router;
