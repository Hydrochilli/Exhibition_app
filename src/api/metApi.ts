// src/api/metApi.ts

import axios from "axios";

/**
 * We'll define a shared Artwork type (or interface),
 * so that both APIs return a consistent shape.
 */
export interface Artwork {
  id: string;
  title: string;
  imageUrl: string;
  author: string;
  date: string;
  source: "MET" | "CLEVELAND";
}

const MET_BASE_URL = "https://collectionapi.metmuseum.org/public/collection/v1";

/**
 * Search The Met for a given term (e.g. "van gogh").
 * No API key required.
 */
export const searchMet = async (searchTerm: string): Promise<Artwork[]> => {
  // 1) Hit the Met search endpoint to get objectIDs
  const { data: searchData } = await axios.get(`${MET_BASE_URL}/search`, {
    params: {
      q: searchTerm,
      hasImages: true, // Only objects with images
    },
  });

  if (!searchData.objectIDs) return [];

  // 2) Limit how many results we fetch details for (e.g. up to 20)
  const limitedIDs = searchData.objectIDs.slice(0, 20);

  // 3) For each objectID, fetch object details
  const artworks: Artwork[] = [];
  for (let id of limitedIDs) {
    const { data: detailData } = await axios.get(`${MET_BASE_URL}/objects/${id}`);
    artworks.push({
      id: String(detailData.objectID),
      title: detailData.title || "Untitled",
      imageUrl: detailData.primaryImageSmall || "",
      author: detailData.artistDisplayName || "Unknown",
      date: detailData.objectDate || "",
      source: "MET",
    });
  }

  return artworks;
};
export default searchMet