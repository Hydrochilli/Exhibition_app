// src/api/userSetApi.ts
import axios from "axios";

/** 
 * Local / Vite proxy endpoints:
 *  - USER_SET_SEARCH_URL → "/api/set/search" 
 *    (proxies https://api.europeana.eu/set/search)
 *  - USER_SET_DETAIL_URL → "/api/set" 
 *    (proxies https://api.europeana.eu/set)
 */
const USER_SET_SEARCH_URL = "/api/set/search";
const USER_SET_DETAIL_URL = "/api/set";

// Europeana direct record search endpoint:
const EUROPEANA_RECORD_SEARCH_URL = "https://api.europeana.eu/record/v2/search.json";

// Fall back to "ggosewbi" if env var not defined:
const EUROPEANA_API_KEY = import.meta.env.VITE_EUROPEANA_API_KEY || "ggosewbi";

/** A single user-created or Europeana “set”. */
export interface UserSet {
  id: string;
  title: { en?: string[] };
  description?: { en?: string[] };
  thumbnail?: string;
  isShownBy?: { thumbnail?: string } | string;
  type: string;
  visibility?: string;
  // ... other properties as needed
}

/** Basic structure returned by fetchPublicGalleries. */
export interface UserSetResponse {
  items: UserSet[];
  total: number;
}

/**
 * Fetch public galleries (sets) from Europeana
 * using the proxied /api/set/search endpoint.
 */
export const fetchPublicGalleries = async (
  page = 1,
  pageSize = 12
): Promise<UserSetResponse> => {
  try {
    const start = (page - 1) * pageSize;
    const response = await axios.get(USER_SET_SEARCH_URL, {
      params: {
        wskey: EUROPEANA_API_KEY,
        query: "*",
        start,
        qf: "type:EntityBestItemsSet",
        page,
        pageSize,
        profile: "standard",
      },
    });

    // Filter to only “EntityBestItemsSet” types
    const galleries = response.data.items.filter(
      (set: UserSet) => set.type === "EntityBestItemsSet"
    );

    return {
      items: galleries,
      total: response.data.total,
    };
  } catch (error: any) {
    console.error(
      "Error fetching public galleries:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Fetch details of a single gallery/set by ID
 * using the proxied /api/set endpoint.
 */
export const fetchGalleryById = async (galleryId: string): Promise<UserSet> => {
  // If galleryId is a full URL, extract the numeric part.
  let numericId = galleryId;
  if (galleryId.startsWith("http://") || galleryId.startsWith("https://")) {
    const parts = galleryId.split("/");
    numericId = parts[parts.length - 1];
  }
  try {
    const response = await axios.get(`${USER_SET_DETAIL_URL}/${numericId}`, {
      params: {
        wskey: EUROPEANA_API_KEY,
        profile: "standard",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching gallery by id:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/** Structure returned by fetchEuropeanaCollectionArtworks. */
export interface EuropeanaCollectionArtworksResponse {
  artworks: {
    id: string;
    title: string;
    imageUrl: string;
    author: string;
    date: string;
  }[];
  totalResults: number;
}

/**
 * Fetch artworks from a Europeana collection by ID (Data Provider).
 * 
 * @param collectionId e.g. “2048008_Ag_EU_ProvidedCHO_Galerie_religieuse_12345”
 * @param page which page of results
 * @param pageSize how many rows per page
 */
export const fetchEuropeanaCollectionArtworks = async (
  collectionId: string,
  page = 1,
  pageSize = 48
): Promise<EuropeanaCollectionArtworksResponse> => {
  try {
    console.log("Original collection ID:", collectionId);

    // If it's a URL, only keep the trailing portion:
    let normalizedId = collectionId;
    if (
      normalizedId.startsWith("http://") ||
      normalizedId.startsWith("https://")
    ) {
      const parts = normalizedId.split("/");
      normalizedId = parts[parts.length - 1];
    }

    console.log("Normalized collection ID:", normalizedId);

    // Calculate which record to start on
    const start = (page - 1) * pageSize;

    // Query the Europeana record search endpoint
    const response = await axios.get(EUROPEANA_RECORD_SEARCH_URL, {
      params: {
        wskey: EUROPEANA_API_KEY,
        query: "*",
        qf: `DATA_PROVIDER:"${normalizedId}"`,
        rows: pageSize,    // number of results to return
        start,             // offset of the first result
      },
    });

    console.log("Europeana Collection Artworks Response:", response.data);

    // Transform the response data into a consistent shape
    return {
      artworks: (response.data.items || []).map((item: any) => ({
        id: item.id,
        title: item.title || "Untitled",
        imageUrl: item.edmPreview?.[0] || "",
        author: item.dataProvider?.[0] || "Unknown",
        date: item.year || "Unknown",
      })),
      totalResults: response.data.totalResults || 0,
    };
  } catch (error: any) {
    console.error(
      "Error fetching collection artworks from Europeana:",
      error.response?.data || error.message
    );
    throw error;
  }
};
