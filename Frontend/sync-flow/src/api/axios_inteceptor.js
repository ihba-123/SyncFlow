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
    const originalRequest = error.config || {};
    const requestUrl = originalRequest.url || "";
    const isAuthEndpoint =
      requestUrl.includes("login/") ||
      requestUrl.includes("register/") ||
      requestUrl.includes("logout/") ||
      requestUrl.includes("profile/") ||
      requestUrl.includes("chat-profile/") ||
      requestUrl.includes("refresh-token/");

    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isAuthEndpoint) {
        useAuthStore.getState().clearUser();
        return Promise.reject(error);
      }
      
     
      // If already refreshing, queue the request
      if (isRefreshing) {
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
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        useAuthStore.getState().clearUser();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 401 && originalRequest._retry) {
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
