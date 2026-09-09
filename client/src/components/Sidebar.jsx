import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  TrendingDown,
  TrendingUp,
  Target,
  BarChart3,
  Zap,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandLogo from './BrandLogo';

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'Dashboard', icon: Home, path: '/dashboard' },
    { label: 'Expenses', icon: TrendingDown, path: '/expenses' },
    { label: 'Income', icon: TrendingUp, path: '/income' },
    { label: 'Budget', icon: Target, path: '/budget' },
    { label: 'Analytics', icon: BarChart3, path: '/analytics' },
    { label: 'Forecast', icon: Zap, path: '/forecast' },
    { label: 'AI Insights', icon: Zap, path: '/ai-insights' },
  ];

  const bottomItems = [
    { label: 'Notifications', icon: Bell, path: '/notifications' },
    { label: 'Profile', icon: User, path: '/profile' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -256 }}
        animate={{ x: isOpen ? 0 : 0 }}
        className={`
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          fixed lg:relative lg:block
          w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          flex flex-col z-40 transition-transform duration-300
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <BrandLogo className="w-10 h-10 object-contain" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">Expense Tracker</span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${isActive(item.path)
                  ? 'bg-primary text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom Menu Items */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          {bottomItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${isActive(item.path)
                  ? 'bg-primary text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}

          {/* Logout Button */}
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
