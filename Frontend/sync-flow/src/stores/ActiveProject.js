import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useActiveProjectStore = create(
  persist(
    (set) => ({
      activeProject: null,
      showCreateProjectPopup: false,

      setFromProjectStatus: (data) => {
        const project = data?.active_project;
        set({
          // Ensure we store the is_solo property explicitly
          activeProject: project ? { ...project, is_solo: !!project.is_solo } : null,
          showCreateProjectPopup: data?.show_create_project_popup || false,
        });
      },

      setActiveProject: (project) =>
        set({
          activeProject: project,
          showCreateProjectPopup: false,
        }),

      reset: () => set({ activeProject: null, showCreateProjectPopup: false }),
    }),
    {
      name: "active-project-storage",
      storage: createJSONStorage(() => localStorage),
      // This ensures that when the page reloads, the data is ready
      onRehydrateStorage: () => (state) => {
      },
    }
  )
);