// 2) harvardApi.ts
import axios from "axios";

const HARVARD_BASE_URL = "https://api.harvardartmuseums.org";

// You need an API key for Harvard: https://github.com/Harvard-Art-Museums/api-docs
// e.g., let HARVARD_KEY = "secretkey123"

export const searchHarvard = async (searchTerm: string) => {
  // Search objects endpoint: GET /object
  // Docs: https://github.com/Harvard-Art-Museums/api-docs
  const { data: searchData } = await axios.get(`${HARVARD_BASE_URL}/object`, {
    params: {
      apikey: "YOUR_HARVARD_KEY",
      title: searchTerm,    // or 'keyword' if you want broader searching
      size: 20,            // page size
      hasimage: 1,         // only objects with an image
    },
  });

  if (!searchData.records) return [];

  return searchData.records.map((record: any) => ({
    id: String(record.id),
    title: record.title || "Untitled",
    imageUrl: record.primaryimageurl || "",
    author: record.people?.[0]?.name || "Unknown",
    date: record.dated || "",
    source: "HARVARD" as const,
  }));
};
export default searchHarvard