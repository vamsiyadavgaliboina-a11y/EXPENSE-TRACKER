import React, { useEffect, useState } from 'react';
import { Plus, Target, Trash2, Edit2 } from 'lucide-react';
import Modal from '../components/Modal';
import { budgetService } from '../services/budgetService';
import { LoadingSpinner, EmptyState } from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/formatCurrency';
import { EXPENSE_CATEGORIES } from '../utils/constants';
import toast from 'react-hot-toast';

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const now = new Date();
  const [formData, setFormData] = useState({
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    totalBudget: '',
    categoryBudgets: {},
  });

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const response = await budgetService.getBudgets({ limit: 20 });
      setBudgets(response.budgets || []);
    } catch (error) {
      toast.error('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBudget) {
        await budgetService.updateBudget(editingBudget._id, formData);
        toast.success('Budget updated');
      } else {
        await budgetService.createBudget(formData);
        toast.success('Budget created');
      }
      setIsModalOpen(false);
      setEditingBudget(null);
      resetForm();
      fetchBudgets();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save budget');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this budget?')) {
      try {
        await budgetService.deleteBudget(id);
        toast.success('Budget deleted');
        fetchBudgets();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      totalBudget: '',
      categoryBudgets: {},
    });
    setEditingBudget(null);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Budget</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Set and manage your monthly budgets</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Create Budget
        </button>
      </div>

      {budgets.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {budgets.map((budget) => (
            <div key={budget._id} className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {new Date(budget.year, budget.month - 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex gap-2">
                  <button onClick={() => {
                    setEditingBudget(budget);
                    setFormData(budget);
                    setIsModalOpen(true);
                  }} className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded">
                    <Edit2 size={18} className="text-blue-600" />
                  </button>
                  <button onClick={() => handleDelete(budget._id)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded">
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Total Budget</span>
                    <span className="font-bold text-primary">{formatCurrency(budget.totalBudget)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={Target} title="No Budgets" message="Create your first budget" />
      )}

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={editingBudget ? 'Edit Budget' : 'Create Budget'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Month *</label>
              <select value={formData.month} onChange={(e) => setFormData({...formData, month: parseInt(e.target.value)})} className="input-field">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => <option key={m} value={m}>{new Date(2024, m-1).toLocaleDateString('en-IN', {month: 'long'})}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Year *</label>
              <input type="number" value={formData.year} onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Total Budget *</label>
            <input type="number" value={formData.totalBudget} onChange={(e) => setFormData({...formData, totalBudget: e.target.value})} className="input-field" required step="0.01" />
          </div>
          <div className="flex gap-4">
            <button type="submit" className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-blue-700 font-semibold">
              {editingBudget ? 'Update' : 'Create'} Budget
            </button>
            <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="flex-1 bg-gray-200 dark:bg-gray-700 py-2 rounded-lg font-semibold">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Budget;
