import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatCurrencyShort } from '../utils/formatCurrency';

export const SummaryCard = ({ icon: Icon, title, amount, percentage, currency = '₹', trend = 'up', subtitle }) => {
  const isNumeric = typeof amount === 'number' || (!isNaN(Number(amount)) && String(amount).trim() !== '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {isNumeric ? formatCurrencyShort(amount, currency) : amount}
          </p>
          {percentage !== undefined && (
            <div className="flex items-center gap-2 mt-2">
              {trend === 'up' ? (
                <TrendingUp size={16} className="text-green-500" />
              ) : (
                <TrendingDown size={16} className="text-red-500" />
              )}
              <span className={`text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {percentage}% vs last month
              </span>
            </div>
          )}
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
              {subtitle}
            </p>
          )}
        </div>
        <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
          {Icon && <Icon className="text-white" size={24} />}
        </div>
      </div>
    </motion.div>
  );
};

export const ExpenseCard = ({ title, category, amount, date, paymentMethod }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="card p-4"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        <div className="flex gap-2 mt-2">
          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
            {category}
          </span>
          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
            {paymentMethod}
          </span>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-red-600 dark:text-red-400">-{formatCurrency(amount)}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(date).toLocaleDateString()}</p>
      </div>
    </div>
  </motion.div>
);

export const IncomeCard = ({ source, amount, category, date }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="card p-4"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-white">{source}</h3>
        <div className="flex gap-2 mt-2">
          <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">
            {category}
          </span>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-green-600 dark:text-green-400">+{formatCurrency(amount)}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(date).toLocaleDateString()}</p>
      </div>
    </div>
  </motion.div>
);

export const BudgetProgress = ({ category, spent, limit, status = 'safe' }) => {
  const percentage = (spent / limit) * 100;
  const statusColors = {
    safe: 'bg-green-500',
    warning: 'bg-yellow-500',
    critical: 'bg-orange-500',
    exceeded: 'bg-red-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900 dark:text-white">{category}</h3>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {formatCurrency(spent)} / {formatCurrency(limit)}
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${statusColors[status]}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        {percentage.toFixed(0)}% used • {formatCurrency(Math.max(0, limit - spent))} remaining
      </p>
    </motion.div>
  );
};
