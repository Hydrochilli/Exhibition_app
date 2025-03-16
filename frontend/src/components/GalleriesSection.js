import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { fetchPublicGalleries } from "../api/userSetApi";
import { Link } from "react-router-dom";
import stripLastWord from "../helpers/stripLastWord";
import getGalleryThumbnail from "../helpers/getGalleryThumbnail";
import fetchGalleryThumbnailUsingSearch from "../helpers/fetchGalleryThumbnail";
const GalleriesSection = () => {
    const [galleries, setGalleries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [thumbnailsUpdated, setThumbnailsUpdated] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchPublicGalleries(1, 12);
                console.log("Fetched public galleries:", data);
                setGalleries(data.items || []);
            }
            catch (err) {
                setError(err.message);
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    useEffect(() => {
        if (galleries.length > 0 && !thumbnailsUpdated) {
            const updateThumbnails = async () => {
                const updatedGalleries = await Promise.all(galleries.map(async (gallery) => {
                    let currentThumbnail = getGalleryThumbnail(gallery);
                    if (!currentThumbnail) {
                        const titleForSearch = typeof gallery.title === "object"
                            ? Array.isArray(gallery.title.en)
                                ? gallery.title.en[0]
                                : gallery.title.en
                            : gallery.title;
                        currentThumbnail = await fetchGalleryThumbnailUsingSearch(titleForSearch || "");
                        return { ...gallery, thumbnail: currentThumbnail };
                    }
                    return gallery;
                }));
                setGalleries(updatedGalleries);
                setThumbnailsUpdated(true);
            };
            updateThumbnails();
        }
    }, [galleries, thumbnailsUpdated]);
    if (loading)
        return _jsx("div", { children: "Loading Galleries..." });
    if (error)
        return _jsxs("div", { children: ["Error loading Galleries: ", error] });
    return (_jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Galleries" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: galleries.map((gallery) => {
                    const thumbnailUrl = getGalleryThumbnail(gallery);
                    return (_jsxs(Link, { to: `/gallery/${encodeURIComponent(gallery.id)}`, className: "block border rounded overflow-hidden shadow hover:shadow-lg transition", children: [_jsx("div", { className: "h-40 overflow-hidden", children: thumbnailUrl ? (_jsx("img", { src: thumbnailUrl, alt: typeof gallery.title === "object" ? stripLastWord(gallery.title) : gallery.title, className: "w-full h-full object-cover" })) : (_jsx("div", { className: "w-full h-full bg-gray-300 flex items-center justify-center", children: _jsx("span", { children: "No Image" }) })) }), _jsxs("div", { className: "p-4", children: [_jsx("h3", { className: "text-xl font-semibold", children: typeof gallery.title === "object" ? stripLastWord(gallery.title) : gallery.title }), gallery.description && gallery.description.en && (_jsx("p", { className: "text-sm text-gray-600 mt-2", children: gallery.description.en[0] }))] })] }, gallery.id));
                }) })] }));
};
export default GalleriesSection;
