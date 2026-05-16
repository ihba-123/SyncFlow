import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Apply persisted theme before first paint to avoid light/dark flicker.
const storedTheme = typeof window !== "undefined" ? window.localStorage.getItem("theme-storage") : null;
if (storedTheme) {
  try {
    const parsed = JSON.parse(storedTheme);
    const theme = parsed?.state?.theme;
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
    }
  } catch {
    // Ignore malformed storage values and use default behavior.
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")).render(
    <QueryClientProvider client={queryClient}>
      {googleClientId ? (
        <GoogleOAuthProvider clientId={googleClientId}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </GoogleOAuthProvider>
      ) : (
        <BrowserRouter>
          <App />
        </BrowserRouter>
      )}
    </QueryClientProvider>
);
