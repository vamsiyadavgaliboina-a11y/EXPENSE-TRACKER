import express from 'express';
import {
  getDashboardSummary,
  getDashboardAnalytics,
  getDashboardForecast,
} from '../controllers/dashboardController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/summary', authMiddleware, getDashboardSummary);
router.get('/analytics', authMiddleware, getDashboardAnalytics);
router.get('/forecast', authMiddleware, getDashboardForecast);

export default router;
