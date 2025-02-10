// src/pages/Home.tsx
import React, { useState } from "react";
import SearchBar from "../components/SearchBar.tsx";
import ArtworkList from "../components/ArtworkList.tsx";

const Home: React.FC = () => {
  // For demonstration, we'll mock some artworks
  const mockArtworks = [
    {
      id: "1",
      title: "Starry Night",
      imageUrl: "https://via.placeholder.com/200",
      author: "Vincent van Gogh",
      date: "1889"
    },
    {
      id: "2",
      title: "Mona Lisa",
      imageUrl: "https://via.placeholder.com/200",
      author: "Leonardo da Vinci",
      date: "1503"
    },
    // ... more items
  ];

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5; // Replace with real data once you fetch from an API

  // Search callback (from SearchBar)
  const handleSearch = (category: string, term: string) => {
    // TODO: integrate your real data fetching here
    // e.g., call a function to fetch data from Europeana / The Met
    console.log("Search triggered =>", { category, term });
  };

  // Filter and Sort (placeholder)
  // You could add multi-select filters, date range pickers, etc.
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // e.g., filter by medium, date, etc.PaginationControls.tsx
    console.log("Filter changed =>", e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // e.g., sort by newest, oldest, alphabetical
    console.log("Sort changed =>", e.target.value);
  };

  // Pagination handlers
  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };
  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  return (
    <div className="container mx-auto p-4">
      {/* Central SearchBar */}
      <SearchBar onSearch={handleSearch} />

      {/* Simple Filter and Sort UI */}
      <div className="flex gap-4 justify-center my-4">
        <select onChange={handleFilterChange} className="border rounded p-1">
          <option value="">Filter by...</option>
          <option value="paintings">Paintings</option>
          <option value="sculptures">Sculptures</option>
          <option value="photographs">Photographs</option>
        </select>

        <select onChange={handleSortChange} className="border rounded p-1">
          <option value="">Sort by...</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>

      {/* Artwork List with Pagination */}
      <ArtworkList
        artworks={mockArtworks}
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={handlePrevPage}
        onNext={handleNextPage}
      />
    </div>
  );
};

export default Home;
