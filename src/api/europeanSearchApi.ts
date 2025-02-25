import axios from "axios";

const EUROPEANA_SEARCH_URL = "https://api.europeana.eu/search.json";
const EUROPEANA_API_KEY = import.meta.env.VITE_EUROPEANA_API_KEY || "ggosewbi";

export interface EuropeanaSearchItem {
  id: string;
  title: string;
  edmPreview?: string[];
  // Add any additional fields that you expect to use (e.g. dataProvider, etc.)
}

export interface EuropeanaSearchResponse {
  items: EuropeanaSearchItem[];
  totalResults: number;
}

export const fetchEuropeanaSearchResults = async (
  query: string,
  page: number,
  rows: number
): Promise<EuropeanaSearchResponse> => {
  try {
    // Calculate start using a 1-based index (adjust if needed)
    const start = (page - 1) * rows + 1;
    const response = await axios.get(EUROPEANA_SEARCH_URL, {
      params: {
        wskey: EUROPEANA_API_KEY,
        query: query,
        rows: rows,
        start: start,
      },
    });
    console.log("Search API response:", response.data);
    return {
      items: response.data.items,
      totalResults: response.data.totalResults,
    };
  } catch (error: any) {
    console.error(
      "Error fetching search results from Search API:",
      error.response?.data || error.message
    );
    throw error;
  }
};
