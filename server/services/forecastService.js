import {
  calculateAverageDailySpending,
  calculateProjectedSpending,
  getDaysInMonth,
  getDaysElapsedInMonth,
} from '../utils/calculations.js';

export const forecastService = {
  generateForecast(expenses, budget, currentMonth, currentYear) {
    // Filter expenses for current month
    const currentMonthExpenses = expenses.filter(exp => {
      const date = new Date(exp.date);
      return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
    });

    const totalCurrentSpending = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const daysElapsed = getDaysElapsedInMonth(new Date());
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    
    const averageDailySpending = calculateAverageDailySpending(totalCurrentSpending, daysElapsed);
    const projectedSpending = calculateProjectedSpending(averageDailySpending, daysInMonth);

    // Calculate category-wise projections
    const categoryTotals = {};
    currentMonthExpenses.forEach(exp => {
      if (!categoryTotals[exp.category]) {
        categoryTotals[exp.category] = 0;
      }
      categoryTotals[exp.category] += exp.amount;
    });

    const categoryProjections = {};
    Object.keys(categoryTotals).forEach(category => {
      const currentAmount = categoryTotals[category];
      const dailyAmount = currentAmount / daysElapsed;
      categoryProjections[category] = Math.round(dailyAmount * daysInMonth);
    });

    // Determine status
    let status = 'on-track';
    if (projectedSpending > budget * 1.1) {
      status = 'exceeding';
    } else if (projectedSpending > budget * 0.9) {
      status = 'at-risk';
    }

    return {
      currentSpending: Math.round(totalCurrentSpending * 100) / 100,
      projectedSpending: Math.round(projectedSpending * 100) / 100,
      budget,
      remainingBudget: Math.round((budget - projectedSpending) * 100) / 100,
      status,
      daysElapsed,
      daysInMonth,
      averageDailySpending: Math.round(averageDailySpending * 100) / 100,
      categoryProjections,
    };
  },

  getHistoricalAverage(expenses, months = 3) {
    // Get average spending for the last N months
    const monthsData = {};
    const now = new Date();

    for (let i = 0; i < months; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const key = `${year}-${month}`;

      const monthExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() + 1 === month && expDate.getFullYear() === year;
      });

      const monthTotal = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      monthsData[key] = monthTotal;
    }

    const total = Object.values(monthsData).reduce((sum, val) => sum + val, 0);
    const average = Math.round((total / months) * 100) / 100;

    return {
      historicalData: monthsData,
      average,
      months,
    };
  },
};
