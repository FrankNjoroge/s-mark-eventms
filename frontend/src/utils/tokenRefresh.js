import { api } from "../services/api";

// Token refresh mechanism
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export const setupTokenRefresh = () => {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If error is 401 and not already retrying
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // If already refreshing, add to queue
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Try to refresh the token
          const refreshToken = localStorage.getItem("@EventMS:refreshToken");

          if (!refreshToken) {
            throw new Error("No refresh token available");
          }

          const response = await api.post("/auth/refresh-token", {
            refreshToken,
          });
          const { token } = response.data;

          // Update stored token
          localStorage.setItem("@EventMS:token", token);
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Process queue with new token
          processQueue(null, token);

          // Retry original request
          return api(originalRequest);
        } catch (refreshError) {
          // If refresh fails, process queue with error
          processQueue(refreshError, null);

          // Clear auth data
          localStorage.removeItem("@EventMS:user");
          localStorage.removeItem("@EventMS:token");
          localStorage.removeItem("@EventMS:refreshToken");

          // Redirect to login
          window.location.href = "/login";
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};
