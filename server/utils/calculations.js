export const calculateTotalIncome = (incomeRecords) => {
  return incomeRecords.reduce((sum, record) => sum + record.amount, 0);
};

export const calculateTotalExpenses = (expenseRecords) => {
  return expenseRecords.reduce((sum, record) => sum + record.amount, 0);
};

export const calculateBalance = (totalIncome, totalExpenses) => {
  return totalIncome - totalExpenses;
};

export const calculateBudgetUsage = (spent, budget) => {
  if (budget === 0) return 0;
  return (spent / budget) * 100;
};

export const calculateRemainingBudget = (budget, spent) => {
  return Math.max(0, budget - spent);
};

export const calculateAverageDailySpending = (totalExpenses, daysElapsed) => {
  if (daysElapsed === 0) return 0;
  return totalExpenses / daysElapsed;
};

export const calculateProjectedSpending = (averageDailySpending, daysInMonth) => {
  return averageDailySpending * daysInMonth;
};

export const calculateCategoryTotals = (expenses) => {
  const categories = {};
  expenses.forEach(expense => {
    if (!categories[expense.category]) {
      categories[expense.category] = 0;
    }
    categories[expense.category] += expense.amount;
  });
  return categories;
};

export const calculateMonthlyTotals = (records, targetMonth, targetYear) => {
  return records.filter(record => {
    const date = new Date(record.date);
    return date.getMonth() + 1 === targetMonth && date.getFullYear() === targetYear;
  }).reduce((sum, record) => sum + record.amount, 0);
};

export const getDaysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

export const getDaysElapsedInMonth = (date) => {
  const now = date instanceof Date ? date : new Date(date);
  return now.getDate();
};

export const getBudgetStatus = (usage) => {
  if (usage < 70) return 'safe';
  if (usage < 90) return 'warning';
  if (usage <= 100) return 'critical';
  return 'exceeded';
};
