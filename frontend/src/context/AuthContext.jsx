"use client";

import { createContext, useState, useEffect } from "react";
import { api } from "../services/api";
import toast from "react-hot-toast";
import { profileService } from "../services/api";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setAuthToken = (token) => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  };

  const fetchUserProfile = async () => {
    try {
      const data = await profileService.getProfile();
      localStorage.setItem("@EventMS:user", JSON.stringify(data));
      setUser(data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const storedToken = localStorage.getItem("@EventMS:token");

        if (storedToken) {
          setAuthToken(storedToken);
          await fetchUserProfile();
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post("/auth/login", { email, password });

      const { token } = response.data;
      localStorage.setItem("@EventMS:token", token);
      setAuthToken(token);

      await fetchUserProfile();

      toast.success("Login successful!");
      return true;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to login");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      await api.post("/auth/register", { name, email, password });

      toast.success("Registration successful! Please login.");
      return true;
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed to register");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("@EventMS:user");
    localStorage.removeItem("@EventMS:token");
    setAuthToken(null);
    setUser(null);
    toast.success("Logged out successfully");
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const response = await profileService.updateProfile(userData);

      localStorage.setItem("@EventMS:user", JSON.stringify(response));
      setUser(response);

      toast.success("Profile updated successfully!");
      return true;
    } catch (error) {
      console.error(
        "Profile update error:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed to update profile");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = () => {
    return user && (user.role === "admin" || user.isAdmin === true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAdmin,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
