import NodeCache = require("node-cache");

import { fetchFromMet } from "./metService";
import { fetchFromCleveland } from "./clevelandService";

const searchCache = new NodeCache({ stdTTL: 300, maxKeys: 20 });


type Artwork = {
  id: string;
  title: string;
  author: string;
  date: string;
  imageUrl: string;
  source: string;
};

export async function getSearchResults(
  searchTerm: string,
  century?: string,
  department?: string,
  apiSource?: string
): Promise<Artwork[]> {
  
  const key = `${searchTerm}_${century}_${department}_${apiSource}`;


  const cached = searchCache.get<Artwork[]>(key);
  if (cached) {
    console.log("Returning cached results for:", key);
    return cached;
  }

  
  let metResults: Artwork[] = [];
  let clevelandResults: Artwork[] = [];

  if (apiSource === "Met") {
    metResults = await fetchFromMet(searchTerm, century, department);
  } else if (apiSource === "Cleveland") {
    clevelandResults = await fetchFromCleveland(searchTerm, century, department);
  } else {
 
    [metResults, clevelandResults] = await Promise.all([
      fetchFromMet(searchTerm, century, department),
      fetchFromCleveland(searchTerm, century, department),
    ]);
  }


  let combined = [...metResults, ...clevelandResults];

 
  combined = strictFilter(combined, century, department);


  searchCache.set(key, combined);

  return combined;
}


function strictFilter(
  artworks: Artwork[],
  century?: string,
  department?: string
): Artwork[] {
  let result = artworks;
  if (century) {
    
    const [begin, end] = getDateRange(century);
    result = result.filter((art) => {
     
     
      return true; 
    });
  }
  if (department) {
  
    result = result.filter((art) => {
     
      return true;
    });
  }
  return result;
}

function getDateRange(century: string): [number, number] {
  switch (century) {
    case "16":
      return [1500, 1599];
    case "17":
      return [1600, 1699];
    case "18":
      return [1700, 1799];
    case "19":
      return [1800, 1899];
    // etc.
    default:
      return [0, 9999];
  }
}
