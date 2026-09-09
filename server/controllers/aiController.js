import Expense from '../models/Expense.js';
import Income from '../models/Income.js';
import Budget from '../models/Budget.js';
import { groqService } from '../services/groqService.js';
import { forecastService } from '../services/forecastService.js';
import {
  calculateCategoryTotals,
  calculateTotalExpenses,
  calculateTotalIncome,
} from '../utils/calculations.js';

export const getSpendingInsights = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Fetch user financial data
    const expenses = await Expense.find({ userId }).lean();
    const income = await Income.find({ userId }).lean();
    const budget = await Budget.findOne({ userId, month: currentMonth, year: currentYear }).lean();

    // Get current month data
    const currentMonthExpenses = expenses.filter(exp => {
      const date = new Date(exp.date);
      return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
    });

    const currentMonthIncome = income.filter(inc => {
      const date = new Date(inc.date);
      return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
    });

    // Prepare financial data for AI
    const categoryTotals = calculateCategoryTotals(currentMonthExpenses);
    const totalExpenses = calculateTotalExpenses(currentMonthExpenses);
    const totalIncome = calculateTotalIncome(currentMonthIncome);

    const financialData = {
      monthlyIncome: Math.round(totalIncome * 100) / 100,
      monthlyBudget: budget?.totalBudget || 0,
      currentSpending: Math.round(totalExpenses * 100) / 100,
      categoryBreakdown: Object.entries(categoryTotals).map(([category, amount]) => ({
        category,
        amount: Math.round(amount * 100) / 100,
      })),
      budgetUsage: budget ? Math.round((totalExpenses / budget.totalBudget) * 100 * 100) / 100 : 0,
    };

    // Get AI insights
    const insights = await groqService.getInsights(financialData);

    res.status(200).json({
      insights,
    });
  } catch (error) {
    console.error('Error getting spending insights:', error.message);
    next(error);
  }
};

export const getForecastInsights = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Fetch user financial data
    const expenses = await Expense.find({ userId }).lean();
    const budget = await Budget.findOne({ userId, month: currentMonth, year: currentYear }).lean();

    // Generate forecast
    const forecast = forecastService.generateForecast(
      expenses,
      budget?.totalBudget || 0,
      currentMonth,
      currentYear
    );

    // Get historical average
    const historical = forecastService.getHistoricalAverage(expenses, 3);

    // Prepare data for AI
    const forecastData = {
      currentSpending: forecast.currentSpending,
      projectedSpending: forecast.projectedSpending,
      budget: forecast.budget,
      daysElapsed: forecast.daysElapsed,
      daysInMonth: forecast.daysInMonth,
      averageDailySpending: forecast.averageDailySpending,
      historicalAverage: historical.average,
      status: forecast.status,
    };

    // Get AI forecast interpretation
    const aiInsights = await groqService.getForecastInsights(forecastData);

    res.status(200).json({
      forecast,
      aiInsights,
    });
  } catch (error) {
    console.error('Error getting forecast insights:', error.message);
    next(error);
  }
};

export const chatWithAssistant = async (req, res, next) => {
  try {
    const { message, messages } = req.body;
    const conversation = Array.isArray(messages) ? [...messages] : [];
    if (message && conversation[conversation.length - 1]?.content !== message) {
      conversation.push({ role: 'user', content: message });
    }

    let userContext = null;
    if (req.user?.userId) {
      try {
        const User = (await import('../models/User.js')).default;
        const user = await User.findById(req.user.userId).lean();
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        const expenses = await Expense.find({ userId: req.user.userId }).lean();
        const budget = await Budget.findOne({ userId: req.user.userId, month: currentMonth, year: currentYear }).lean();
        const income = await Income.find({ userId: req.user.userId }).lean();

        const currentMonthExpenses = expenses.filter(exp => {
          const date = new Date(exp.date);
          return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        });

        const totalMonthExpenses = calculateTotalExpenses(currentMonthExpenses);
        const totalIncome = calculateTotalIncome(income);
        const allExpensesTotal = calculateTotalExpenses(expenses);

        userContext = {
          name: user?.name,
          currency: user?.currency || '₹',
          monthlyExpenses: Math.round(totalMonthExpenses * 100) / 100,
          monthlyBudget: budget?.totalBudget || 0,
          balance: Math.round((totalIncome - allExpensesTotal) * 100) / 100,
        };
      } catch (err) {
        console.warn('Error assembling user context for chat:', err.message);
      }
    }

    const result = await groqService.chat(conversation, userContext);

    res.status(200).json({
      reply: result.reply,
      source: result.source,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in chatWithAssistant:', error.message);
    next(error);
  }
};

