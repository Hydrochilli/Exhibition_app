import { searchMet, MetSearchOptions } from "../api/metApi";
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

 * @param searchTerm  
 * @param century     
 * @param department  
 * @param selectedApi 
 */
export async function fetchUnifiedSearch(
  searchTerm: string,
  century?: string,
  department?: string,
  selectedApi?: string
): Promise<Artwork[]> {

  let metResults: Artwork[] = [];
  let clevelandResults: Artwork[] = [];

 
  if (!selectedApi || selectedApi === "All" || selectedApi === "Met") {
  
    const options: MetSearchOptions = {
      q: searchTerm,
     
    };

    metResults = await searchMet(options);
    
   
    metResults = metResults.map(art => ({ ...art, source: "Met" }));
  }

 
  if (!selectedApi || selectedApi === "All" || selectedApi === "Cleveland") {
      const clevelandRaw = await fetchFromCleveland({q: searchTerm});
  
    clevelandResults = clevelandRaw.map(item => ({
      id: item.id,
      title: item.title || "Untitled",
      author: item.author || "Unknown",
      date:  item.date || "",
      imageUrl: item.imageUrl || "",
      source: "Cleveland",
    }));
  }


  const merged = [...metResults, ...clevelandResults];
  return merged;
}


