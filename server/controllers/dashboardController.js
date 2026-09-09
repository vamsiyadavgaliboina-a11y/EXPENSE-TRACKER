import Expense from '../models/Expense.js';
import Income from '../models/Income.js';
import Budget from '../models/Budget.js';
import User from '../models/User.js';
import {
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateBalance,
  calculateBudgetUsage,
  calculateCategoryTotals,
  calculateMonthlyTotals,
} from '../utils/calculations.js';

export const getDashboardSummary = async (req, res, next) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Get user
    const user = await User.findById(req.user.userId);

    // Get all expenses
    const allExpenses = await Expense.find({ userId: req.user.userId }).lean();

    // Get all income
    const allIncome = await Income.find({ userId: req.user.userId }).lean();

    // Calculate totals
    const totalIncome = calculateTotalIncome(allIncome);
    const totalExpenses = calculateTotalExpenses(allExpenses);
    const balance = calculateBalance(totalIncome, totalExpenses);

    // Get current month data
    const currentMonthExpenses = allExpenses.filter(exp => {
      const date = new Date(exp.date);
      return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
    });

    const currentMonthIncome = allIncome.filter(inc => {
      const date = new Date(inc.date);
      return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
    });

    const monthlyExpenses = calculateTotalExpenses(currentMonthExpenses);
    const monthlyIncome = calculateTotalIncome(currentMonthIncome);

    // Get current month budget
    const currentBudget = await Budget.findOne({
      userId: req.user.userId,
      month: currentMonth,
      year: currentYear,
    }).lean();

    const budgetUsage = currentBudget
      ? calculateBudgetUsage(monthlyExpenses, currentBudget.totalBudget)
      : 0;

    // Calculate days and spending
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const daysElapsed = Math.max(1, now.getDate());

    // Unique days in current month that had expenses
    const daysWithExpenses = new Set(
      currentMonthExpenses.map(exp => new Date(exp.date).toISOString().split('T')[0])
    ).size;

    // Average daily spending:
    // When expenses exist, calculate based on active spending days, and also provide MTD average
    const averageDailySpending = daysWithExpenses > 0
      ? monthlyExpenses / daysWithExpenses
      : (daysElapsed > 0 ? monthlyExpenses / daysElapsed : 0);

    const dailyAverageMTD = daysElapsed > 0 ? monthlyExpenses / daysElapsed : 0;

    res.status(200).json({
      totalIncome: Math.round(totalIncome * 100) / 100,
      totalExpenses: Math.round(totalExpenses * 100) / 100,
      balance: Math.round(balance * 100) / 100,
      monthlyIncome: Math.round(monthlyIncome * 100) / 100,
      monthlyExpenses: Math.round(monthlyExpenses * 100) / 100,
      monthlyBudget: currentBudget?.totalBudget || 0,
      budgetUsage: Math.round(budgetUsage * 100) / 100,
      averageDailySpending: Math.round(averageDailySpending * 100) / 100,
      dailyAverageMTD: Math.round(dailyAverageMTD * 100) / 100,
      daysWithExpenses,
      daysElapsed,
      daysInMonth,
      currency: user.currency,
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Get current month expenses
    const currentMonthExpenses = await Expense.find({
      userId: req.user.userId,
      date: {
        $gte: new Date(currentYear, currentMonth - 1, 1),
        $lt: new Date(currentYear, currentMonth, 1),
      },
    }).lean();

    // Get last 12 months expenses for chart
    const monthlyData = {};
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - 1 - i, 1);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const key = `${year}-${month < 10 ? '0' + month : month}`;

      const expenses = await Expense.find({
        userId: req.user.userId,
        date: {
          $gte: new Date(year, month - 1, 1),
          $lt: new Date(year, month, 1),
        },
      }).lean();

      monthlyData[key] = calculateTotalExpenses(expenses);
    }

    // Get category breakdown
    const categoryTotals = calculateCategoryTotals(currentMonthExpenses);

    // Get category distribution data
    const categoryData = Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount: Math.round(amount * 100) / 100,
      percentage: Math.round(
        (amount / calculateTotalExpenses(currentMonthExpenses)) * 100 * 100
      ) / 100,
    }));

    res.status(200).json({
      monthlyData,
      categoryData,
      currentMonthTotal: Math.round(calculateTotalExpenses(currentMonthExpenses) * 100) / 100,
    });
  } catch (error) {
    next(error);
  }
};

export const getDashboardForecast = async (req, res, next) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Get all user expenses
    const allExpenses = await Expense.find({ userId: req.user.userId }).lean();

    // Filter current month expenses
    const currentMonthExpenses = allExpenses.filter(exp => {
      const date = new Date(exp.date);
      return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
    });

    // Get current budget
    const currentBudget = await Budget.findOne({
      userId: req.user.userId,
      month: currentMonth,
      year: currentYear,
    }).lean();

    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const daysElapsed = now.getDate();

    // Calculate current spending
    const currentSpending = calculateTotalExpenses(currentMonthExpenses);

    // Calculate average daily and projected
    const avgDaily = currentSpending / daysElapsed || 0;
    const projectedSpending = avgDaily * daysInMonth;

    res.status(200).json({
      currentSpending: Math.round(currentSpending * 100) / 100,
      projectedSpending: Math.round(projectedSpending * 100) / 100,
      budget: currentBudget?.totalBudget || 0,
      remaining: Math.round((Math.max(0, (currentBudget?.totalBudget || 0) - projectedSpending)) * 100) / 100,
      daysElapsed,
      daysInMonth,
      status: projectedSpending > (currentBudget?.totalBudget || 0) ? 'exceeding' : 'on-track',
    });
  } catch (error) {
    next(error);
  }
};
