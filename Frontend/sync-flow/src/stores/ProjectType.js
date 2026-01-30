import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useProjectStore = create(
  persist(
    (set) => ({
      project: null,
      is_solo: null,

      setProject: (project) =>
        set({
          project: project,
          // Add optional chaining ?. here to prevent crashes
          is_solo: project?.is_solo ?? null, 
        }),

      setIsSolo: (value) => set({ is_solo: value }),

      clearProject: () => {
        set({ project: null, is_solo: null });
        // Manually clear the storage key to be 100% sure
        localStorage.removeItem("project-active-storage");
      },
    }),
    {
      name: "project-active-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);