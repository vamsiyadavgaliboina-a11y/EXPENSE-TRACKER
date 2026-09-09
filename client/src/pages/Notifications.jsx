import React, { useEffect, useState } from 'react';
import { Bell, Trash2 } from 'lucide-react';
import api from '../services/api';
import { LoadingSpinner, EmptyState } from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.notifications || []);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      toast.error('Failed to update notification');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      toast.success('Notification deleted');
      fetchNotifications();
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  if (loading) return <LoadingSpinner />;

  const typeIcons = {
    warning: '⚠️',
    critical: '🔴',
    info: 'ℹ️',
    exceeded: '❌',
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>

      {notifications.length > 0 ? (
        <div className="card">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.map((notif) => (
              <div
                key={notif._id}
                className={`p-4 flex items-start justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                  !notif.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{typeIcons[notif.type] || '🔔'}</span>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{notif.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{notif.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  {!notif.read && (
                    <button
                      onClick={() => markAsRead(notif._id)}
                      className="px-3 py-1 bg-primary text-white text-xs rounded hover:bg-blue-700"
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notif._id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                  >
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState icon={Bell} title="No Notifications" message="You're all caught up!" />
      )}
    </div>
  );
};

export default Notifications;
