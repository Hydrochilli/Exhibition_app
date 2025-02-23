// src/pages/GalleriesPage.tsx
import React, { useState, useEffect } from "react";
import {
  fetchPublicGalleries,
  fetchGalleryById,
  UserSet,
} from "../api/userSetApi";
import PaginationControls from "../components/PaginationControls";
import { Link } from "react-router-dom";
import stripLastWord from "../helpers/stripLastWord";
import getGalleryThumbnail from "../helpers/getGalleryThumbnail";
import fetchGalleryThumbnailUsingSearch from "../helpers/fetchGalleryThumbnail";
import { curatedGalleryIds } from "../data/createdGalleryIds";

const GalleriesPage: React.FC = () => {
  const [galleries, setGalleries] = useState<UserSet[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [thumbnailsUpdated, setThumbnailsUpdated] = useState<boolean>(false);

  const pageSize = 48;

  const loadGalleries = async (page: number) => {
    setLoading(true);
    try {
      // Fetch public galleries from API
      const apiResponse = await fetchPublicGalleries(page, pageSize);
      let apiGalleries: UserSet[] = apiResponse.items || [];

      // On page 1, also fetch curated galleries by ID and merge them.
      if (page === 1 && curatedGalleryIds.length > 0) {
        const curatedResults = await Promise.all(
          curatedGalleryIds.map((id) =>
            fetchGalleryById(id).catch((err) => {
              console.error("Error fetching curated gallery id:", id, err);
              return null;
            })
          )
        );
        const curatedGalleries = curatedResults.filter((g) => g !== null) as UserSet[];
        // Merge and deduplicate based on gallery id.
        const combined = [...apiGalleries, ...curatedGalleries];
        const unique = combined.filter(
          (gallery, index, self) =>
            index === self.findIndex((g) => g.id === gallery.id)
        );
        apiGalleries = unique;
      }
      setGalleries(apiGalleries);
      // Use only the API's total count for pagination.
      const apiTotal = apiResponse.total || 0;
      setTotalPages(Math.ceil(apiTotal / pageSize));
      setThumbnailsUpdated(false); // Reset the flag when new galleries are loaded
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGalleries(currentPage);
  }, [currentPage]);

  // Update missing thumbnails only once per page load.
  useEffect(() => {
    if (galleries.length > 0 && !thumbnailsUpdated) {
      const updateThumbnails = async () => {
        const updatedGalleries = await Promise.all(
          galleries.map(async (gallery) => {
            const currentThumbnail = getGalleryThumbnail(gallery);
            if (!currentThumbnail) {
              // Use gallery title as search term.
              const titleForSearch =
                typeof gallery.title === "object"
                  ? Array.isArray(gallery.title.en)
                    ? gallery.title.en[0]
                    : gallery.title.en
                  : gallery.title;
              const newThumbnail = await fetchGalleryThumbnailUsingSearch(titleForSearch);
              return { ...gallery, thumbnail: newThumbnail };
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-2">Galleries</h1>
      <p className="text-lg mb-6">this will be the description</p>
      {loading && <div>Loading galleries...</div>}
      {error && <div>Error loading galleries: {error}</div>}
      {!loading && !error && (
        <>
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
                        {gallery.description.en[0]}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            onNext={() =>
              setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
            }
          />
        </>
      )}
    </div>
  );
};

export default GalleriesPage;
