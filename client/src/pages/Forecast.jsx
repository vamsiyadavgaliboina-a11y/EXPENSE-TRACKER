import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dashboardService } from '../services/dashboardService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/formatCurrency';
import toast from 'react-hot-toast';

const Forecast = () => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const data = await dashboardService.getForecast();
        setForecast(data);
      } catch (error) {
        toast.error('Failed to load forecast');
      } finally {
        setLoading(false);
      }
    };
    fetchForecast();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!forecast) return <div>No forecast available</div>;

  const chartData = [
    { name: 'Current', value: forecast.currentSpending },
    { name: 'Projected', value: forecast.projectedSpending },
    { name: 'Budget', value: forecast.budget },
  ];

  const statusColor = forecast.status === 'exceeding' ? 'text-red-600' : 'text-green-600';

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Spending Forecast</h1>

      {/* Status Card */}
      <div className="card p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <h2 className="text-lg font-semibold mb-4">This Month's Forecast</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current Spending</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(forecast.currentSpending)}</p>
            <p className="text-xs text-gray-500 mt-1">{forecast.daysElapsed} days elapsed</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Projected Spending</p>
            <p className="text-2xl font-bold text-orange-600">{formatCurrency(forecast.projectedSpending)}</p>
            <p className="text-xs text-gray-500 mt-1">{forecast.daysInMonth} days total</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Budget</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(forecast.budget)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Status</p>
            <p className={`text-2xl font-bold ${statusColor}`}>
              {forecast.status === 'exceeding' ? '⚠️ Exceeding' : '✅ On Track'}
            </p>
          </div>
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Spending Comparison</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Bar dataKey="value" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Insights</h2>
        <div className="space-y-2">
          <p>
            <span className="font-semibold">Daily Average:</span> {formatCurrency(forecast.currentSpending / Math.max(1, forecast.daysElapsed))}
          </p>
          <p>
            <span className="font-semibold">Days Remaining:</span> {forecast.daysInMonth - forecast.daysElapsed}
          </p>
          <p>
            <span className="font-semibold">Remaining Budget:</span>{' '}
            <span className={forecast.remaining < 0 ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>
              {formatCurrency(Math.max(0, forecast.remaining))}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Forecast;
