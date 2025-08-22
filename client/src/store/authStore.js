import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

const useAuthStore = create((set, get) => ({
  token: localStorage.getItem("token") || null,
  user: localStorage.getItem("token")
    ? jwtDecode(localStorage.getItem("token"))
    : null,

  login: (token) => {
    localStorage.setItem("token", token);
    const user = jwtDecode(token);
    set({ token, user });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null });
  },

  isAuthenticated: () => {
    const token = get().token;
    if (!token) return false;
    try {
      const { exp } = jwtDecode(token);
      // Check if token is expired
      if (Date.now() >= exp * 1000) {
        get().logout();
        return false;
      }
    } catch (e) {
      // If token is malformed
      get().logout();
      return false;
    }
    return true;
  },
}));

export default useAuthStore;
