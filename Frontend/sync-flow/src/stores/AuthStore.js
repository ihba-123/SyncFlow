import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  is_Authenticated: false,
  hasCheckedAuth: false, 
  
  
  
  setUser: (userData) =>
    set({
      user: userData,
      is_Authenticated: true,
      hasCheckedAuth: true, 
    }),

  clearUser: () =>
    set({
      user: null,
      is_Authenticated: false,
      hasCheckedAuth: true, 
    }),
      markChecked: () =>
    set({ hasCheckedAuth: true }),
}));
