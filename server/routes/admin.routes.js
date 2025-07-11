// import express from 'express';
// import {
//   getAllUsers,
//   deleteUser,
//   updateUserRole,
//   getAllCaretakers,
//   addCaretaker,
//   updateCaretaker,
//   deleteCaretaker
// } from '../controllers/admin.controller.js';
// import { protect, isAdmin, isSuperAdmin, isCaretaker } from '../middleware/auth.middleware.js';

// const router = express.Router();

// // User management
// router.get('/users', protect, isAdmin, getAllUsers);
// router.delete('/users/:id', protect, isSuperAdmin, deleteUser);
// router.put('/users/:id/role', protect, isSuperAdmin, updateUserRole);

// // Caretaker management
// // router.get('/caretakers', protect, isCaretaker, getAllCaretakers);
// router.get("/caretakers", protect, isAdmin, getAllCaretakers);

// router.post('/caretaker', protect, isCaretaker, addCaretaker);
// router.put('/caretaker/:id', protect, isCaretaker, updateCaretaker);
// router.delete('/caretaker/:id', protect, isCaretaker, deleteCaretaker);

// export default router;


import express from 'express';
import {
  getAllCaretakers,
  addCaretaker,
  updateCaretaker,
  deleteCaretaker,
  getAllUsers,
  deleteUser,
  updateUserRole,
} from '../controllers/admin.controller.js';

import { protect, isAdmin, isSuperAdmin, isCaretaker } from '../middleware/auth.middleware.js';

const router = express.Router();

// ✅ Superadmin and admin can fetch caretakers
router.get('/caretakers', protect, isAdmin, getAllCaretakers);

router.post('/caretaker', protect, isCaretaker, addCaretaker);
router.put('/caretaker/:id', protect, isCaretaker, updateCaretaker);
router.delete('/caretaker/:id', protect, isCaretaker, deleteCaretaker);

// Other admin routes
router.get('/users', protect, isAdmin, getAllUsers);
router.delete('/users/:id', protect, isSuperAdmin, deleteUser);
router.put('/users/:id/role', protect, isSuperAdmin, updateUserRole);

export default router;
