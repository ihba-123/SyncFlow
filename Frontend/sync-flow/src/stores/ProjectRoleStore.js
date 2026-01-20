import { create } from "zustand";

export const useProjectRoleStore = create((set) => ({
  role: null,       
  isAdmin: false,

  setRole: (role) =>
    set({
      role,
      isAdmin: role === "Admin",
    }),

  clearRole: () =>
    set({
      role: null,
      isAdmin: false,
    }),
}));
