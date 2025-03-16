import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { fetchPublicGalleries, fetchEuropeanaCollectionArtworks, } from "../api/userSetApi";
import PaginationControls from "../components/PaginationControls";
import { Link } from "react-router-dom";
import stripLastWord from "../helpers/stripLastWord";
import getGalleryThumbnail from "../helpers/getGalleryThumbnail";
import fetchGalleryThumbnailUsingSearch from "../helpers/fetchGalleryThumbnail";
import { curatedGalleryIds } from "../data/createdGalleryIds";
const GalleriesPage = () => {
    const [galleries, setGalleries] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [thumbnailsUpdated, setThumbnailsUpdated] = useState(false);
    const pageSize = 44;
    const loadGalleries = async (page) => {
        setLoading(true);
        try {
            const apiResponse = await fetchPublicGalleries(page, pageSize);
            console.log(`API response for page ${page}:`, apiResponse);
            // base set of galleries from the API
            let apiGalleries = apiResponse.items || [];
            console.log(`Public galleries count on page ${page}:`, apiGalleries.length);
            // fetch curated galleries in parallel
            const curatedResults = await Promise.all(curatedGalleryIds.map((id) => fetchEuropeanaCollectionArtworks(id).catch((err) => {
                console.error("Error fetching curated gallery id:", id, err);
                return null;
            })));
            // filter out null results
            const curatedGalleries = curatedResults
                .filter((g) => g !== null)
                .map((obj, index) => {
                // obj is { artworks, totalResults }
                // Construct a minimal UserSet. For example:
                return {
                    id: "curated_" + index, // or some stable ID
                    title: { en: ["Curated from Europeana"] },
                    type: "EntityBestItemsSet", // or whatever makes sense
                    // etc. Fill in the minimum fields so the shape is valid
                };
            });
            // combine curated + API galleries, deduplicate by ID
            const combined = [...apiGalleries, ...curatedGalleries];
            console.log("Combined count before deduplication:", combined.length);
            const unique = combined.filter((gallery, index, self) => index === self.findIndex((g) => g.id === gallery.id));
            console.log("Unique galleries count after merge:", unique.length);
            apiGalleries = unique;
            setGalleries(apiGalleries);
            // calculate total pages for the public gallery portion
            const apiTotal = apiResponse.total || 0;
            console.log("API total count:", apiTotal);
            const computedTotalPages = Math.ceil(apiTotal / pageSize);
            console.log("Computed total pages:", computedTotalPages);
            setTotalPages(computedTotalPages);
            setThumbnailsUpdated(false);
        }
        catch (err) {
            console.error("Error in loadGalleries:", err);
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadGalleries(currentPage);
    }, [currentPage]);
    useEffect(() => {
        // Only update thumbnails once per new "galleries" load:
        if (galleries.length > 0 && !thumbnailsUpdated) {
            const updateThumbnails = async () => {
                const updatedGalleries = await Promise.all(galleries.map(async (gallery) => {
                    // If the gallery already has a thumbnail, no need to fetch a new one:
                    const currentThumbnail = getGalleryThumbnail(gallery);
                    if (currentThumbnail) {
                        return gallery; // keep as-is
                    }
                    // If there's no thumbnail, generate a title for search:
                    const titleForSearch = typeof gallery.title === "object"
                        ? Array.isArray(gallery.title.en)
                            ? gallery.title.en
                            : gallery.title.en
                        : gallery.title;
                    console.log("Fetching thumbnail using search for:", titleForSearch, "gallery id:", gallery.id);
                    // Handle various cases:
                    if (!titleForSearch) {
                        // fallback: no title => can't search, just return
                        return gallery;
                    }
                    else if (Array.isArray(titleForSearch)) {
                        // If it's an array of strings, pick the first
                        const safeTitle = titleForSearch[0] || "";
                        const newThumbnail = await fetchGalleryThumbnailUsingSearch(safeTitle);
                        console.log("Fetched thumbnail:", newThumbnail, "for gallery id:", gallery.id);
                        return { ...gallery, thumbnail: newThumbnail };
                    }
                    else {
                        // It's a single string
                        const newThumbnail = await fetchGalleryThumbnailUsingSearch(titleForSearch);
                        console.log("Fetched thumbnail:", newThumbnail, "for gallery id:", gallery.id);
                        return { ...gallery, thumbnail: newThumbnail };
                    }
                }));
                setGalleries(updatedGalleries);
                setThumbnailsUpdated(true);
            };
            updateThumbnails();
        }
    }, [galleries, thumbnailsUpdated]);
    return (_jsxs("div", { className: "container mx-auto p-4", children: [_jsx("h1", { className: "text-4xl font-bold mb-2", children: "Galleries" }), _jsx("p", { className: "text-lg mb-6", children: "this will be the description" }), loading && _jsx("div", { children: "Loading galleries..." }), error && _jsxs("div", { children: ["Error loading galleries: ", error] }), !loading && !error && (_jsxs(_Fragment, { children: [_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: galleries.map((gallery) => {
                            const thumbnailUrl = getGalleryThumbnail(gallery);
                            return (_jsxs(Link, { to: `/set/${encodeURIComponent(gallery.id)}`, className: "block border rounded overflow-hidden shadow hover:shadow-lg transition", children: [_jsx("div", { className: "h-40 overflow-hidden", children: thumbnailUrl ? (_jsx("img", { src: thumbnailUrl, alt: typeof gallery.title === "object"
                                                ? stripLastWord(gallery.title)
                                                : gallery.title, className: "w-full h-full object-cover" })) : (_jsx("div", { className: "w-full h-full bg-gray-300 flex items-center justify-center", children: _jsx("span", { children: "No Image" }) })) }), _jsxs("div", { className: "p-4", children: [_jsx("h3", { className: "text-xl font-semibold", children: typeof gallery.title === "object"
                                                    ? stripLastWord(gallery.title)
                                                    : gallery.title }), gallery.description && gallery.description.en && (_jsx("p", { className: "text-sm text-gray-600 mt-2", children: gallery.description.en }))] })] }, gallery.id));
                        }) }), _jsx(PaginationControls, { currentPage: currentPage, totalPages: totalPages, onPrev: () => setCurrentPage((prev) => Math.max(1, prev - 1)), onNext: () => setCurrentPage((prev) => Math.min(totalPages, prev + 1)) })] }))] }));
};
export default GalleriesPage;
