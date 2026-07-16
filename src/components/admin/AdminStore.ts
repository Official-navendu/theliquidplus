import { create } from 'zustand';

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

interface AdminState {
  // Sidebar State
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Notification State
  notifications: AdminNotification[];
  addNotification: (title: string, message: string) => void;
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;

  // Global Search State
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Theme State
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  // Sidebar
  isSidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

  // Notifications
  notifications: [
    {
      id: 'notif-1',
      title: 'Low Stock Alert',
      message: 'Ultimate Ceramic Coating 9H (500ml) is below threshold (5 left).',
      isRead: false,
      createdAt: new Date(),
    },
    {
      id: 'notif-2',
      title: 'New High Value Order',
      message: 'Karan Dev placed a new order valued at $9,320.',
      isRead: false,
      createdAt: new Date(Date.now() - 3600000),
    },
  ],
  addNotification: (title, message) =>
    set((state) => ({
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title,
          message,
          isRead: false,
          createdAt: new Date(),
        },
        ...state.notifications,
      ],
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    })),

  // Search
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Theme
  theme: 'dark',
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') {
        const root = window.document.documentElement;
        root.classList.remove('dark', 'light');
        root.classList.add(nextTheme);
      }
      return { theme: nextTheme };
    }),
}));
