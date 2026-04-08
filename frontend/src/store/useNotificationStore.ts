import { create } from 'zustand';
import { getNotifications, markAsRead } from '../services/notificationService';

interface Notification {
  _id: string;
  title: string;
  body: string;
  type: 'JOB' | 'SYSTEM' | 'PAYMENT';
  isRead: boolean;
  createdAt: string;
  data?: any;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const response = await getNotifications();
      const notifications = response.data;
      const unreadCount = notifications.filter((n: Notification) => !n.isRead).length;
      set({ notifications, unreadCount, loading: false });
    } catch (error) {
      console.error('Fetch Notifications Error:', error);
      set({ loading: false });
    }
  },

  markRead: async (id) => {
    try {
      await markAsRead(id);
      const notifications = get().notifications.map((n) =>
        n._id === id ? { ...n, isRead: true } : n
      );
      const unreadCount = notifications.filter((n) => !n.isRead).length;
      set({ notifications, unreadCount });
    } catch (error) {
      console.error('Mark Read Error:', error);
    }
  },
}));
