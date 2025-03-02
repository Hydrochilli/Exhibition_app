// src/components/GalleriesSection.tsx
import React, { useState, useEffect } from "react";
import { fetchPublicGalleries, fetchGalleryById,UserSet } from "../api/userSetApi";
import { Link } from "react-router-dom";
import stripLastWord from "../helpers/stripLastWord";
import getGalleryThumbnail from "../helpers/getGalleryThumbnail";
import fetchGalleryThumbnailUsingSearch from "../helpers/fetchGalleryThumbnail";

const GalleriesSection: React.FC = () => {
  const [galleries, setGalleries] = useState<UserSet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [thumbnailsUpdated, setThumbnailsUpdated] = useState<boolean>(false);

  // Fetch public galleries on mount.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchPublicGalleries(1, 12);
        console.log("Fetched public galleries:", data);
        setGalleries(data.items || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Once galleries are loaded, update missing thumbnails only once.
  useEffect(() => {
    if (galleries.length > 0 && !thumbnailsUpdated) {
      const updateThumbnails = async () => {
        const updatedGalleries = await Promise.all(
          galleries.map(async (gallery) => {
            let currentThumbnail = getGalleryThumbnail(gallery);
            if (!currentThumbnail) {
              // Derive a search term from the gallery title.
              const titleForSearch =
                typeof gallery.title === "object"
                  ? (Array.isArray(gallery.title.en)
                      ? gallery.title.en
                      : gallery.title.en)
                  : gallery.title;
              currentThumbnail = await fetchGalleryThumbnailUsingSearch(titleForSearch);
              return { ...gallery, thumbnail: currentThumbnail };
            }
            return gallery;
          })
        );
        setGalleries(updatedGalleries);
        setThumbnailsUpdated(true);
      };

      updateThumbnails();
    }
  }, [galleries, thumbnailsUpdated]);

  if (loading) return <div>Loading Galleries...</div>;
  if (error) return <div>Error loading Galleries: {error}</div>;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Galleries</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {galleries.map((gallery) => {
          const thumbnailUrl = getGalleryThumbnail(gallery);
          return (
            <Link
              key={gallery.id}
              to={`/set/${encodeURIComponent(gallery.id)}`}
              className="block border rounded overflow-hidden shadow hover:shadow-lg transition"
            >
              <div className="h-40 overflow-hidden">
                {thumbnailUrl ? (
                  <img
                    src={thumbnailUrl}
                    alt={
                      typeof gallery.title === "object"
                        ? stripLastWord(gallery.title)
                        : gallery.title
                    }
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <span>No Image</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold">
                  {typeof gallery.title === "object"
                    ? stripLastWord(gallery.title)
                    : gallery.title}
                </h3>
                {gallery.description && gallery.description.en && (
                  <p className="text-sm text-gray-600 mt-2">
                    {gallery.description.en}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
      <div className="mt-4 text-right">
        <Link to="/galleries" className="text-blue-600 hover:underline">
          More Galleries
        </Link>
      </div>
    </div>
  );
};

export default GalleriesSection;
