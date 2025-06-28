import { Router } from 'express';
import { protect, isSuperAdmin } from '../middleware/auth.middleware.js';
import {
  createHospital,
  getHospitals,
  getHospitalById,
  updateHospital,
  deleteHospital,
  changeHospitalRole,
  hospitalSignup,
  hospitalSignin
} from '../controllers/hospital.controller.js';

const router = Router();

router.post('/', protect, isSuperAdmin, createHospital);
router.get('/', protect, isSuperAdmin, getHospitals);
router.get('/:id', protect, isSuperAdmin, getHospitalById);
router.put('/:id', protect, isSuperAdmin, updateHospital);
router.delete('/:id', protect, isSuperAdmin, deleteHospital);
router.put('/:id/changerole', protect, isSuperAdmin, changeHospitalRole);

router.post('/signup', hospitalSignup);
router.post('/signin', hospitalSignin); // handles user and hospital signin based on `type`

export default router;
