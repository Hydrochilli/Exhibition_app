// src/components/SearchResults.tsx
import React, { useState, useEffect } from "react";
import { fetchEuropeanaArtworks } from "../api/europeanaApi";
import ArtworkList from "./ArtworkList";
import PaginationControls from "./PaginationControls";

type SearchResultsProps = {
  searchTerm: string;
  // Optional filters can be added here later. For now we’ll just use searchTerm.
};

const SearchResults: React.FC<SearchResultsProps> = ({ searchTerm }) => {
  const [artworks, setArtworks] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const pageSize = 48;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Build the query string.
        // Later, you can append filters (e.g., "AND century:19" etc.)
        const query = searchTerm;
        console.log(`Fetching artworks for query: "${query}" on page ${currentPage}`);
        const response = await fetchEuropeanaArtworks(query, currentPage, pageSize);
        console.log("Europeana search response:", response);
        setArtworks(response.artworks);
        setTotalResults(response.totalResults);
      } catch (err: any) {
        console.error("Error fetching search results:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchTerm, currentPage]);

  const computedTotalPages = Math.ceil(totalResults / pageSize);

  return (
    <div>
      {loading && <div>Loading search results...</div>}
      {error && <div>Error loading search results: {error}</div>}
      {!loading && !error && (
        <>
          <h2 className="text-xl font-semibold mt-6">
            Search Results for "{searchTerm}" (Page {currentPage} of {computedTotalPages})
          </h2>
          <ArtworkList
            artworks={artworks}
            currentPage={currentPage}
            totalPages={computedTotalPages}
            onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            onNext={() => setCurrentPage((prev) =>
              prev < computedTotalPages ? prev + 1 : prev
            )}
          />
        </>
      )}
    </div>
  );
};

export default SearchResults;
