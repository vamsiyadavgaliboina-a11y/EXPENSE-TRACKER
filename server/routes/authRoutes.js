import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
} from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  registerValidator,
  loginValidator,
  handleValidationErrors,
} from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post('/register', registerValidator, handleValidationErrors, register);
router.post('/login', loginValidator, handleValidationErrors, login);
router.post('/logout', authMiddleware, logout);
router.get('/me', authMiddleware, getMe);

export default router;
