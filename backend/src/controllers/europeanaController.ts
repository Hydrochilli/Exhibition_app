import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const EUROPEANA_API_KEY = process.env.EUROPEANA_API_KEY || "ggosewbi"; // Use your API key

export const fetchEuropeanaGalleries = async (page = 1, pageSize = 12) => {
    try {
      const start = (page - 1) * pageSize;
      const response = await axios.get("https://api.europeana.eu/record/v2/search.json", {
        params: {
          wskey: EUROPEANA_API_KEY, // API key
          query: "*",               // Required query parameter
          start: start,             // Pagination
          qf: "TYPE:IMAGE",         // Ensure filtering only for images
          rows: pageSize,           // Limit results per request
          profile: "rich",          // Ensures we get useful metadata
        },
      });
  
      if (!response.data || !response.data.items) {
        throw new Error("Invalid API response");
      }
  
      return response.data;
    } catch (error: any) {
      console.error("Error fetching from Europeana API:", error.response?.data || error.message);
      throw new Error("Failed to fetch Europeana galleries.");
    }
  };