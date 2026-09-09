import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Filter } from 'lucide-react';
import Modal from '../components/Modal';
import { expenseService } from '../services/expenseService';
import { LoadingSpinner, EmptyState, ErrorState } from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/formatCurrency';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../utils/constants';
import toast from 'react-hot-toast';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 10,
  });
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    description: '',
    paymentMethod: 'Cash',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    fetchExpenses();
  }, [filters]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await expenseService.getExpenses(filters);
      setExpenses(response.expenses || []);
    } catch (error) {
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExpense) {
        await expenseService.updateExpense(editingExpense._id, formData);
        toast.success('Expense updated successfully');
      } else {
        await expenseService.createExpense(formData);
        toast.success('Expense added successfully');
      }
      setIsModalOpen(false);
      setEditingExpense(null);
      resetForm();
      fetchExpenses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save expense');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseService.deleteExpense(id);
        toast.success('Expense deleted successfully');
        fetchExpenses();
      } catch (error) {
        toast.error('Failed to delete expense');
      }
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      paymentMethod: expense.paymentMethod,
      date: new Date(expense.date).toISOString().split('T')[0],
      notes: expense.notes,
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      amount: '',
      category: 'Food',
      description: '',
      paymentMethod: 'Cash',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setEditingExpense(null);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Expenses</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage and track your expenses</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Expense
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <Filter size={20} className="text-gray-600 dark:text-gray-400" />
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Categories</option>
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expenses List */}
      {expenses.length > 0 ? (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Title</th>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Category</th>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Amount</th>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Date</th>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Method</th>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <motion.tr
                    key={expense._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="p-4 text-gray-900 dark:text-white">{expense.title}</td>
                    <td className="p-4">
                      <span className="badge bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                        {expense.category}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-red-600 dark:text-red-400">
                      -{formatCurrency(expense.amount)}
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{expense.paymentMethod}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(expense)}
                          className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                        >
                          <Edit2 size={18} className="text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(expense._id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Plus}
          title="No Expenses"
          message="Start by adding your first expense"
          action={
            <button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Expense
            </button>
          }
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingExpense ? 'Edit Expense' : 'Add Expense'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              className="input-field"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Amount *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleFormChange}
                className="input-field"
                required
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                className="input-field"
                required
              >
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleFormChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleFormChange}
                className="input-field"
              >
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleFormChange}
              className="input-field resize-none"
              rows="3"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              {editingExpense ? 'Update' : 'Add'} Expense
            </button>
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Expenses;
