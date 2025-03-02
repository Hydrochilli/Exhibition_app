// src/services/cacheService.ts
import NodeCache = require("node-cache");
 // or a custom structure
import { fetchFromMet } from "./metService";
import { fetchFromCleveland } from "./clevelandService";

const searchCache = new NodeCache({ stdTTL: 300, maxKeys: 20 });
// ^ maxKeys: 20 => store up to 20 unique searches, FIFO or LRU (node-cache is LRU-like)

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
  // Build a cache key
  const key = `${searchTerm}_${century}_${department}_${apiSource}`;

  // Check if we have a cache hit
  const cached = searchCache.get<Artwork[]>(key);
  if (cached) {
    console.log("Returning cached results for:", key);
    return cached;
  }

  // Otherwise, fetch from APIs
  let metResults: Artwork[] = [];
  let clevelandResults: Artwork[] = [];

  if (apiSource === "Met") {
    metResults = await fetchFromMet(searchTerm, century, department);
  } else if (apiSource === "Cleveland") {
    clevelandResults = await fetchFromCleveland(searchTerm, century, department);
  } else {
    // "All"
    [metResults, clevelandResults] = await Promise.all([
      fetchFromMet(searchTerm, century, department),
      fetchFromCleveland(searchTerm, century, department),
    ]);
  }

  // Merge
  let combined = [...metResults, ...clevelandResults];

  // Additional final filter if you want to strictly enforce date or department
  // e.g. if century=19 => only keep items strictly 1800-1899
  combined = strictFilter(combined, century, department);

  // Store in cache
  searchCache.set(key, combined);

  return combined;
}

// Example of a final strict filter function
function strictFilter(
  artworks: Artwork[],
  century?: string,
  department?: string
): Artwork[] {
  let result = artworks;
  if (century) {
    // parse century -> date range
    const [begin, end] = getDateRange(century); // implement
    result = result.filter((art) => {
      // if we have art date info
      // for simplicity, skip or parse in detail
      return true; // your logic here
    });
  }
  if (department) {
    // filter out ones that don't match department
    result = result.filter((art) => {
      // compare art.department with user selection
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
