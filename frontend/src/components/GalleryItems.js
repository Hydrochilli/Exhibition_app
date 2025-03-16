import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchEuropeanaCollectionArtworks } from "../api/europeanaApi";
import PaginationControls from "./PaginationControls";
const ITEMS_PER_PAGE = 48;
const GalleryItems = () => {
    const { galleryId } = useParams();
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    useEffect(() => {
        if (!galleryId)
            return;
        const fetchArtworks = async () => {
            try {
                setLoading(true);
                const data = await fetchEuropeanaCollectionArtworks(galleryId, currentPage, ITEMS_PER_PAGE);
                setArtworks(data.artworks);
                setTotalPages(Math.ceil(data.totalResults / ITEMS_PER_PAGE));
            }
            catch (err) {
                setError("Failed to load artworks.");
                console.error("Error fetching gallery items:", err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchArtworks();
    }, [galleryId, currentPage]);
    if (loading)
        return _jsx("p", { children: "Loading artworks..." });
    if (error)
        return _jsx("p", { className: "text-red-500", children: error });
    return (_jsxs("div", { className: "container mx-auto p-4", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Gallery Items" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4", children: artworks.map((art) => (_jsxs("div", { className: "border p-2", children: [art.imageUrl ? (_jsx("img", { src: art.imageUrl, alt: art.title, className: "mb-2 w-full h-48 object-cover" })) : (_jsx("div", { className: "w-full h-48 bg-gray-200 flex items-center justify-center", children: "No Image" })), _jsx("h3", { className: "font-semibold", children: art.title }), _jsx("p", { children: art.author }), _jsx("p", { className: "text-sm text-gray-500", children: art.date || "Unknown Date" })] }, art.id))) }), totalPages > 1 && (_jsx(PaginationControls, { currentPage: currentPage, totalPages: totalPages, onPrev: () => setCurrentPage(prev => Math.max(1, prev - 1)), onNext: () => setCurrentPage(prev => Math.min(totalPages, prev + 1)) }))] }));
};
export default GalleryItems;
