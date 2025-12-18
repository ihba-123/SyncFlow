import axios from "axios";
import { useAuthStore } from "../stores/AuthStore";

const api = axios.create({
  baseURL: "http://localhost:8000/api/",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve();
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Prevent infinite loop on refresh endpoint itself
      if (originalRequest.url?.includes("refresh-token")) {
        useAuthStore.getState().clearUser();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue requests while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post("refresh-token/");
        isRefreshing = false;
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError);
        useAuthStore.getState().clearUser(); // Trigger logout
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;