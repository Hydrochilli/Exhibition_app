import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Avatar, List, ListItem, Button } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
const UserProfile = () => {
    const { user } = useAuth();
    const [galleries, setGalleries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    // If user is null, short-circuit the component UI:
    if (!user) {
        return _jsx("div", { children: "Please log in to view your profile." });
    }
    useEffect(() => {
        // Bail out if user is null (it won’t be if we’re here, but TS needs explicit check)
        async function fetchGalleries() {
            if (!user)
                return;
            try {
                console.log(`Fetching galleries for user ID: ${user.id}`);
                const response = await fetch(`https://exhibition-app.onrender.com/api/galleries/user/${user.id}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Fetch error:", errorText);
                    throw new Error(`Failed to fetch galleries: ${errorText}`);
                }
                const data = await response.json();
                console.log("Galleries received:", data);
                setGalleries(data);
            }
            catch (err) {
                console.error("Error fetching galleries:", err);
                setError(err.message || "Could not load collections.");
            }
            finally {
                setLoading(false);
            }
        }
        fetchGalleries();
    }, [user]);
    return (_jsxs("div", { className: "container mx-auto p-4 grid gap-6", children: [_jsx(Card, { className: "p-4 shadow-lg", children: _jsxs(CardContent, { className: "text-center", children: [_jsx(Avatar, { src: user.avatarUrl, alt: user.username, sx: { width: 80, height: 80, margin: "auto" } }), _jsx(Typography, { variant: "h5", className: "mt-2", children: user.name || user.username }), _jsx(Typography, { variant: "body1", children: user.email }), _jsx(Button, { component: Link, to: "/edit-profile", variant: "contained", color: "primary", className: "mt-3", children: "Edit Profile" })] }) }), _jsx(Card, { className: "p-4 shadow-lg", children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", children: "My Collections" }), loading ? (_jsx(Typography, { color: "textSecondary", children: "Loading galleries..." })) : error ? (_jsx(Typography, { color: "error", children: error })) : galleries.length > 0 ? (_jsx(List, { children: galleries.map((gallery) => (_jsx(ListItem, { component: Link, to: `/gallery/${gallery.id}`, className: "hover:bg-gray-100 cursor-pointer", children: _jsx(Typography, { children: gallery.title }) }, gallery.id))) })) : (_jsxs(Typography, { children: ["No collections yet. ", _jsx(Link, { to: "/", children: "Start curating!" })] }))] }) })] }));
};
export default UserProfile;
