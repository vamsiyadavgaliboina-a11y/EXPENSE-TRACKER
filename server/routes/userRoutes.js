import express from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  setupTwoFactor,
  verifyTwoFactor,
  disableTwoFactor,
} from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  updateProfileValidator,
  handleValidationErrors,
} from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfileValidator, handleValidationErrors, updateProfile);
router.put('/password', authMiddleware, changePassword);
router.post('/2fa/setup', authMiddleware, setupTwoFactor);
router.post('/2fa/verify', authMiddleware, verifyTwoFactor);
router.post('/2fa/disable', authMiddleware, disableTwoFactor);

export default router;
