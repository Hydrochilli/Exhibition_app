import React, { useState } from "react";
import { TextField, Button, Typography, Card, CardContent } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const RegisterPage: React.FC = () => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await register(formData);
      navigate("/profile"); // Redirect to profile page
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="container mx-auto p-4 flex justify-center">
      <Card className="w-full max-w-md p-4 shadow-lg">
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>Register</Typography>
          {error && <Typography color="error">{error}</Typography>}

          <form onSubmit={handleSubmit}>
            <TextField fullWidth margin="normal" name="username" label="Username" required onChange={handleChange} />
            <TextField fullWidth margin="normal" name="email" label="Email" type="email" required onChange={handleChange} />
            <TextField fullWidth margin="normal" name="password" label="Password" type="password" required onChange={handleChange} />
            <TextField fullWidth margin="normal" name="name" label="Full Name" onChange={handleChange} />
            <TextField fullWidth margin="normal" name="avatarUrl" label="Avatar URL" onChange={handleChange} />
            <TextField fullWidth margin="normal" name="city" label="City/Town" onChange={handleChange} />

            <Button type="submit" variant="contained" color="primary" fullWidth className="mt-3">Register</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
