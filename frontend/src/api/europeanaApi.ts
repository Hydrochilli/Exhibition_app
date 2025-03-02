// src/api/europeanaApi.ts
import axios from "axios";

const EUROPEANA_BASE_URL = "http://localhost:3001/api/europeana"; // Replaced with proxy endpoint
const EUROPEANA_API_KEY = import.meta.env.VITE_EUROPEANA_KEY || "ggosewbi";

export interface EuropeanaItem {
  id: string;
  title: string;
  dataProvider?: string[];
  edmPreview?: string[];
  dcDescription?: string[];
}

export interface EuropeanaResponse {
  items: EuropeanaItem[];
  totalResults: number;
}

/**
 * Fetch artworks from Europeana using searchTerm, paging, and optional filters.
 */
export const fetchEuropeanaArtworks = async (
  searchTerm: string,
  page: number,
  pageSize: number,
  typeFilter?: string,
  centuryFilter?: string
) => {
  try {
    console.log(`Fetching artworks for searchTerm: "${searchTerm}"...`);

    // Build an array of qf filters if they exist
    const qfParams: string[] = [];

    // If user selected a type, e.g. "IMAGE", "VIDEO", "SOUND", etc.
    if (typeFilter) {
      qfParams.push(`TYPE:${typeFilter}`);
    }

    // If user selected a century, e.g. "17"
    // This is an example; adapt as needed (year ranges, etc.).
    if (centuryFilter) {
      // Example using hypothetical 'plnCentury:17' or a year range:
      // qfParams.push("YEAR:[1600 TO 1699]");
      qfParams.push(`plnCentury:${centuryFilter}`);
    }

    // Call the proxy instead of Europeana directly
    const response = await axios.get(EUROPEANA_BASE_URL, {
      params: {
        wskey: EUROPEANA_API_KEY,
        query: searchTerm,
        rows: pageSize,
        start: (page - 1) * pageSize + 1,
        qf: qfParams, // If multiple items in qfParams, Axios sends them as repeated ?qf=XXX
      },
    });

    console.log("Europeana Response:", response.data);

    // Map the returned items to your desired structure
    const artworks = response.data.items.map((item: any) => ({
      id: item.id,
      title: item.title?.[0] || "Untitled",
      imageUrl: item.edmPreview?.[0] || "",
      author: item.dataProvider?.[0] || "Unknown",
      date: item.year || "Unknown",
    }));

    console.log("Mapped Artworks:", artworks);
    return {
      artworks,
      totalResults: response.data.totalResults || 0,
    };
  } catch (error: any) {
    console.error("Error fetching from Europeana:", error.response?.data || error.message);
    return { artworks: [], totalResults: 0 };
  }
};

// Helper: Normalize the collection ID
const normalizeCollectionId = (rawId: string): string => {
  let id = rawId;
  if (id.includes("http")) {
    const parts = id.split("/");
    id = parts[parts.length - 1];
  }
  return id.replace(/[^a-zA-Z0-9-_]/g, "");
};

/**
 * Fetch a representative image for a collection using the Record API
 */
export const fetchRepresentativeImageForCollection = async (
  rawCollectionId: string,
  collectionTitle?: string
) => {
  const normalizedId = normalizeCollectionId(rawCollectionId);
  let imageUrl = "";
  try {
    // Query using the normalized collection ID
    const response = await axios.get(EUROPEANA_BASE_URL, {
      params: {
        wskey: EUROPEANA_API_KEY,
        qf: `collection:${normalizedId}`,
        rows: 1,
      },
    });
    if (response.data.items && response.data.items.length > 0) {
      const firstItem = response.data.items[0];
      imageUrl = firstItem.edmPreview?.[0] || "";
    }
  } catch (error: any) {
    console.error("Error fetching representative image with normalized id:", error.response?.data || error.message);
  }

  // If no image yet and collectionTitle is provided, try searching by title
  if (!imageUrl && collectionTitle) {
    try {
      const response = await axios.get(EUROPEANA_BASE_URL, {
        params: {
          wskey: EUROPEANA_API_KEY,
          query: collectionTitle,
          rows: 1,
        },
      });
      if (response.data.items && response.data.items.length > 0) {
        const firstItem = response.data.items[0];
        imageUrl = firstItem.edmPreview?.[0] || "";
      }
    } catch (error: any) {
      console.error("Error fetching representative image with collection title:", error.response?.data || error.message);
    }
  }
  return imageUrl;
};

/**
 * Fetch Europeana "Collections" based on a given queryParam
 */
export const fetchEuropeanaCollections = async (queryParam: string) => {
  try {
    console.log("Fetching Europeana collections for query:", queryParam);
    const response = await axios.get(EUROPEANA_BASE_URL, {
      params: {
        wskey: EUROPEANA_API_KEY,
        query: queryParam,
        qf: "TYPE:IMAGE", // Hard-coded example
        rows: 20,
      },
    });
    console.log("Europeana Collections Response:", response.data);

    // Map each collection, fetch a representative image for each
    const collectionsData = response.data.items.map(async (collection: any) => {
      const imageUrl = await fetchRepresentativeImageForCollection(
        collection.id,
        collection.title?.[0]
      );

      // Prefer an English description if available
      let description = "No description available";
      if (
        collection.dcDescriptionLangAware &&
        collection.dcDescriptionLangAware.en &&
        collection.dcDescriptionLangAware.en.length > 0
      ) {
        description = collection.dcDescriptionLangAware.en[0];
      } else if (collection.dcDescription && collection.dcDescription.length > 0) {
        description = collection.dcDescription[0]; // fallback
      }
      return {
        id: collection.id,
        title: collection.title?.[0] || "Untitled Collection",
        description,
        imageUrl,
      };
    });

    const collections = await Promise.all(collectionsData);
    return collections.filter((c) => c.description !== "No description available");
  } catch (error: any) {
    console.error("Error fetching collections from Europeana:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Fetch artworks for a specific Europeana collection via qf=collection:<ID>
 */
export const fetchEuropeanaCollectionArtworks = async (collectionId: string) => {
  try {
    const response = await axios.get<EuropeanaResponse>(EUROPEANA_BASE_URL, {
      params: {
        wskey: EUROPEANA_API_KEY,
        qf: `collection:${collectionId}`,
        rows: 48,
      },
    });

    return {
      artworks: response.data.items.map((item) => ({
        id: item.id,
        title: item.title,
        imageUrl: item.edmPreview?.[0] || "",
        author: item.dataProvider?.[0] || "Unknown",
        date: "",
      })),
      totalResults: response.data.totalResults,
    };
  } catch (error) {
    console.error("Error fetching collection artworks from Europeana:", error);
    throw error;
  }
};
