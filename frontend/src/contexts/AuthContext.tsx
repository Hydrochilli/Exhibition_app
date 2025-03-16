import React, { createContext, useContext, useState, useEffect } from "react";

type User = {
  id: string;
  username: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  city?: string;
  token: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

type RegisterData = {
  username: string;
  email: string;
  password: string;
  name?: string;
  avatarUrl?: string;
  city?: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) fetchUser(token);
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const res = await fetch("/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const userData = await res.json();
        setUser({ ...userData, token });
      } else {
        logout();
      }
    } catch {
      logout();
    }
  };

  const login = async (email: string, password: string) => {
    const res = await fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const { token, user } = await res.json();
      localStorage.setItem("authToken", token);
      setUser({ ...user, token });
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      console.log("📩 Sending Registration Data:", userData);
      const res = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
  
      const responseData = await res.json();
      console.log("📩 Received Response from Backend:", responseData);
  
      if (!res.ok) {
        throw new Error(responseData.message || "Registration failed");
      }
  
      localStorage.setItem("authToken", responseData.token);
      setUser({ ...responseData.user, token: responseData.token });
    } catch (error: any) {
      console.error("🔥 Registration Error:", error.message);
      throw error;
    }
  };
  
  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };



  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
