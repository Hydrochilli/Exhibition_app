// src/api/clevelandApi.ts

import { Artwork } from "./ArtworkTypes"; // or wherever your Artwork interface/ type is

/** Example options matching the parameters you might pass from unifySearch.ts */
interface ClevelandOptions {
  q: string;             // search term
  has_image?: number;    // 1 if we only want records with images
  minYear?: number;      // e.g. 1800
  maxYear?: number;      // e.g. 1899
}

export async function fetchFromCleveland(options: ClevelandOptions): Promise<Artwork[]> {
  // 1) Build a URL with the query parameters
  const params = new URLSearchParams();

  // "q" param is the main search term
  params.set("q", options.q);

  // If user wants images only, Cleveland uses has_image=1
  if (options.has_image === 1) {
    params.set("has_image", "1");
  }

  // For century filtering, e.g. 19th => 1800–1899
  // CMA uses minYear / maxYear (in their advanced queries).
  // If not supported in your version of the API, remove or do client-side filtering.
  if (options.minYear != null && options.maxYear != null) {
    params.set("minYear", String(options.minYear));
    params.set("maxYear", String(options.maxYear));
  }

  // 2) Make the request
  const url = `https://openaccess-api.clevelandart.org/api/artworks?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) {
    console.error("Cleveland fetch error", response.status);
    // Return an empty array to avoid returning undefined
    return [];
  }

  // 3) Parse the JSON; CMA returns an object with a 'data' array
  const data = await response.json();

  // Usually CMA's response structure is something like:
  // { data: [...], info: { ... }, ... }
  // We'll check if data.data exists
  if (!data.data) {
    return [];
  }

  // 4) Map each item in data.data to your Artwork structure
  const artworks: Artwork[] = data.data.map((item: any) => {
    // "creators" is an array of { description: string, role: string }, etc.
    const author = item.creators && item.creators.length
      ? item.creators[0].description
      : "Unknown";

    const imageUrl = item.images && item.images.web
      ? item.images.web.url
      : "";

    return {
      id: String(item.id),
      title: item.title || "Untitled",
      author,
      date: item.creation_date || "",
      imageUrl,
      source: "Cleveland",
      // any other fields you need
    };
  });

  // Make sure we return the array, not undefined
  return artworks;
}
