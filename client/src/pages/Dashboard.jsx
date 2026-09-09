import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  TrendingDown,
  TrendingUp,
  Target,
  AlertCircle,
} from 'lucide-react';
import { SummaryCard, BudgetProgress } from '../components/Cards';
import { LoadingSpinner, EmptyState } from '../components/LoadingSpinner';
import { useFinance } from '../context/FinanceContext';
import { expenseService } from '../services/expenseService';
import { incomeService } from '../services/incomeService';
import { budgetService } from '../services/budgetService';
import { formatCurrency } from '../utils/formatCurrency';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { summary, loading, loadSummary } = useFinance();
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [budgetData, setBudgetData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        await loadSummary();
        
        // Get recent expenses
        const expensesResponse = await expenseService.getExpenses({ limit: 5 });
        setRecentExpenses(expensesResponse.expenses || []);

        // Get current budget
        const now = new Date();
        const budgetsResponse = await budgetService.getBudgets({
          month: now.getMonth() + 1,
          year: now.getFullYear(),
          limit: 1,
        });
        if (budgetsResponse.budgets?.length > 0) {
          setBudgetData(budgetsResponse.budgets[0]);
        }
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [loadSummary]);

  if (loadingData) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back! Here's your financial overview.</p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard
            icon={Wallet}
            title="Total Income"
            amount={summary.totalIncome}
            currency={summary.currency}
          />
          <SummaryCard
            icon={TrendingDown}
            title="Total Expenses"
            amount={summary.totalExpenses}
            currency={summary.currency}
          />
          <SummaryCard
            icon={Wallet}
            title="Balance"
            amount={summary.balance}
            currency={summary.currency}
            trend={summary.balance >= 0 ? 'up' : 'down'}
          />
          <SummaryCard
            icon={Target}
            title="Budget Used"
            amount={summary.monthlyExpenses}
            currency={summary.currency}
            subtitle={
              summary.monthlyBudget > 0
                ? `${Math.round(summary.budgetUsage)}% of ${formatCurrency(summary.monthlyBudget, summary.currency)}`
                : 'No budget set'
            }
          />
        </div>
      )}

      {/* Monthly Overview */}
      {summary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* This Month Stats */}
          <div className="lg:col-span-2 card p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">This Month</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Income</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(summary.monthlyIncome, summary.currency)}
                </p>
              </div>
              <div className="text-center border-l border-r border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Expenses</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(summary.monthlyExpenses, summary.currency)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Remaining</p>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(summary.monthlyIncome - summary.monthlyExpenses, summary.currency)}
                </p>
              </div>
            </div>

            {/* Daily Average */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average Daily Expenses</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(summary.averageDailySpending, summary.currency)}
              </p>
              {summary.daysWithExpenses !== undefined && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {summary.daysWithExpenses > 0
                    ? `Based on ${summary.daysWithExpenses} active spending day${summary.daysWithExpenses > 1 ? 's' : ''} this month (${formatCurrency(summary.dailyAverageMTD || summary.averageDailySpending, summary.currency)}/day MTD)`
                    : 'No expenses recorded this month'}
                </p>
              )}
            </div>
          </div>

          {/* Budget Status */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Budget Status</h2>
            {summary.monthlyBudget > 0 ? (
              <>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Used</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {Math.round(summary.budgetUsage)}%
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        summary.budgetUsage > 100
                          ? 'bg-red-500'
                          : summary.budgetUsage > 90
                          ? 'bg-orange-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(summary.budgetUsage, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Budget</span>
                    <span className="font-semibold">{formatCurrency(summary.monthlyBudget, summary.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Spent</span>
                    <span className="font-semibold">{formatCurrency(summary.monthlyExpenses, summary.currency)}</span>
                  </div>
                  <div className="flex justify-between text-primary font-semibold">
                    <span>Remaining</span>
                    <span>{formatCurrency(Math.max(0, summary.monthlyBudget - summary.monthlyExpenses), summary.currency)}</span>
                  </div>
                </div>

                {summary.budgetUsage > 90 && (
                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-start gap-2">
                    <AlertCircle className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" size={18} />
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                      {summary.budgetUsage > 100
                        ? 'You have exceeded your budget'
                        : 'You are approaching your budget limit'}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No budget set for this month</p>
            )}
          </div>
        </motion.div>
      )}

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Expenses</h2>
          <a href="/expenses" className="text-primary hover:underline text-sm font-semibold">
            View All
          </a>
        </div>

        {recentExpenses.length > 0 ? (
          <div className="space-y-3">
            {recentExpenses.map((expense) => (
              <div
                key={expense._id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{expense.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {expense.category} • {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
                <p className="font-semibold text-red-600 dark:text-red-400">
                  -{formatCurrency(expense.amount)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={TrendingDown}
            title="No Expenses Yet"
            message="Start by adding your first expense"
          />
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
