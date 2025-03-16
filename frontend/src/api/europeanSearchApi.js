import axios from "axios";
const EUROPEANA_SEARCH_URL = "https://api.europeana.eu/search.json";
const EUROPEANA_API_KEY = import.meta.env.VITE_EUROPEANA_API_KEY || "ggosewbi";
export const fetchEuropeanaSearchResults = async (query, page, rows) => {
    try {
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
    }
    catch (error) {
        console.error("Error fetching search results from Search API:", error.response?.data || error.message);
        throw error;
    }
};
