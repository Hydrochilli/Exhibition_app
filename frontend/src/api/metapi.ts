
import axios from "axios";

const MET_BASE_URL = "https://collectionapi.metmuseum.org/public/collection/v1";


 
export const searchMet = async (searchTerm: string) => {

  const { data: searchData } = await axios.get(`${MET_BASE_URL}/search`, {
    params: {
      q: searchTerm,
      hasImages: true,
    },
  });

  if (!searchData.objectIDs) return [];


  const limitedIDs = searchData.objectIDs.slice(0, 100);

  const results = [];
  for (const id of limitedIDs) {

    const { data: objData } = await axios.get(`${MET_BASE_URL}/objects/${id}`);

objData.primaryImage || "";
    if (!imageUrl && objData.additionalImages?.length) {
      imageUrl = objData.additionalImages[0];
    }

    results.push({
      id: String(objData.objectID),
      title: objData.title || "Untitled",
      author: objData.artistDisplayName || "Unknown",
      date: objData.objectDate || "",
      imageUrl,
      source: "MET" as const,
    });
  }
  return results;
};

export default searchMet;
