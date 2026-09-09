import api from './api';

export const aiService = {
  async getSpendingInsights() {
    const response = await api.post('/ai/insights');
    return response.data;
  },

  async getForecastInsights() {
    const response = await api.post('/ai/forecast-insights');
    return response.data;
  },
};
