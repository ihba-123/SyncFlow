import { create } from "zustand";

export const useProjectRoleStore = create((set) => ({
  role: null,
  roleProjectId: null,
  isAdmin: false,

  setRole: (role, projectId) =>
    set({
      role,
      roleProjectId: projectId,
      isAdmin: role === "Admin",
    }),

  clearRole: () =>
    set({
      role: null,
      roleProjectId: null,
      isAdmin: false,
    }),
}));