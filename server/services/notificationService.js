import Notification from '../models/Notification.js';
import { getBudgetStatus } from '../utils/calculations.js';

export const notificationService = {
  async createBudgetNotification(userId, budgetUsage, budgetName = 'overall') {
    const status = getBudgetStatus(budgetUsage);

    let title = '';
    let message = '';
    let type = 'info';

    if (status === 'warning') {
      title = 'Budget Warning';
      message = `You've used ${Math.round(budgetUsage)}% of your ${budgetName} budget.`;
      type = 'warning';
    } else if (status === 'critical') {
      title = 'Budget Critical';
      message = `You've used ${Math.round(budgetUsage)}% of your ${budgetName} budget.`;
      type = 'critical';
    } else if (status === 'exceeded') {
      title = 'Budget Exceeded';
      message = `You've exceeded your ${budgetName} budget by ${Math.round(budgetUsage - 100)}%.`;
      type = 'exceeded';
    }

    if (status !== 'safe') {
      return await Notification.create({
        userId,
        title,
        message,
        type,
      });
    }

    return null;
  },

  async createNotification(userId, title, message, type = 'info') {
    return await Notification.create({
      userId,
      title,
      message,
      type,
    });
  },

  async getUserNotifications(userId, limit = 50, skip = 0) {
    return await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();
  },

  async markAsRead(notificationId) {
    return await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );
  },

  async deleteNotification(notificationId) {
    return await Notification.findByIdAndDelete(notificationId);
  },

  async deleteOldNotifications(userId, daysOld = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    return await Notification.deleteMany({
      userId,
      createdAt: { $lt: cutoffDate },
    });
  },
};
