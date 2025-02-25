// src/api/unifySearch.ts

import { Artwork } from "./metApi";       // shared interface
import { searchMet } from "./metApi";
import { searchCleveland } from "./clevelandApi";

/**
 * Unified search for The Met + Cleveland Museum.
 */
export const fetchUnifiedSearch = async (searchTerm: string): Promise<Artwork[]> => {
  // Call both in parallel
  const [metResults, cmaResults] = await Promise.all([
    searchMet(searchTerm),
    searchCleveland(searchTerm),
  ]);

  // Merge them into one array
  const combined = [...metResults, ...cmaResults];

  // Sort by title, or do any other logic
  combined.sort((a, b) => a.title.localeCompare(b.title));

  return combined;
};
