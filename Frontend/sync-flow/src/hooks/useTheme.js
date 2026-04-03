import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useThemeStore } from "../stores/ThemeStore";

export default function useTheme() {
  const theme = useThemeStore((state) => state.theme);
  const hydrated = useThemeStore((state) => state.hydrated);
  const setTheme = useThemeStore((state) => state.setTheme);
  const switchTimerRef = useRef(null);

  // Map your custom theme background colors
  const themeBackgrounds = {
    dark: "oklch(16.827% 0.02537 276.089)",
    light: "white/5",
  };

  useLayoutEffect(() => {
    if (!hydrated) return;
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
  }, [theme, hydrated]);

  const setThemeSmooth = useCallback(
    (nextTheme) => {
      if (typeof window === "undefined") {
        setTheme(nextTheme);
        return;
      }

      const html = document.documentElement;
      html.classList.add("theme-switching");

      if (switchTimerRef.current) {
        window.clearTimeout(switchTimerRef.current);
      }

      setTheme(nextTheme);

      switchTimerRef.current = window.setTimeout(() => {
        html.classList.remove("theme-switching");
        switchTimerRef.current = null;
      }, 180);
    },
    [setTheme]
  );

  useEffect(() => {
    if (!hydrated) return;
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
  }, [theme, hydrated]);

  // Listen to system changes if theme is system
  useEffect(() => {
    if (!hydrated || theme !== "system") return;

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
  }, [theme, hydrated]);

  return { theme, setTheme: setThemeSmooth, hydrated };
}
