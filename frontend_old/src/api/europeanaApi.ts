import axios from "axios";

const EUROPEANA_BASE_URL = "http://localhost:3001/api/europeana"; 
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



export const fetchEuropeanaArtworks = async (
  searchTerm: string,
  page: number,
  pageSize: number,
  typeFilter?: string,
  centuryFilter?: string
) => {
  try {
    console.log(`Fetching artworks for searchTerm: "${searchTerm}"...`);

  
    const qfParams: string[] = [];

    if (typeFilter) {
      qfParams.push(`TYPE:${typeFilter}`);
    }

  
    if (centuryFilter) {
     
      qfParams.push(`plnCentury:${centuryFilter}`);
    }


    const response = await axios.get(EUROPEANA_BASE_URL, {
      params: {
        wskey: EUROPEANA_API_KEY,
        query: searchTerm,
        rows: pageSize,
        start: (page - 1) * pageSize + 1,
        qf: qfParams, 
      },
    });

    console.log("Europeana Response:", response.data);

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


const normalizeCollectionId = (rawId: string): string => {
  let id = rawId;
  if (id.includes("http")) {
    const parts = id.split("/");
    id = parts[parts.length - 1];
  }
  return id.replace(/[^a-zA-Z0-9-_]/g, "");
};


export const fetchRepresentativeImageForCollection = async (
  rawCollectionId: string,
  collectionTitle?: string
) => {
  const normalizedId = normalizeCollectionId(rawCollectionId);
  let imageUrl = "";
  try {
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

export const fetchEuropeanaCollections = async (queryParam: string) => {
  try {
    console.log("Fetching Europeana collections for query:", queryParam);
    const response = await axios.get(EUROPEANA_BASE_URL, {
      params: {
        wskey: EUROPEANA_API_KEY,
        query: queryParam,
        qf: "TYPE:IMAGE", 
        rows: 20,
      },
    });
    console.log("Europeana Collections Response:", response.data);


    const collectionsData = response.data.items.map(async (collection: any) => {
      const imageUrl = await fetchRepresentativeImageForCollection(
        collection.id,
        collection.title?.[0]
      );

      let description = "No description available";
      if (
        collection.dcDescriptionLangAware &&
        collection.dcDescriptionLangAware.en &&
        collection.dcDescriptionLangAware.en.length > 0
      ) {
        description = collection.dcDescriptionLangAware.en[0];
      } else if (collection.dcDescription && collection.dcDescription.length > 0) {
        description = collection.dcDescription[0]; 
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
