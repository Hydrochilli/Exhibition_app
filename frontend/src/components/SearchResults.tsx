import React, { useState, useEffect } from "react";
import { fetchUnifiedSearch } from "../api/unifySearch";
import PaginationControls from "./PaginationControls";

type Artwork = {
  id: string;
  title: string;
  author: string;
  date: string;
  imageUrl: string;
  source: string;
};

type SearchResultsProps = {
  searchTerm: string;
  century?: string;
  department?: string;
  selectedApi?: string;
};

const ITEMS_PER_PAGE = 48;

const SearchResults: React.FC<SearchResultsProps> = ({
  searchTerm,
  century = "",
  department = "",
  selectedApi = "All",
}) => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOption, setSortOption] = useState("title-asc"); // Default sorting

  useEffect(() => {
    if (!searchTerm) return;

    setLoading(true);
    setCurrentPage(1); // Reset to page 1 when search changes

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

  if (!searchTerm) return <div>Please enter a search term.</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  // Helper function to parse dates for sorting
  function parseDate(dateStr: string): number {
    if (!dateStr || dateStr.toLowerCase() === "unknown") return Infinity; // Missing dates sorted last

    // Match BC dates (e.g., "500 BC" → -500)
    const bcMatch = dateStr.match(/(\d+)\s*BC/i);
    if (bcMatch) return -parseInt(bcMatch[1], 10);

    // Match AD dates (e.g., "1500", "2023")
    const adMatch = dateStr.match(/\b(\d{3,4})\b/);
    if (adMatch) return parseInt(adMatch[1], 10);

    return Infinity; // Fallback for unrecognized dates
  }

  // Helper function to format dates nicely
  function formatDate(dateStr: string): string {
    if (!dateStr || dateStr.toLowerCase() === "unknown") return "Date Unknown";

    const bcMatch = dateStr.match(/(\d+)\s*BC/i);
    if (bcMatch) return `${bcMatch[1]} BC`;

    const adMatch = dateStr.match(/\b(\d{3,4})\b/);
    if (adMatch) return `${adMatch[1]} AD`;

    return dateStr; // If it's already readable, keep it
  }

  // Sorting Function
  const sortedArtworks = [...artworks].sort((a, b) => {
    switch (sortOption) {
      case "title-asc":
        return a.title.localeCompare(b.title);
      case "title-desc":
        return b.title.localeCompare(a.title);
      case "date-asc": {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return dateA - dateB;
      }
      case "date-desc": {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return dateB - dateA;
      }
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

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold mt-6">
        Results for "{searchTerm}"
      </h2>

      {/* Sorting & Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-center my-4">
        {/* Sort by */}
        <div>
          <label className="block mb-1 font-semibold">Sort By</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border rounded p-1"
          >
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
            <option value="date-desc">Date (Newest First)</option>
            <option value="date-asc">Date (Oldest First)</option>
            <option value="source-asc">Source (A-Z)</option>
            <option value="source-desc">Source (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Search Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {paginatedResults.map((art) => (
          <div key={art.id} className="border p-2 transition-transform duration-200 hover:scale-105">
            {art.imageUrl ? (
              <img
                src={art.imageUrl}
                alt={art.title}
                className="mb-2 w-full h-48 object-cover transition-opacity duration-500"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                No Image
              </div>
            )}
            <div className="font-semibold">{art.title}</div>
            <div>{art.author}</div>
            <div>{formatDate(art.date)}</div> {/* ✅ Improved date formatting */}
            <div className="text-sm text-gray-500">Source: {art.source}</div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {loading && <p className="text-gray-500 text-center">Loading more results...</p>}
    </div>
  );
};

export default SearchResults;
