import { create } from "zustand";

export const useActiveProjectStore  = create((set) => {
    return {
        active_project: null,
        setActiveProject: (project) => set({ active_project: project }),
    };
})