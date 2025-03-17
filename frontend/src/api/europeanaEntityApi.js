// src/api/europeanaEntityApi.ts
import axios from "axios";
const EUROPEANA_ENTITY_BASE_URL = "https://api.europeana.eu/entity/search";
const EUROPEANA_API_KEY = import.meta.env.VITE_EUROPEANA_KEY;
export const fetchEntitySuggestions = async (query) => {
    try {
        const response = await axios.get(EUROPEANA_ENTITY_BASE_URL, {
            params: {
                wskey: EUROPEANA_API_KEY,
                query: query,
                page: 1,
                pageSize: 10,
            },
        });
        return response.data;
    }
    catch (error) {
        console.error("Error fetching entity suggestions:", error.response?.data || error.message);
        throw error;
    }
};
