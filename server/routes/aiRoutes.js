import express from 'express';
import {
  getSpendingInsights,
  getForecastInsights,
  chatWithAssistant,
} from '../controllers/aiController.js';
import { authMiddleware, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/insights', authMiddleware, getSpendingInsights);
router.post('/forecast-insights', authMiddleware, getForecastInsights);
router.post('/chat', optionalAuth, chatWithAssistant);

export default router;

