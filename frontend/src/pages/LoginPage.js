import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { TextField, Button, Typography, Card, CardContent } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await login(credentials.email, credentials.password);
            navigate("/profile");
        }
        catch (err) {
            setError(err.message || "Invalid credentials");
        }
    };
    return (_jsx("div", { className: "container mx-auto p-4 flex justify-center", children: _jsx(Card, { className: "w-full max-w-md p-4 shadow-lg", children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h5", align: "center", gutterBottom: true, children: "Login" }), error && _jsx(Typography, { color: "error", children: error }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsx(TextField, { fullWidth: true, margin: "normal", name: "email", label: "Email", type: "email", required: true, onChange: handleChange }), _jsx(TextField, { fullWidth: true, margin: "normal", name: "password", label: "Password", type: "password", required: true, onChange: handleChange }), _jsx(Button, { type: "submit", variant: "contained", color: "primary", fullWidth: true, className: "mt-3", children: "Login" })] })] }) }) }));
};
export default LoginPage;
