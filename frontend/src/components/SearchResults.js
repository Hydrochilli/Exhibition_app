import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { fetchUnifiedSearch } from "../api/unifySearch";
import PaginationControls from "./PaginationControls";
import ArtworkCard from "./ArtworkCard";
const ITEMS_PER_PAGE = 48;
const SearchResults = ({ searchTerm, century = "", department = "", selectedApi = "All", }) => {
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortOption, setSortOption] = useState("title-asc");
    useEffect(() => {
        if (!searchTerm)
            return;
        setLoading(true);
        setCurrentPage(1);
        fetchUnifiedSearch(searchTerm, century, department, selectedApi)
            .then((results) => {
            setArtworks(results);
            setTotalPages(Math.ceil(results.length / ITEMS_PER_PAGE));
        })
            .catch((err) => {
            console.error("Search error:", err);
            setError(err.message || "An error occurred while fetching search results.");
        })
            .finally(() => setLoading(false));
    }, [searchTerm, century, department, selectedApi]);
    if (!searchTerm)
        return _jsx("div", { children: "Please enter a search term." });
    if (error)
        return _jsxs("div", { className: "text-red-500", children: ["Error: ", error] });
    // Sorting
    function parseDate(dateStr) {
        if (!dateStr || dateStr.toLowerCase() === "unknown")
            return Infinity;
        const bcMatch = dateStr.match(/(\d+)\s*BC/i);
        if (bcMatch)
            return -parseInt(bcMatch[1], 10);
        const adMatch = dateStr.match(/\b(\d{3,4})\b/);
        if (adMatch)
            return parseInt(adMatch[1], 10);
        return Infinity;
    }
    const sortedArtworks = [...artworks].sort((a, b) => {
        switch (sortOption) {
            case "title-asc":
                return a.title.localeCompare(b.title);
            case "title-desc":
                return b.title.localeCompare(a.title);
            case "date-asc":
                return parseDate(a.date) - parseDate(b.date);
            case "date-desc":
                return parseDate(b.date) - parseDate(a.date);
            case "source-asc":
                return a.source.localeCompare(b.source);
            case "source-desc":
                return b.source.localeCompare(a.source);
            default:
                return 0;
        }
    });
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedResults = sortedArtworks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    return (_jsxs("div", { className: "container mx-auto p-4", children: [_jsxs("h2", { className: "text-xl font-semibold mt-6", children: ["Results for \"", searchTerm, "\""] }), _jsx("div", { className: "flex flex-col md:flex-row gap-4 justify-center my-4", children: _jsxs("div", { children: [_jsx("label", { className: "block mb-1 font-semibold", children: "Sort By" }), _jsxs("select", { value: sortOption, onChange: (e) => setSortOption(e.target.value), className: "border rounded p-1", children: [_jsx("option", { value: "title-asc", children: "Title (A-Z)" }), _jsx("option", { value: "title-desc", children: "Title (Z-A)" }), _jsx("option", { value: "date-desc", children: "Date (Newest First)" }), _jsx("option", { value: "date-asc", children: "Date (Oldest First)" }), _jsx("option", { value: "source-asc", children: "Source (A-Z)" }), _jsx("option", { value: "source-desc", children: "Source (Z-A)" })] })] }) }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4", children: paginatedResults.map((art) => (_jsx(ArtworkCard, { artwork: art }, art.id))) }), totalPages > 1 && (_jsx(PaginationControls, { currentPage: currentPage, totalPages: totalPages, onPrev: () => setCurrentPage(prev => Math.max(prev - 1, 1)), onNext: () => setCurrentPage(prev => Math.min(prev + 1, totalPages)) })), loading && _jsx("p", { className: "text-gray-500 text-center", children: "Loading more results..." })] }));
};
export default SearchResults;
