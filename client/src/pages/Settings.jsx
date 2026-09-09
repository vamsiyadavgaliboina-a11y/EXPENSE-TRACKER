import React, { useState } from 'react';
import { Moon, Sun, Bell, Shield, ShieldCheck, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import api from '../services/api';
import toast from 'react-hot-toast';

const Settings = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    budgetWarnings: true,
  });
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isTwoFactorModalOpen, setIsTwoFactorModalOpen] = useState(false);
  const [twoFactorMode, setTwoFactorMode] = useState('setup');
  const [twoFactorSetup, setTwoFactorSetup] = useState({ qrCode: '', manualKey: '' });
  const [twoFactorData, setTwoFactorData] = useState({ currentPassword: '', token: '' });
  const [isUpdatingTwoFactor, setIsUpdatingTwoFactor] = useState(false);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setIsChangingPassword(true);

    try {
      await api.put('/user/password', passwordData);
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsPasswordModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const openTwoFactorModal = async () => {
    setIsUpdatingTwoFactor(true);
    try {
      if (user?.twoFactorEnabled) {
        setTwoFactorMode('disable');
      } else {
        const response = await api.post('/user/2fa/setup');
        setTwoFactorSetup(response.data);
        setTwoFactorMode('setup');
      }
      setTwoFactorData({ currentPassword: '', token: '' });
      setIsTwoFactorModalOpen(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to start two-factor setup');
    } finally {
      setIsUpdatingTwoFactor(false);
    }
  };

  const handleTwoFactorSubmit = async (e) => {
    e.preventDefault();
    setIsUpdatingTwoFactor(true);

    try {
      const response = twoFactorMode === 'setup'
        ? await api.post('/user/2fa/verify', { token: twoFactorData.token })
        : await api.post('/user/2fa/disable', twoFactorData);

      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setIsTwoFactorModalOpen(false);
      setTwoFactorData({ currentPassword: '', token: '' });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update two-factor authentication');
    } finally {
      setIsUpdatingTwoFactor(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>

      {/* Appearance */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Appearance</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDark ? <Moon size={20} /> : <Sun size={20} />}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Toggle dark theme</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-14 h-8 rounded-full transition-colors ${
                isDark ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  isDark ? 'translate-x-7' : 'translate-x-1'
                }`}
              ></div>
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Notifications</h2>
        <div className="space-y-4">
          {[
            { key: 'notifications', label: 'Push Notifications', desc: 'Receive push notifications' },
            { key: 'emailAlerts', label: 'Email Alerts', desc: 'Get important updates via email' },
            { key: 'budgetWarnings', label: 'Budget Warnings', desc: 'Alert me when budget is low' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
              <button
                onClick={() => setSettings({ ...settings, [item.key]: !settings[item.key] })}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings[item.key] ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings[item.key] ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                ></div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Security</h2>
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setIsPasswordModalOpen(true)}
            className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
          >
            <Shield size={20} className="text-primary" />
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-white">Change Password</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Update your password</p>
            </div>
          </button>
          <button
            type="button"
            onClick={openTwoFactorModal}
            disabled={isUpdatingTwoFactor}
            className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
          >
            {user?.twoFactorEnabled ? <ShieldCheck size={20} className="text-green-500" /> : <Bell size={20} className="text-primary" />}
            <div className="text-left">
              <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user?.twoFactorEnabled ? 'Enabled - click to disable' : 'Use an authenticator app for extra security'}
              </p>
            </div>
          </button>
        </div>
      </div>

      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Password"
      >
        <form onSubmit={handlePasswordChange} className="space-y-4">
          {[
            { name: 'currentPassword', label: 'Current password' },
            { name: 'newPassword', label: 'New password' },
            { name: 'confirmPassword', label: 'Confirm new password' },
          ].map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type="password"
                value={passwordData[field.name]}
                onChange={(e) => setPasswordData({ ...passwordData, [field.name]: e.target.value })}
                className="input-field"
                minLength={6}
                required
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={isChangingPassword}
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
          >
            {isChangingPassword ? 'Changing password...' : 'Change Password'}
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={isTwoFactorModalOpen}
        onClose={() => setIsTwoFactorModalOpen(false)}
        title={twoFactorMode === 'setup' ? 'Enable Two-Factor Authentication' : 'Disable Two-Factor Authentication'}
      >
        {twoFactorMode === 'setup' && (
          <div className="space-y-4 mb-5 text-sm text-gray-600 dark:text-gray-300">
            <p>Scan this QR code with Google Authenticator, Microsoft Authenticator, or another TOTP app.</p>
            {twoFactorSetup.qrCode && (
              <img src={twoFactorSetup.qrCode} alt="Two-factor authentication setup QR code" className="w-48 h-48 mx-auto" />
            )}
            <p>Can&apos;t scan it? Enter this setup key manually:</p>
            <code className="block break-all p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-center">
              {twoFactorSetup.manualKey}
            </code>
          </div>
        )}
        <form onSubmit={handleTwoFactorSubmit} className="space-y-4">
          {twoFactorMode === 'disable' && (
            <div>
              <label htmlFor="two-factor-current-password" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                Current password
              </label>
              <input
                id="two-factor-current-password"
                type="password"
                value={twoFactorData.currentPassword}
                onChange={(e) => setTwoFactorData({ ...twoFactorData, currentPassword: e.target.value })}
                className="input-field"
                required
              />
            </div>
          )}
          <div>
            <label htmlFor="two-factor-token" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
              Authenticator code
            </label>
            <input
              id="two-factor-token"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={twoFactorData.token}
              onChange={(e) => setTwoFactorData({ ...twoFactorData, token: e.target.value.replace(/\D/g, '') })}
              className="input-field"
              placeholder="123456"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isUpdatingTwoFactor}
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
          >
            {isUpdatingTwoFactor ? 'Please wait...' : twoFactorMode === 'setup' ? 'Enable 2FA' : 'Disable 2FA'}
          </button>
        </form>
      </Modal>

      {/* Logout */}
      <div className="card p-6 border-l-4 border-red-500">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Account</h2>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Settings;
