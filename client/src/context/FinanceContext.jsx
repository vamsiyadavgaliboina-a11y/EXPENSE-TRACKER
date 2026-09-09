import React, { createContext, useContext, useState, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';
import toast from 'react-hot-toast';

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [summary, setSummary] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    try {
      const data = await dashboardService.getSummary();
      setSummary(data);
    } catch (error) {
      toast.error('Failed to load summary');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAnalytics = useCallback(async () => {
    try {
      const data = await dashboardService.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      toast.error('Failed to load analytics');
    }
  }, []);

  const loadForecast = useCallback(async () => {
    try {
      const data = await dashboardService.getForecast();
      setForecast(data);
    } catch (error) {
      toast.error('Failed to load forecast');
    }
  }, []);

  const refreshAllData = useCallback(async () => {
    await Promise.all([loadSummary(), loadAnalytics(), loadForecast()]);
  }, [loadSummary, loadAnalytics, loadForecast]);

  return (
    <FinanceContext.Provider
      value={{
        summary,
        analytics,
        forecast,
        loading,
        loadSummary,
        loadAnalytics,
        loadForecast,
        refreshAllData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider');
  }
  return context;
};
