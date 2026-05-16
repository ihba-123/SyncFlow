const ACCESS_TOKEN_KEY = "access_token";

const readCookieValue = (name) => {
  if (typeof document === "undefined") return null;

  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : null;
};

export const setAccessToken = (token) => {
  if (typeof window === "undefined" || !token) return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const getAccessToken = () => {
  if (typeof window !== "undefined") {
    const storedToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
    if (storedToken) return storedToken;
  }

  return readCookieValue(ACCESS_TOKEN_KEY);
};

export const clearAccessToken = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
};
