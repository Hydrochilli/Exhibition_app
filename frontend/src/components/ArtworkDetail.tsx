// ArtworkDetail.tsx
import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { fetchSingleArtwork as fetchMetDetail } from "../api/metApi";
import { fetchSingleClevelandArtwork } from "../api/clevelandApi";

interface Artwork {
  id: string;
  title: string;
  author: string;
  date: string;
  imageUrl: string;
  source: string;
  description: string | null;
}

const ArtworkDetail: React.FC = () => {

  const { artworkId } = useParams<{ artworkId: string }>();

  const location = useLocation() as { state?: { source?: string } };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [artwork, setArtwork] = useState<Artwork | null>(null);

  useEffect(() => {
    if (!artworkId) return;

    (async () => {
      try {
        setLoading(true);

    
        const source = location.state?.source || "Met";

        let data: Artwork | null = null;
        if (source === "Cleveland") {
          data = await fetchSingleClevelandArtwork(artworkId);
        } else {
          // default to MET
          data = await fetchMetDetail(artworkId);
        }
        setArtwork(data);
        console.log("DEBUG: final setArtwork =>", data);
      } catch (err) {
        console.error("Error fetching detail:", err);
        setError("Failed to load artwork detail.");
      } finally {
        setLoading(false);
      }
    
    })();
  }, [artworkId, location.state?.source]);

  if (loading) return <div>Loading artwork detail...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!artwork) return <div>No detail available.</div>;

  
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">{artwork.title}</h2>
      <div className="flex flex-col md:flex-row gap-6">
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
          <p className="mt-4 text-gray-700">
              <strong>Description:</strong> {artwork.description}
            </p>
        

        </div>
      </div>
    </div>
  );
};

export default ArtworkDetail;
