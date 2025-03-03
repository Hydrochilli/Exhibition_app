import React, { useState } from "react";
import { TextField, Button, Typography, Card, CardContent } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(credentials.email, credentials.password);
      navigate("/profile");
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    }
  };

  return (
    <div className="container mx-auto p-4 flex justify-center">
      <Card className="w-full max-w-md p-4 shadow-lg">
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>Login</Typography>
          {error && <Typography color="error">{error}</Typography>}

          <form onSubmit={handleSubmit}>
            <TextField fullWidth margin="normal" name="email" label="Email" type="email" required onChange={handleChange} />
            <TextField fullWidth margin="normal" name="password" label="Password" type="password" required onChange={handleChange} />

            <Button type="submit" variant="contained" color="primary" fullWidth className="mt-3">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
