import React, { useState } from 'react';
import { User, Mail, DollarSign, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    monthlyIncome: user?.monthlyIncome || '',
    currency: user?.currency || '₹',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.put('/user/profile', formData);
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>

      <div className="card p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl font-bold text-white">{user?.name?.charAt(0)}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="input-field pl-10 opacity-60 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            {/* Monthly Income */}
            <div>
              <label className="block text-sm font-medium mb-2">Expected Monthly Income</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="number"
                  name="monthlyIncome"
                  value={formData.monthlyIncome}
                  onChange={handleChange}
                  className="input-field pl-10"
                  step="0.01"
                />
              </div>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-medium mb-2">Currency</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="input-field"
              >
                <option value="₹">Indian Rupee (₹)</option>
                <option value="$">US Dollar ($)</option>
                <option value="€">Euro (€)</option>
                <option value="£">British Pound (£)</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-semibold disabled:opacity-50"
          >
            <Save size={20} />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
