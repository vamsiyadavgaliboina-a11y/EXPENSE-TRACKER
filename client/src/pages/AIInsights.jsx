import React, { useState } from 'react';
import { Zap, Loader } from 'lucide-react';
import { aiService } from '../services/aiService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const AIInsights = () => {
  const [insights, setInsights] = useState(null);
  const [forecastInsights, setForecastInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [loadingForecast, setLoadingForecast] = useState(false);

  const loadInsights = async () => {
    setLoadingInsights(true);
    try {
      const data = await aiService.getSpendingInsights();
      if (data?.insights) {
        setInsights(data.insights);
        toast.success('Spending analysis loaded');
      } else {
        toast.error('No insights data returned');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load insights');
    } finally {
      setLoadingInsights(false);
    }
  };

  const loadForecastInsights = async () => {
    setLoadingForecast(true);
    try {
      const data = await aiService.getForecastInsights();
      if (data?.aiInsights) {
        setForecastInsights(data.aiInsights);
        toast.success('Forecast analysis loaded');
      } else {
        toast.error('No forecast data returned');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load forecast insights');
    } finally {
      setLoadingForecast(false);
    }
  };

  const isAnyLoading = loadingInsights || loadingForecast;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Spending Insights</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Get personalized financial recommendations powered by AI</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={loadInsights}
          disabled={isAnyLoading}
          className="card p-6 text-left hover:shadow-lg transition-shadow border-2 border-primary/20 hover:border-primary cursor-pointer disabled:opacity-50"
        >
          <div className="flex items-center justify-between mb-4">
            <Zap className="text-primary" size={24} />
            {loadingInsights && <Loader className="animate-spin text-primary" size={20} />}
          </div>
          <h3 className="text-lg font-semibold mb-2">Spending Analysis</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Get insights about your current spending patterns</p>
        </button>

        <button
          onClick={loadForecastInsights}
          disabled={isAnyLoading}
          className="card p-6 text-left hover:shadow-lg transition-shadow border-2 border-secondary/20 hover:border-secondary cursor-pointer disabled:opacity-50"
        >
          <div className="flex items-center justify-between mb-4">
            <Zap className="text-secondary" size={24} />
            {loadingForecast && <Loader className="animate-spin text-secondary" size={20} />}
          </div>
          <h3 className="text-lg font-semibold mb-2">Forecast Analysis</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Get insights about your projected spending</p>
        </button>
      </div>

      {isAnyLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader className="animate-spin text-primary" size={28} />
          <span className="ml-3 text-gray-600 dark:text-gray-400 font-medium">
            {loadingInsights ? 'Analyzing your spending patterns...' : 'Generating forecast analysis...'}
          </span>
        </div>
      )}

      {insights && (
        <div className="card p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Spending Analysis</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Summary</h3>
              <p className="text-gray-700 dark:text-gray-300">{insights.summary}</p>
            </div>

            {insights.trends && insights.trends.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">📊 Spending Trends</h3>
                <ul className="space-y-2">
                  {insights.trends.map((trend, i) => (
                    <li key={i} className="text-gray-700 dark:text-gray-300 flex items-start gap-2">
                      <span className="text-primary">•</span> {trend}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {insights.warnings && insights.warnings.length > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-300 mb-2">⚠️ Warnings</h3>
                <ul className="space-y-2">
                  {insights.warnings.map((warning, i) => (
                    <li key={i} className="text-yellow-800 dark:text-yellow-200 flex items-start gap-2">
                      <span>•</span> {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {insights.recommendations && insights.recommendations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">💡 Recommendations</h3>
                <ul className="space-y-2">
                  {insights.recommendations.map((rec, i) => (
                    <li key={i} className="text-gray-700 dark:text-gray-300 flex items-start gap-2">
                      <span className="text-green-600">✓</span> {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {forecastInsights && (
        <div className="card p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Forecast Analysis</h2>
            {forecastInsights.forecastStatus && (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                forecastInsights.forecastStatus === 'exceeding'
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                  : forecastInsights.forecastStatus === 'at-risk'
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
                  : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
              }`}>
                {forecastInsights.forecastStatus === 'exceeding'
                  ? '⚠️ Exceeding'
                  : forecastInsights.forecastStatus === 'at-risk'
                  ? '⚡ At Risk'
                  : '✅ On Track'}
              </span>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Forecast Status</h3>
              <p className="text-gray-700 dark:text-gray-300">{forecastInsights.analysis}</p>
            </div>

            {forecastInsights.actions && forecastInsights.actions.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">📋 Recommended Actions</h3>
                <ul className="space-y-2">
                  {forecastInsights.actions.map((action, i) => (
                    <li key={i} className="text-gray-700 dark:text-gray-300 flex items-start gap-2">
                      <span className="text-blue-600">→</span> {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
