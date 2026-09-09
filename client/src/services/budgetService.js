import api from './api';

export const budgetService = {
  async getBudgets(params = {}) {
    const response = await api.get('/budget', { params });
    return response.data;
  },

  async createBudget(budgetData) {
    const response = await api.post('/budget', budgetData);
    return response.data;
  },

  async updateBudget(id, budgetData) {
    const response = await api.put(`/budget/${id}`, budgetData);
    return response.data;
  },

  async deleteBudget(id) {
    const response = await api.delete(`/budget/${id}`);
    return response.data;
  },
};
