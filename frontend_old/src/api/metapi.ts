// src/api/metApi.ts
import axios from "axios";

const MET_BASE_URL = "https://collectionapi.metmuseum.org/public/collection/v1";

/**
 * Return an array of standardized Artwork objects from The Met.
 */
export const searchMet = async (searchTerm: string) => {
  // 1) Query The Met for object IDs that match the search term
  const { data: searchData } = await axios.get(`${MET_BASE_URL}/search`, {
    params: {
      q: searchTerm,
      hasImages: true, // Only objects with images
    },
  });

  // If no objectIDs, return an empty array
  if (!searchData.objectIDs) return [];

  // 2) Optionally limit how many IDs we fetch (e.g., 20)
  const limitedIDs = searchData.objectIDs.slice(0, 100);

  const results = [];
  for (const id of limitedIDs) {
    // 3) Fetch object details for each ID
    const { data: objData } = await axios.get(`${MET_BASE_URL}/objects/${id}`);

    // Fallback logic for images:
    //  - primaryImageSmall (often a web-friendly resolution)
    //  - or primaryImage (higher resolution)
    //  - or the first URL in additionalImages
    let imageUrl = objData.primaryImageSmall || objData.primaryImage || "";
    if (!imageUrl && objData.additionalImages?.length) {
      imageUrl = objData.additionalImages[0];
    }

    results.push({
      id: String(objData.objectID),
      title: objData.title || "Untitled",
      author: objData.artistDisplayName || "Unknown",
      date: objData.objectDate || "",
      imageUrl,
      source: "MET" as const,
    });
  }
  return results;
};

export default searchMet;
