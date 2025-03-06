// src/components/ArtworkDetail.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchSingleArtwork } from "../api/metApi";

const ArtworkDetail: React.FC = () => {
  const { artworkId } = useParams<{ artworkId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [artwork, setArtwork] = useState<any>(null);

  useEffect(() => {
    if (!artworkId) return;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchSingleArtwork(artworkId);
        setArtwork(data);
      } catch (err) {
        console.error("Error fetching detail:", err);
        setError("Failed to load artwork detail.");
      } finally {
        setLoading(false);
      }
    })();
  }, [artworkId]);

  if (loading) return <div>Loading artwork detail...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!artwork) return <div>No detail available.</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">{artwork.title}</h2>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Large Image */}
        <div className="flex-1">
          {artwork.imageUrl ? (
            <img
              src={artwork.imageUrl}
              alt={artwork.title}
              className="max-w-full h-auto object-contain border"
            />
          ) : (
            <div className="bg-gray-200 p-4 text-center">No Image Available</div>
          )}
        </div>
        {/* Right Side Info */}
        <div className="flex-1">
          <p>
            <strong>Author:</strong> {artwork.author || "Unknown"}
          </p>
          <p>
            <strong>Date:</strong> {artwork.date || "Unknown"}
          </p>
          <p className="mt-4 text-sm text-gray-700">
            <strong>Source:</strong> {artwork.source}
          </p>
          {/* Optionally show more detail if available */}
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetail;
