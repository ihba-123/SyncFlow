import { create } from "zustand";

export const useActiveProjectStore = create((set) => ({
  activeProject: null, // stores active_project object
  showCreateProjectPopup: false,

  
  setFromProjectStatus: (data) =>
    set({
      activeProject: data?.active_project || null,
      showCreateProjectPopup: data?.show_create_project_popup || false,
    }),

 
  setActiveProject: (project) =>
    set({
      activeProject: project,
      showCreateProjectPopup: false,
    }),

  // Reset everything
  reset: () =>
    set({
      activeProject: null,
      showCreateProjectPopup: false,
    }),
}));
