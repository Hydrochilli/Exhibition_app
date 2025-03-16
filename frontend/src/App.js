import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
const App = () => {
    const { isAuthenticated } = useAuth();
    return (_jsxs("div", { className: "font-sans min-h-screen", children: [_jsx(Header, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/artwork/:artworkId", element: _jsx(ArtworkDetail, {}) }), _jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/profile", element: _jsx(UserProfile, {}) }), _jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/register", element: _jsx(RegisterPage, {}) }), _jsx(Route, { path: "/temporary-collection", element: _jsx(TemporaryCollection, {}) }), _jsx(Route, { path: "/my-galleries", element: isAuthenticated ? _jsx(MyGalleriesPage, {}) : _jsx(Navigate, { to: "/login" }) })] })] }));
};
export default App;
