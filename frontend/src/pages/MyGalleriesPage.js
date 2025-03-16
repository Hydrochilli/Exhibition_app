import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/MyGalleriesPage.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
export default function MyGalleriesPage() {
    const { user } = useAuth();
    const [galleries, setGalleries] = useState([]);
    const [newGalleryName, setNewGalleryName] = useState("");
    const [error, setError] = useState("");
    useEffect(() => {
        async function loadGalleries() {
            if (!user?.token)
                return;
            try {
                const res = await fetch("/api/galleries", {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                const data = await res.json();
                if (!res.ok)
                    throw new Error(data.message || "Failed to load galleries");
                setGalleries(data.galleries || []);
            }
            catch (err) {
                setError(err.message);
            }
        }
        loadGalleries();
    }, [user]);
    async function handleCreateGallery() {
        if (!user?.token || !newGalleryName.trim())
            return;
        try {
            const res = await fetch("/api/galleries", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: newGalleryName }),
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.message || "Failed to create gallery");
            setGalleries([...galleries, data.gallery]);
            setNewGalleryName("");
        }
        catch (err) {
            setError(err.message);
        }
    }
    return (_jsxs("div", { className: "max-w-3xl mx-auto mt-6 p-4", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "My Galleries" }), error && _jsx("p", { className: "text-red-500 mb-4", children: error }), _jsxs("div", { className: "flex gap-2 mb-4", children: [_jsx("input", { type: "text", className: "border p-2 flex-1", value: newGalleryName, onChange: (e) => setNewGalleryName(e.target.value), placeholder: "New Gallery Name" }), _jsx("button", { onClick: handleCreateGallery, className: "bg-green-700 text-white px-4 py-2 rounded", children: "Create" })] }), galleries.map((gal) => (_jsxs("div", { className: "border rounded p-3 mb-4", children: [_jsx("h3", { className: "text-xl font-semibold mb-2", children: gal.name }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4", children: gal.artworks.map((art) => (_jsxs("div", { className: "border p-2", children: [_jsx("p", { className: "font-semibold", children: art.title }), _jsx("p", { children: art.author }), _jsx("p", { className: "text-sm text-gray-500", children: art.date })] }, art.id))) })] }, gal.id)))] }));
}
