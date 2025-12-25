import { useEffect } from "react";
import { useThemeStore } from "../stores/ThemeStore";

export default function useTheme() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  // Map your custom theme background colors
  const themeBackgrounds = {
    dark: "oklch(16.827% 0.02537 276.089)",
    light: "white/5",
  };

  useEffect(() => {
    const html = document.documentElement;

    if (theme === "dark") {
      html.classList.add("dark");
    } else if (theme === "light") {
      html.classList.remove("dark");
    } else if (theme === "system") {
      // system mode
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      html.classList.toggle("dark", isDark);
    }
  }, [theme]);

  useEffect(() => {
    let appliedTheme = theme;

    if (theme === "system" && typeof window !== "undefined") {
      appliedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    document.documentElement.style.setProperty(
      "--background",
      themeBackgrounds[appliedTheme]
    );
  }, [theme]);

  // Listen to system changes if theme is system
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const systemTheme = mediaQuery.matches ? "dark" : "light";
      document.documentElement.style.setProperty(
        "--background",
        themeBackgrounds[systemTheme]
      );
    };
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return { theme, setTheme };
}
