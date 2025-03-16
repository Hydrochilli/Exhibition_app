import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const isAuthenticated = !!user;
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token)
            fetchUser(token);
    }, []);
    const fetchUser = async (token) => {
        try {
            const res = await fetch("/api/user/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const userData = await res.json();
                setUser({ ...userData, token });
            }
            else {
                logout();
            }
        }
        catch {
            logout();
        }
    };
    const login = async (email, password) => {
        const res = await fetch("http://localhost:3001/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        if (res.ok) {
            const { token, user } = await res.json();
            localStorage.setItem("authToken", token);
            setUser({ ...user, token });
        }
        else {
            throw new Error("Invalid credentials");
        }
    };
    const register = async (userData) => {
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
        }
        catch (error) {
            console.error("🔥 Registration Error:", error.message);
            throw error;
        }
    };
    const logout = () => {
        localStorage.removeItem("authToken");
        setUser(null);
    };
    return (_jsx(AuthContext.Provider, { value: { user, login, register, logout, isAuthenticated }, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
