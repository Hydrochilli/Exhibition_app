import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ArtworkDetail.tsx
import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { fetchSingleArtwork as fetchMetDetail } from "../api/metApi";
import { fetchSingleClevelandArtwork } from "../api/clevelandApi";
const ArtworkDetail = () => {
    const { artworkId } = useParams();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [artwork, setArtwork] = useState(null);
    useEffect(() => {
        if (!artworkId)
            return;
        (async () => {
            try {
                setLoading(true);
                const source = location.state?.source || "Met";
                let data = null;
                if (source === "Cleveland") {
                    data = await fetchSingleClevelandArtwork(artworkId);
                }
                else {
                    // default to MET
                    data = await fetchMetDetail(artworkId);
                }
                setArtwork(data);
                console.log("DEBUG: final setArtwork =>", data);
            }
            catch (err) {
                console.error("Error fetching detail:", err);
                setError("Failed to load artwork detail.");
            }
            finally {
                setLoading(false);
            }
        })();
    }, [artworkId, location.state?.source]);
    if (loading)
        return _jsx("div", { children: "Loading artwork detail..." });
    if (error)
        return _jsx("div", { className: "text-red-500", children: error });
    if (!artwork)
        return _jsx("div", { children: "No detail available." });
    return (_jsxs("div", { className: "container mx-auto p-4", children: [_jsx("h2", { className: "text-2xl font-semibold mb-4", children: artwork.title }), _jsxs("div", { className: "flex flex-col md:flex-row gap-6", children: [_jsx("div", { className: "flex-1", children: artwork.imageUrl ? (_jsx("img", { src: artwork.imageUrl, alt: artwork.title, className: "max-w-full h-auto object-contain border" })) : (_jsx("div", { className: "bg-gray-200 p-4 text-center", children: "No Image Available" })) }), _jsxs("div", { className: "flex-1", children: [_jsxs("p", { children: [_jsx("strong", { children: "Author:" }), " ", artwork.author || "Unknown"] }), _jsxs("p", { children: [_jsx("strong", { children: "Date:" }), " ", artwork.date || "Unknown"] }), _jsxs("p", { className: "mt-4 text-sm text-gray-700", children: [_jsx("strong", { children: "Source:" }), " ", artwork.source] }), _jsxs("p", { className: "mt-4 text-gray-700", children: [_jsx("strong", { children: "Description:" }), " ", artwork.description] })] })] })] }));
};
export default ArtworkDetail;
