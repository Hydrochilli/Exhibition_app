// src/api/metApi.ts
import axios from "axios";

/**
 * The Met collection API endpoints:
 *  - /search?hasImages=true&q={searchTerm} returns a JSON with objectIDs array
 *  - /objects/{objectID} returns detailed metadata for a single artwork
 */

const MET_BASE_URL = "https://collectionapi.metmuseum.org/public/collection/v1";

export interface MetObject {
  objectID: number;
  primaryImageSmall: string;
  title: string;
  artistDisplayName: string;
  objectDate: string;
  // ... more fields if needed
}

/**
 * Step 1: Search for object IDs that match a given term, restricting to objects that have images.
 * @param searchTerm The keyword(s) to search
 * @returns an array of numeric objectIDs
 */
export const searchMetArtworks = async (searchTerm: string): Promise<number[]> => {
  try {
    const response = await axios.get(`${MET_BASE_URL}/search`, {
      params: {
        q: searchTerm,
        hasImages: true, // only objects with images
      },
    });

    const data = response.data;
    const objectIDs = data?.objectIDs || []; // might be null if no matches

    // For debugging or logging:
    console.log(`[searchMetArtworks] "${searchTerm}" returned ${objectIDs.length} IDs.`);

    return objectIDs;
  } catch (error) {
    console.error("[searchMetArtworks] Error:", error);
    throw error;
  }
};

/**
 * Step 2: Fetch the details for a single Met object by ID.
 * @param objectID
 * @returns detailed information about one artwork
 */
export const fetchMetObject = async (objectID: number): Promise<MetObject> => {
  try {
    const response = await axios.get<MetObject>(`${MET_BASE_URL}/objects/${objectID}`);
    // console.log(`[fetchMetObject] objectID=${objectID} =>`, response.data); // optional debug
    return response.data;
  } catch (error) {
    console.error(`[fetchMetObject] Error fetching objectID=${objectID}:`, error);
    throw error;
  }
};

/**
 * Step 3: Higher-level function to fetch a single "page" of Met artworks:
 *   1) Search for all object IDs matching the term
 *   2) Slice the array according to the requested page/pageSize
 *   3) Fetch each object's details
 *   4) Normalize into a consistent data shape
 *
 * @param searchTerm The search query
 * @param page The 1-based page number
 * @param pageSize How many artworks per page
 * @returns { artworks, totalResults } where:
 *   - artworks is an array of normalized objects for display
 *   - totalResults is the total number of matched IDs
 */
export const fetchMetArtworksPage = async (
  searchTerm: string,
  page: number,
  pageSize: number
): Promise<{
  artworks: Array<{
    id: string;
    title: string;
    imageUrl: string;
    author: string;
    date: string;
  }>;
  totalResults: number;
}> => {
  try {
    // 1) Retrieve all matching object IDs (with images)
    const allIDs = await searchMetArtworks(searchTerm);
    const totalResults = allIDs.length;

    if (totalResults === 0) {
      // No matches found, return empty array
      return { artworks: [], totalResults: 0 };
    }

    // 2) Calculate slice indexes for the requested page
    // (page is 1-based, so page=1 => startIndex=0)
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // If startIndex >= totalResults, it means the page is out of range
    if (startIndex >= totalResults) {
      console.warn(
        `[fetchMetArtworksPage] Requested page (${page}) exceeds total pages. Returning empty array.`
      );
      return { artworks: [], totalResults };
    }

    // 3) Slice out just the IDs for this page
    const pageIDs = allIDs.slice(startIndex, endIndex);

    // 4) Fetch the details for each ID
    const objectPromises = pageIDs.map((id) => fetchMetObject(id));
    const objects = await Promise.all(objectPromises);

    // 5) Normalize objects into a consistent shape
    const artworks = objects.map((obj) => ({
      id: obj.objectID.toString(),
      title: obj.title,
      imageUrl: obj.primaryImageSmall, // can also use 'primaryImage' if you want larger images
      author: obj.artistDisplayName || "Unknown",
      date: obj.objectDate || "",
    }));

    // Debug logging
    console.log(
      `[fetchMetArtworksPage] Page ${page} => Showing results ${startIndex + 1} to ${Math.min(
        endIndex,
        totalResults
      )} of ${totalResults}.`
    );

    return {
      artworks,
      totalResults,
    };
  } catch (error) {
    console.error("[fetchMetArtworksPage] Error:", error);
    throw error;
  }
};
