import axios from "axios";
const EUROPEANA_API_KEY = import.meta.env.VITE_EUROPEANA_KEY;
const EUROPEANA_BASE_URL = "https://api.europeana.eu/record/v2/search.json";
export const fetchPublicGalleries = async (page = 1, pageSize = 12) => {
    try {
        const start = (page - 1) * pageSize;
        const response = await axios.get("https://api.europeana.eu/set/search", {
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
        return {
            items: response.data.items || [],
            total: response.data.total || 0,
        };
    }
    catch (error) {
        console.error("Error fetching public galleries:", error.response?.data || error.message);
        throw error;
    }
};
export const fetchEuropeanaCollectionArtworks = async (collectionId) => {
    try {
        console.log("Original collection ID:", collectionId);
        let normalizedId = collectionId;
        if (collectionId.startsWith("http")) {
            normalizedId = collectionId.split("/").pop() || "";
        }
        console.log("Normalized collection ID:", normalizedId);
        const response = await axios.get("https://api.europeana.eu/record/v2/search.json", {
            params: {
                wskey: import.meta.env.VITE_EUROPEANA_KEY,
                query: "*",
                qf: `DATA_PROVIDER:"${normalizedId}"`,
                rows: 48,
                start: 0,
            },
        });
        console.log("Europeana Collection Artworks Response:", response.data);
        return {
            artworks: response.data.items.map((item) => ({
                id: item.id,
                title: item.title || "Untitled",
                imageUrl: item.edmPreview?.[0] || "",
                author: item.dataProvider?.[0] || "Unknown",
                date: item.year || "Unknown",
            })),
            totalResults: response.data.totalResults || 0,
        };
    }
    catch (error) {
        console.error("❌ Error fetching collection artworks from Europeana:", error.response?.data || error.message);
        throw error;
    }
};
