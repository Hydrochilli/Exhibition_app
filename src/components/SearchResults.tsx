// src/components/SearchResults.tsx
import React, { useState, useEffect } from "react";
import { fetchUnifiedSearch } from "../api/unifySearch";

// Example Artwork type
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
  selectedApi?: string; // "All" | "Met" | "Cleveland"
};

const SearchResults: React.FC<SearchResultsProps> = ({
  searchTerm,
  century = "",
  department = "",
  selectedApi = "All",
}) => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!searchTerm) return;

    setLoading(true);
    fetchUnifiedSearch(searchTerm, century, department, selectedApi)
      .then((results) => {
        setArtworks(results);
        setError("");
      })
      .catch((err) => {
        console.error("Unified search error:", err);
        setError(err.message || "An error occurred in unified search");
      })
      .finally(() => setLoading(false));
  }, [searchTerm, century, department, selectedApi]);

  if (!searchTerm) {
    return <div>Please enter a search term.</div>;
  }

  if (loading) return <div>Loading search results...</div>;
  if (error) return <div>Error: {error}</div>;
  if (artworks.length === 0) return <p>No results found.</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mt-6">
        Results for "{searchTerm}"
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {artworks.map((art) => (
          <div key={art.id} className="border p-2">
            {art.imageUrl && (
              <img
                src={art.imageUrl}
                alt={art.title}
                className="mb-2 w-full h-48 object-cover"
              />
            )}
            <div className="font-semibold">{art.title}</div>
            <div>{art.author}</div>
            <div>{art.date}</div>
            <div className="text-sm text-gray-500">Source: {art.source}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
