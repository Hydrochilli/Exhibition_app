import React, { useState, useEffect } from "react";
import {
  fetchPublicGalleries,
  fetchEuropeanaCollectionArtworks,
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

  const pageSize = 44;

  const loadGalleries = async (page: number) => {
    setLoading(true);
    try {
      const apiResponse = await fetchPublicGalleries(page, pageSize);
      console.log(`API response for page ${page}:`, apiResponse);

      // base set of galleries from the API
      let apiGalleries: UserSet[] = apiResponse.items || [];
      console.log(`Public galleries count on page ${page}:`, apiGalleries.length);

      // fetch curated galleries in parallel
      const curatedResults = await Promise.all(
        curatedGalleryIds.map((id) =>
          fetchEuropeanaCollectionArtworks(id).catch((err) => {
            console.error("Error fetching curated gallery id:", id, err);
            return null;
          })
        )
      );
      // filter out null results
      const curatedGalleries = curatedResults
      .filter((g) => g !== null)
      .map((obj, index) => {
        // obj is { artworks, totalResults }
        // Construct a minimal UserSet. For example:
        return {
          id: "curated_" + index,   // or some stable ID
          title: { en: ["Curated from Europeana"] },
          type: "EntityBestItemsSet", // or whatever makes sense
          // etc. Fill in the minimum fields so the shape is valid
        } as UserSet;
      });
    
      // combine curated + API galleries, deduplicate by ID
      const combined = [...apiGalleries, ...curatedGalleries];
      console.log("Combined count before deduplication:", combined.length);

      const unique = combined.filter(
        (gallery, index, self) =>
          index === self.findIndex((g) => g.id === gallery.id)
      );
      console.log("Unique galleries count after merge:", unique.length);

      apiGalleries = unique;
      setGalleries(apiGalleries);

      // calculate total pages for the public gallery portion
      const apiTotal = apiResponse.total || 0;
      console.log("API total count:", apiTotal);
      const computedTotalPages = Math.ceil(apiTotal / pageSize);
      console.log("Computed total pages:", computedTotalPages);

      setTotalPages(computedTotalPages);
      setThumbnailsUpdated(false);
    } catch (err: any) {
      console.error("Error in loadGalleries:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGalleries(currentPage);
  }, [currentPage]);

  useEffect(() => {
    // Only update thumbnails once per new "galleries" load:
    if (galleries.length > 0 && !thumbnailsUpdated) {
      const updateThumbnails = async () => {
        const updatedGalleries = await Promise.all(
          galleries.map(async (gallery) => {
            // If the gallery already has a thumbnail, no need to fetch a new one:
            const currentThumbnail = getGalleryThumbnail(gallery);
            if (currentThumbnail) {
              return gallery; // keep as-is
            }

            // If there's no thumbnail, generate a title for search:
            const titleForSearch =
              typeof gallery.title === "object"
                ? Array.isArray(gallery.title.en)
                  ? gallery.title.en
                  : gallery.title.en
                : gallery.title;

            console.log(
              "Fetching thumbnail using search for:",
              titleForSearch,
              "gallery id:",
              gallery.id
            );

            // Handle various cases:
            if (!titleForSearch) {
              // fallback: no title => can't search, just return
              return gallery;
            } else if (Array.isArray(titleForSearch)) {
              // If it's an array of strings, pick the first
              const safeTitle = titleForSearch[0] || "";
              const newThumbnail = await fetchGalleryThumbnailUsingSearch(safeTitle);
              console.log(
                "Fetched thumbnail:",
                newThumbnail,
                "for gallery id:",
                gallery.id
              );
              return { ...gallery, thumbnail: newThumbnail };
            } else {
              // It's a single string
              const newThumbnail = await fetchGalleryThumbnailUsingSearch(titleForSearch);
              console.log(
                "Fetched thumbnail:",
                newThumbnail,
                "for gallery id:",
                gallery.id
              );
              return { ...gallery, thumbnail: newThumbnail };
            }
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
                        {gallery.description.en}
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
            onPrev={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            onNext={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          />
        </>
      )}
    </div>
  );
};

export default GalleriesPage;
