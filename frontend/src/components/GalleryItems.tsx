import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchEuropeanaCollectionArtworks } from "../api/europeanaApi";
import PaginationControls from "./PaginationControls";

const ITEMS_PER_PAGE = 48;

const GalleryItems: React.FC = () => {
  const { galleryId } = useParams();
  const [artworks, setArtworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!galleryId) return;

    const fetchArtworks = async () => {
      try {
        setLoading(true);
        const data = await fetchEuropeanaCollectionArtworks(galleryId, currentPage, ITEMS_PER_PAGE);
        setArtworks(data.artworks);
        setTotalPages(Math.ceil(data.totalResults / ITEMS_PER_PAGE));
      } catch (err) {
        setError("Failed to load artworks.");
        console.error("Error fetching gallery items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [galleryId, currentPage]);

  if (loading) return <p>Loading artworks...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold">Gallery Items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {artworks.map((art) => (
          <div key={art.id} className="border p-2">
            {art.imageUrl ? (
              <img src={art.imageUrl} alt={art.title} className="mb-2 w-full h-48 object-cover" />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">No Image</div>
            )}
            <h3 className="font-semibold">{art.title}</h3>
            <p>{art.author}</p>
            <p className="text-sm text-gray-500">{art.date || "Unknown Date"}</p>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
       <PaginationControls
       currentPage={currentPage}
       totalPages={totalPages}
       onPrev={() => setCurrentPage(prev => Math.max(1, prev - 1))}
       onNext={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
     />
     
      )}
    </div>
  );
};

export default GalleryItems;
