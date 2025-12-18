// src/stores/AuthStore.js
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  is_Authenticated: false,
  hasCheckedAuth: false, // ← Starts false

  setUser: (userData) =>
    set({
      user: userData,
      is_Authenticated: true,
      hasCheckedAuth: true, // ← This MUST be set to true here
    }),

  clearUser: () =>
    set({
      user: null,
      is_Authenticated: false,
      hasCheckedAuth: true, // ← And here on logout/error
    }),
}));