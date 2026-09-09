import express from 'express';
import {
  getIncome,
  createIncome,
  getIncomeById,
  updateIncome,
  deleteIncome,
} from '../controllers/incomeController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  incomeValidator,
  handleValidationErrors,
} from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getIncome);
router.post('/', authMiddleware, incomeValidator, handleValidationErrors, createIncome);
router.get('/:id', authMiddleware, getIncomeById);
router.put('/:id', authMiddleware, updateIncome);
router.delete('/:id', authMiddleware, deleteIncome);

export default router;
