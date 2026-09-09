import express from 'express';
import {
  getExpenses,
  createExpense,
  getExpense,
  updateExpense,
  deleteExpense,
} from '../controllers/expenseController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  expenseValidator,
  handleValidationErrors,
} from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getExpenses);
router.post('/', authMiddleware, expenseValidator, handleValidationErrors, createExpense);
router.get('/:id', authMiddleware, getExpense);
router.put('/:id', authMiddleware, updateExpense);
router.delete('/:id', authMiddleware, deleteExpense);

export default router;
