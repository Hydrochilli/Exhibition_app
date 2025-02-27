// src/api/metApi.ts
import { Artwork } from "./ArtworkTypes"; 
// Or wherever your Artwork interface lives

/** Options object for MET search */
export interface MetSearchOptions {
  q: string;           // search term
  hasImages?: boolean; // if user wants only items with images
  dateBegin?: number;  // e.g. 1800
  dateEnd?: number;    // e.g. 1899
}

/** Minimal example of a fetchFromMet function. 
 *  This fetches the object IDs from /search and returns an array of Artwork. 
 */
export async function fetchFromMet(options: MetSearchOptions): Promise<Artwork[]> {
  // 1) Build your query string
  const params = new URLSearchParams();
  params.set("q", options.q);
  if (options.hasImages) {
    params.set("hasImages", "true");
  }
  if (typeof options.dateBegin === "number" && typeof options.dateEnd === "number") {
    params.set("dateBegin", options.dateBegin.toString());
    params.set("dateEnd", options.dateEnd.toString());
  }

  // 2) Hit the MET search endpoint
  const searchUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?${params.toString()}`;
  const searchRes = await fetch(searchUrl);
  if (!searchRes.ok) {
    console.error("MET search error", searchRes.status);
    return [];
  }

  const searchData = await searchRes.json() as {
    objectIDs?: number[];
    total: number;
  };

  if (!searchData.objectIDs || searchData.objectIDs.length === 0) {
    return [];
  }

  // 3) For each object ID, fetch detail
  const artworks: Artwork[] = [];
  for (const objectId of searchData.objectIDs.slice(0, 50)) { 
    // Limit to 50 to avoid huge fetch loops, or adjust as you like
    const detailUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`;
    const detailRes = await fetch(detailUrl);
    if (!detailRes.ok) continue;
    const detailData = await detailRes.json() as any;

    // 4) Construct your Artwork object
    const art: Artwork = {
      id: String(detailData.objectID),
      title: detailData.title || "Untitled",
      author: detailData.artistDisplayName || "Unknown",
      date: detailData.objectDate || "",
      imageUrl: detailData.primaryImageSmall || "",
      source: "MET",
      // If you want to handle your century logic or other fields, do it here
    };

    artworks.push(art);
  }

  return artworks;
}
