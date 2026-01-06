import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useProjectStore = create(
  persist(
    (set) => ({
      project: null,
      is_solo: null,

      setProject: (project) =>
        set({
          project,
          is_solo: project.is_solo,
        }),

      setIsSolo: (value) =>
        set({
          is_solo: value,
        }),

      clearProject: () =>
        set({
          project: null,
          is_solo: null,
        }),
    }),
    {
      name: "project-active-storage", // Unique name for the key in localStorage
      storage: createJSONStorage(() => localStorage), // Tells Zustand to use browser localStorage
    }
  )
);