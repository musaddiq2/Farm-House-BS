import express from 'express';
import {
  createAdmin,
  getAllAdmins,
  blockAdmin,
  unblockAdmin,
} from '../controllers/UserController.js';
import protect from '../middleware/Auth.js';
import { isSuperAdmin } from '../middleware/RoleCheck.js';

const router = express.Router();

router.use(protect, isSuperAdmin);

router.post('/admin', createAdmin);
router.get('/admins', getAllAdmins);
router.put('/admins/:id/block', blockAdmin);
router.put('/admins/:id/unblock', unblockAdmin);

export default router;