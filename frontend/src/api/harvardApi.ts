
import axios from "axios";

const HARVARD_BASE_URL = "https://api.harvardartmuseums.org";


export const searchHarvard = async (searchTerm: string) => {

 
  const { data: searchData } = await axios.get(`${HARVARD_BASE_URL}/object`, {
    params: {
      apikey: "YOUR_HARVARD_KEY",
      title: searchTerm,   
      size: 20,            
      hasimage: 1,         
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