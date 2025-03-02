


import axios from "axios";

const USER_SET_SEARCH_URL = "/api/set/search"; // via Vite proxy → https://api.europeana.eu/set/search
const USER_SET_DETAIL_URL = "/api/set"; // via Vite proxy → https://api.europeana.eu/set
const EUROPEANA_API_KEY = import.meta.env.VITE_EUROPEANA_API_KEY || "ggosewbi";

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

export interface UserSetResponse {
  items: UserSet[];
  total: number;
}

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
        start: start,
        qf: "type:EntityBestItemsSet",
        page: page,
        pageSize: pageSize,
        profile: "standard",
      },
    });
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
