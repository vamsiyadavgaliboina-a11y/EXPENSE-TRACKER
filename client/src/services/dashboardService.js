import api from './api';

export const dashboardService = {
  async getSummary() {
    const response = await api.get('/dashboard/summary');
    return response.data;
  },

  async getAnalytics() {
    const response = await api.get('/dashboard/analytics');
    return response.data;
  },

  async getForecast() {
    const response = await api.get('/dashboard/forecast');
    return response.data;
  },
};
