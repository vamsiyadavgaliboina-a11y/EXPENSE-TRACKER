import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import Modal from '../components/Modal';
import { incomeService } from '../services/incomeService';
import { LoadingSpinner, EmptyState } from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/formatCurrency';
import { INCOME_CATEGORIES } from '../utils/constants';
import toast from 'react-hot-toast';

const Income = () => {
  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    category: 'Pocket Money',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchIncome();
  }, []);

  const fetchIncome = async () => {
    setLoading(true);
    try {
      const response = await incomeService.getIncome({ limit: 20 });
      setIncome(response.income || []);
    } catch (error) {
      toast.error('Failed to load income');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingIncome) {
        await incomeService.updateIncome(editingIncome._id, formData);
        toast.success('Income updated successfully');
      } else {
        await incomeService.createIncome(formData);
        toast.success('Income added successfully');
      }
      setIsModalOpen(false);
      setEditingIncome(null);
      resetForm();
      fetchIncome();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save income');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      try {
        await incomeService.deleteIncome(id);
        toast.success('Income deleted');
        fetchIncome();
      } catch (error) {
        toast.error('Failed to delete');
      }
    }
  };

  const handleEdit = (inc) => {
    setEditingIncome(inc);
    setFormData({
      source: inc.source,
      amount: inc.amount,
      category: inc.category,
      description: inc.description,
      date: new Date(inc.date).toISOString().split('T')[0],
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      source: '',
      amount: '',
      category: 'Pocket Money',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
    setEditingIncome(null);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <LoadingSpinner />;

  const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Income</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Track your income sources</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus size={20} />
          Add Income
        </button>
      </div>

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Income</p>
        <p className="text-4xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalIncome)}</p>
      </motion.div>

      {/* Income List */}
      {income.length > 0 ? (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-4 font-semibold">Source</th>
                  <th className="text-left p-4 font-semibold">Category</th>
                  <th className="text-left p-4 font-semibold">Amount</th>
                  <th className="text-left p-4 font-semibold">Date</th>
                  <th className="text-left p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {income.map((inc) => (
                  <tr key={inc._id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="p-4 text-gray-900 dark:text-white">{inc.source}</td>
                    <td className="p-4 badge bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">{inc.category}</td>
                    <td className="p-4 font-semibold text-green-600 dark:text-green-400">+{formatCurrency(inc.amount)}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{new Date(inc.date).toLocaleDateString()}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(inc)} className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded">
                          <Edit2 size={18} className="text-blue-600" />
                        </button>
                        <button onClick={() => handleDelete(inc._id)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded">
                          <Trash2 size={18} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState icon={Plus} title="No Income" message="Add your first income source" />
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={editingIncome ? 'Edit Income' : 'Add Income'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Source *</label>
            <input type="text" name="source" value={formData.source} onChange={handleFormChange} className="input-field" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Amount *</label>
              <input type="number" name="amount" value={formData.amount} onChange={handleFormChange} className="input-field" required step="0.01" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select name="category" value={formData.category} onChange={handleFormChange} className="input-field">
                {INCOME_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date *</label>
            <input type="date" name="date" value={formData.date} onChange={handleFormChange} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <input type="text" name="description" value={formData.description} onChange={handleFormChange} className="input-field" />
          </div>
          <div className="flex gap-4">
            <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-semibold">
              {editingIncome ? 'Update' : 'Add'} Income
            </button>
            <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="flex-1 bg-gray-200 dark:bg-gray-700 py-2 rounded-lg hover:bg-gray-300 font-semibold">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Income;
