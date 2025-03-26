"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { api } from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to set auth token in axios headers
  const setAuthToken = (token) => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const storedUser = localStorage.getItem("@EventMS:user");
        const storedToken = localStorage.getItem("@EventMS:token");

        if (storedUser && storedToken) {
          // Set the token in axios headers
          setAuthToken(storedToken);

          // Validate token by making a request to get current user
          try {
            // Optional: Verify token is valid by making a request
            // const response = await api.get('/auth/me')
            // setUser(response.data)

            // For now, just use the stored user
            setUser(JSON.parse(storedUser));
          } catch (error) {
            console.error("Token validation failed:", error);
            // If token validation fails, clear storage
            localStorage.removeItem("@EventMS:user");
            localStorage.removeItem("@EventMS:token");
            setAuthToken(null);
          }
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

      const { user, token } = response.data;

      // Store auth data
      localStorage.setItem("@EventMS:user", JSON.stringify(user));
      localStorage.setItem("@EventMS:token", token);

      // Set token in axios headers
      setAuthToken(token);
      setUser(user);

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
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

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
      const response = await api.put("/users/profile", userData);

      const updatedUser = response.data;
      localStorage.setItem("@EventMS:user", JSON.stringify(updatedUser));
      setUser(updatedUser);

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

export const useAuth = () => useContext(AuthContext);
