import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to ensure token is always included
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("@EventMS:token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and not a retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("Token expired or invalid, redirecting to login");

      // Clear auth data
      localStorage.removeItem("@EventMS:user");
      localStorage.removeItem("@EventMS:token");

      // Redirect to login page
      window.location.href = "/login";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export const eventService = {
  getEvents: async () => {
    try {
      const response = await api.get("/events");
      return response.data;
    } catch (error) {
      console.error("Error in getEvents:", error);
      throw error;
    }
  },

  getEvent: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  createEvent: async (eventData) => {
    const response = await api.post("/events", eventData);
    return response.data;
  },

  updateEvent: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  registerForEvent: async (eventId, bookingData = {}) => {
    const response = await api.post(`/events/${eventId}/register`, bookingData);
    return response.data;
  },

  cancelRegistration: async (eventId) => {
    const response = await api.delete(`/events/my-registrations/${eventId}`);
    return response.data;
  },

  getRegisteredEvents: async () => {
    const response = await api.get("/events/my-registrations");
    return response.data;
  },
};

export const userService = {
  getProfile: async () => {
    const response = await api.get("/users/profile");
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put("/users/profile", userData);
    return response.data;
  },

  getAnalytics: async (params = {}) => {
    const response = await api.get("/analytics", { params });
    return response.data;
  },
};

export const vendorService = {
  getVendors: async () => {
    const response = await api.get("/vendors");
    return response.data;
  },

  getVendor: async (id) => {
    const response = await api.get(`/vendors/${id}`);
    return response.data;
  },

  createVendor: async (vendorData) => {
    const response = await api.post("/vendors", vendorData);
    return response.data;
  },

  updateVendor: async (id, vendorData) => {
    const response = await api.put(`/vendors/${id}`, vendorData);
    return response.data;
  },

  deleteVendor: async (id) => {
    const response = await api.delete(`/vendors/${id}`);
    return response.data;
  },
};

export const notificationService = {
  // Admin functions
  getNotifications: async () => {
    const response = await api.get("/notifications");
    return response.data;
  },

  getNotification: async (id) => {
    const response = await api.get(`/notifications/${id}`);
    return response.data;
  },

  createNotification: async (notificationData) => {
    const response = await api.post("/notifications", notificationData);
    return response.data;
  },

  updateNotification: async (id, notificationData) => {
    const response = await api.put(`/notifications/${id}`, notificationData);
    return response.data;
  },

  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },

  // This should be updated based on your backend implementation
  sendNotification: async (id) => {
    const response = await api.put(`/notifications/${id}`, { status: "sent" });
    return response.data;
  },

  // User functions
  getUserNotifications: async () => {
    const response = await api.get("/notifications/user");
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get("/notifications/unread-count");
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put("/notifications/read-all");
    return response.data;
  },
};

export const analyticsService = {
  getAnalytics: async (timeRange = "month") => {
    try {
      const response = await api.get("/analytics", { params: { timeRange } });
      return response.data;
    } catch (error) {
      console.error("Error fetching analytics:", error);
      throw error;
    }
  },
};
export const profileService = {
  getProfile: async () => {
    const response = await api.get("/profile");
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put("/profile", profileData);
    return response.data;
  },
};
// New payment service
export const paymentService = {
  // Process a payment for an event booking
  processPayment: async (paymentData) => {
    const response = await api.post("/payments/process", paymentData);
    return response.data;
  },

  // Get payment methods for the current user
  getPaymentMethods: async () => {
    const response = await api.get("/payments/methods");
    return response.data;
  },

  // Add a new payment method
  addPaymentMethod: async (methodData) => {
    const response = await api.post("/payments/methods", methodData);
    return response.data;
  },

  // Delete a payment method
  deletePaymentMethod: async (methodId) => {
    const response = await api.delete(`/payments/methods/${methodId}`);
    return response.data;
  },

  // Get payment history for the current user
  getPaymentHistory: async () => {
    const response = await api.get("/payments/history");
    return response.data;
  },

  // Get a specific payment receipt
  getPaymentReceipt: async (paymentId) => {
    const response = await api.get(`/payments/${paymentId}/receipt`);
    return response.data;
  },

  // Verify a payment status
  verifyPayment: async (paymentId) => {
    const response = await api.get(`/payments/${paymentId}/verify`);
    return response.data;
  },
};
