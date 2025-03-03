// src/services/clevelandService.ts
import fetch, { Response } from "node-fetch";


type Artwork = {
  id: string;
  title: string;
  author: string;
  date: string;
  imageUrl: string;
  source: string;
};

export async function fetchFromCleveland(
  searchTerm: string,
  century?: string,
  department?: string
): Promise<Artwork[]> {
  // Build query similarly
  const url = new URL("https://openaccess-api.clevelandart.org/api/artworks");
  url.searchParams.set("q", searchTerm);
  // if century => do minYear, maxYear, etc.
  // if department => do department or textual approach
  // ...
  
  const resp = await fetch(url.toString());
  if (!resp.ok) {
    console.error("Cleveland search error:", resp.status);
    return [];
  }
  const data = await resp.json();
  if (!data.data) {
    return [];
  }

  const results = data.data.slice(0, 50).map((item: any) => {
    return {
      id: String(item.id),
      title: item.title || "Untitled",
      author: item.creators?.[0]?.description || "Unknown",
      date: item.creation_date || "",
      imageUrl: item.images?.web?.url || "",
      source: "Cleveland",
    } as Artwork;
  });
  return results;
}
