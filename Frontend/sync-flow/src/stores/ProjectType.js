import { create } from "zustand";

export const useProjectStore = create(
 
    (set) => ({
      project: null,
      is_solo: null,

      setProject: (project) =>
        set({
          project: project,
          is_solo: project?.is_solo ?? null, 
        }),

      setIsSolo: (value) => set({ is_solo: value }),

      clearProject: () => {
        set({ project: null, is_solo: null });
        
      },
    }),
  )
