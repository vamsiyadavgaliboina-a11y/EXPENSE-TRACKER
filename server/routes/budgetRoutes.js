import express from 'express';
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from '../controllers/budgetController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  budgetValidator,
  handleValidationErrors,
} from '../middleware/validationMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getBudgets);
router.post('/', authMiddleware, budgetValidator, handleValidationErrors, createBudget);
router.put('/:id', authMiddleware, updateBudget);
router.delete('/:id', authMiddleware, deleteBudget);

export default router;
