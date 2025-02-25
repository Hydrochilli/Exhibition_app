// src/components/SearchResults.tsx
import React, { useState, useEffect } from "react";
import { fetchUnifiedSearch } from "../api/unifySearch";
import { Artwork } from "../api/metApi"; // same Artwork interface

type SearchResultsProps = {
  searchTerm: string;
};

const SearchResults: React.FC<SearchResultsProps> = ({ searchTerm }) => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!searchTerm) return;
    setLoading(true);

    fetchUnifiedSearch(searchTerm)
      .then((results) => {
        setArtworks(results);
        setError("");
      })
      .catch((err) => {
        console.error("Unified search error:", err);
        setError(err.message || "Error occurred in unified search");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchTerm]);

  if (!searchTerm) {
    return <div>Please enter a search term.</div>;
  }

  if (loading) return <div>Loading search results...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mt-6">
        Unified Results for "{searchTerm}"
      </h2>
      {artworks.length === 0 ? (
        <p>No results found.</p>
      ) : (
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
              <div className="text-sm text-gray-500">
                Source: {art.source}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;

