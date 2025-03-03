import React, { createContext, useContext, useState, useEffect } from "react";

// Define the User type
type User = {
  id: string;
  username: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  nearestCity?: string;
  token: string;
};

// Define the authentication context type
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
};

// Define the registration data type
type RegisterData = {
  username: string;
  email: string;
  password: string;
  name?: string;
  avatarUrl?: string;
  nearestCity?: string;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      fetchUser(token);
    }
  }, []);

  // Fetch user profile when authenticated
  const fetchUser = async (token: string) => {
    try {
      const res = await fetch("http://localhost:3001/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const userData = await res.json();
        setUser({ ...userData, token });
        saveUserToLocalStorage(userData, token);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      logout();
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      const { token, user } = await res.json();
      saveUserToLocalStorage(user, token);
      setUser({ ...user, token });
    } catch (error: any) {
      console.error("Login error:", error.message);
      throw error;
    }
  };

  // Register function
  const register = async (userData: RegisterData) => {
    try {
      const res = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Registration failed");
      }

      // Automatically login after registration
      await login(userData.email, userData.password);
    } catch (error: any) {
      console.error("Registration error:", error.message);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Helper function to store user data in localStorage
  const saveUserToLocalStorage = (user: User, token: string) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using authentication
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
