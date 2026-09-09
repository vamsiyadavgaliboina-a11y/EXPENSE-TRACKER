import React, { useEffect, useState } from 'react';
import { LineChart, Line, PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { dashboardService } from '../services/dashboardService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { CATEGORY_COLORS } from '../utils/constants';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await dashboardService.getAnalytics();
        setAnalytics(data);
      } catch (error) {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!analytics) return <div>No data available</div>;

  const monthlyData = Object.entries(analytics.monthlyData || {}).map(([month, amount]) => ({
    month: month.split('-')[1],
    amount: Math.round(amount),
  }));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>

      {/* Monthly Trend */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Monthly Spending Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Category Distribution */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Category Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={analytics.categoryData || []}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {(analytics.categoryData || []).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.category] || '#95A5A6'} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Category Details */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Category Breakdown</h2>
        <div className="space-y-3">
          {(analytics.categoryData || []).map((cat, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="font-medium">{cat.category}</span>
              <div className="text-right">
                <p className="font-bold">₹{cat.amount}</p>
                <p className="text-xs text-gray-500">{cat.percentage}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
