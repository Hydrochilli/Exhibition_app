// unifySearch.ts
import { fetchFromMet, MetSearchOptions } from "../api/metApi";
import { fetchFromCleveland } from "../api/clevelandApi"; 
type Artwork = {
  id: string;
  title: string;
  author: string;
  date: string;
  imageUrl: string;
  source: string;
};

/**
 * fetchUnifiedSearch
 *  - Gathers results from MET and/or Cleveland based on `selectedApi`
 *  - Merges them into a single Artwork[] array
 * 
 * @param searchTerm  - The user's search text
 * @param century     - Optional century filter
 * @param department  - Optional department filter
 * @param selectedApi - "All" | "Met" | "Cleveland" (or undefined => treat as "All")
 */
export async function fetchUnifiedSearch(
  searchTerm: string,
  century?: string,
  department?: string,
  selectedApi?: string
): Promise<Artwork[]> {

  let metResults: Artwork[] = [];
  let clevelandResults: Artwork[] = [];

  // 1) If user wants "All" or "Met," call fetchFromMet
  if (!selectedApi || selectedApi === "All" || selectedApi === "Met") {
    // Build an object that matches `MetSearchOptions`
    const options: MetSearchOptions = {
      q: searchTerm,
      // Possibly set dateBegin/dateEnd if your fetchFromMet uses them
      // e.g. dateBegin: 1500, dateEnd: 1599
      // If you want images only, set hasImages: true
    };

    metResults = await fetchFromMet(options);
    
    // If fetchFromMet doesn't already set `.source = "Met"`, do:
    metResults = metResults.map(art => ({ ...art, source: "Met" }));
  }

  // 2) If user wants "All" or "Cleveland," call fetchClevelandSearch
  if (!selectedApi || selectedApi === "All" || selectedApi === "Cleveland") {
    const clevelandRaw = await fetchFromCleveland(searchTerm);
    // For consistency, map them to your Artwork shape
    clevelandResults = clevelandRaw.map(item => ({
      id: item.id,
      title: item.title || "Untitled",
      author: item.author || "Unknown",
      date:  item.date || "",
      imageUrl: item.imageUrl || "",
      source: "Cleveland",
    }));
  }

  // 3) Merge them
  const merged = [...metResults, ...clevelandResults];
  return merged;
}


