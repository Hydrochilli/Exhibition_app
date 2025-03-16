
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyGalleriesPage from "./pages/MyGalleriesPage";
import Header from "./components/Header";
import "./index.css"; 
import UserProfile from "./pages/UserProfile";
import TemporaryCollection from "./pages/TemporaryCollection";
import { useAuth } from "./contexts/AuthContext";
import ArtworkDetail from "./components/ArtworkDetail";
import SearchResults from "./components/SearchResults"; // etc.

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="font-sans min-h-screen">
      <Header />
      <Routes>
        <Route path="/artwork/:artworkId" element={<ArtworkDetail />} />
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/temporary-collection" element={<TemporaryCollection />} />
        <Route
          path="/my-galleries"
          element={
            isAuthenticated ? <MyGalleriesPage /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </div>
  );
};

export default App;



