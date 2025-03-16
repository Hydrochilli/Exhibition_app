import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { TextField, Button, Typography, Card, CardContent } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
const RegisterPage = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        name: "",
        avatarUrl: "",
        city: "",
    });
    const [error, setError] = useState("");
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await register(formData);
            navigate("/profile"); // Redirect to profile page
        }
        catch (err) {
            setError(err.message || "Registration failed");
        }
    };
    return (_jsx("div", { className: "container mx-auto p-4 flex justify-center", children: _jsx(Card, { className: "w-full max-w-md p-4 shadow-lg", children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h5", align: "center", gutterBottom: true, children: "Register" }), error && _jsx(Typography, { color: "error", children: error }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsx(TextField, { fullWidth: true, margin: "normal", name: "username", label: "Username", required: true, onChange: handleChange }), _jsx(TextField, { fullWidth: true, margin: "normal", name: "email", label: "Email", type: "email", required: true, onChange: handleChange }), _jsx(TextField, { fullWidth: true, margin: "normal", name: "password", label: "Password", type: "password", required: true, onChange: handleChange }), _jsx(TextField, { fullWidth: true, margin: "normal", name: "name", label: "Full Name", onChange: handleChange }), _jsx(TextField, { fullWidth: true, margin: "normal", name: "avatarUrl", label: "Avatar URL", onChange: handleChange }), _jsx(TextField, { fullWidth: true, margin: "normal", name: "city", label: "City/Town", onChange: handleChange }), _jsx(Button, { type: "submit", variant: "contained", color: "primary", fullWidth: true, className: "mt-3", children: "Register" })] })] }) }) }));
};
export default RegisterPage;
