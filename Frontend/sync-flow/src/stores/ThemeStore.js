import { create } from "zustand";
import { persist } from "zustand/middleware";

const systemTheme = () => {
    if( typeof window !== "undefined"){
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light"; //fallback 
}

export const useThemeStore = create(
    persist(
        (set) => ({
            theme: systemTheme(),
            setTheme: (theme) => set({ theme }),
            toggleTheme: () => set((state) => ({ theme: state.theme === "light" ? "dark" : "light" }))
        }),
        {
            name: "theme-storage"
        }

    )
)
