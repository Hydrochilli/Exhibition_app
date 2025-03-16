import axios from "axios";

const RECORD_API_URL = "https://api.europeana.eu/record/v2/search.json";
const EUROPEANA_API_KEY = import.meta.env.VITE_EUROPEANA_API_KEY || "ggosewbi";

export const fetchGalleryThumbnailUsingSearch = async (searchTerm: string): Promise<string> => {
  try {
    const response = await axios.get(RECORD_API_URL, {
      params: {
        wskey: EUROPEANA_API_KEY,
        query: searchTerm, // Use the gallery title (or another term) as the query
        rows: 1,
      },
    });
    if (response.data.items && response.data.items.length > 0) {
      const item = response.data.items[0];
      return item.edmPreview?.[0] || "";
    }
    return "";
  } catch (error: any) {
    console.error("Error fetching gallery thumbnail using search:", error.response?.data || error.message);
    return "";
  }
};


  
export default fetchGalleryThumbnailUsingSearch