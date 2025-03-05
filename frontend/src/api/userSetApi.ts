import axios from "axios";

// The Europeana base endpoint for /set/search
const USER_SET_SEARCH_URL = "https://api.europeana.eu/set/search"; 
const USER_SET_DETAIL_URL = "https://api.europeana.eu/set"; // For single set, if used
const EUROPEANA_API_KEY = "ggosewbi"

// The shape of the sets returned by Europeana
export interface UserSet {
  id: string;
  title: any;   // can be { en?: string[] } or string
  description?: any;
  thumbnail?: string;
  type?: string;
  visibility?: string;
  // etc.
}

export interface UserSetResponse {
  items: UserSet[];
  total: number;
}

/**
 * Fetch public galleries from Europeana by calling /set/search directly.
 * This is the approach that used to work in your frontend code.
 */
export const fetchPublicGalleries = async (
  page = 1,
  pageSize = 12
): Promise<{ items: UserSet[]; total: number }> => {
  try {
    const start = (page - 1) * pageSize; // If you used 0 for page=1
    // EXACT or approximate usage:
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

    // Filter for sets of type "EntityBestItemsSet"
    const galleries = response.data.items?.filter(
      (set: UserSet) => set.type === "EntityBestItemsSet"
    ) || [];

    return {
      items: galleries,
      total: response.data.total || 0,
    };
  } catch (error: any) {
    console.error("Error fetching public galleries:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Optionally, fetch a single gallery
 */
export const fetchGalleryById = async (galleryId: string): Promise<UserSet> => {
  try {
    // If your old code used full URL, handle that:
    const numericId = galleryId.startsWith("http")
      ? galleryId.split("/").pop()
      : galleryId;
    
    const response = await axios.get(`${USER_SET_DETAIL_URL}/${numericId}`, {
      params: {
        wskey: EUROPEANA_API_KEY,
        profile: "standard",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching gallery by id:", error.response?.data || error.message);
    throw error;
  }
};
