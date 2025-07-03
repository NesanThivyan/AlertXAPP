import express from 'express';
import { createMedicalDetails, getMedicalDetailsById } from '../controllers/medical.controller.js';

const router = express.Router();

// POST /api/user/medical
router.post('/user/medical', createMedicalDetails);

// Optional: GET /api/user/medical/:id
router.get('/user/:id', getMedicalDetailsById);

export default router;