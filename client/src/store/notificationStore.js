import { create } from "zustand";

const useNotificationStore = create((set) => ({
  notifications: [],
  addNotification: (message, variant = "success") => {
    const id = Date.now();
    set((state) => ({
      notifications: [...state.notifications, { id, message, variant }],
    }));
  },
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
}));

export default useNotificationStore;
