
export interface Artwork {
  id: string;
  title: string;
  author: string;
  date: string;
  imageUrl: string;
  source: string;
}

export interface MetSearchOptions {
  q: string;          
  hasImages?: boolean; 
  dateBegin?: number;  
  dateEnd?: number;
}

export async function fetchFromMet(options: MetSearchOptions): Promise<Artwork[]> {
 
  const params = new URLSearchParams();
  params.set("q", options.q);
  if (options.hasImages) {
    params.set("hasImages", "true");
  }
  if (typeof options.dateBegin === "number" && typeof options.dateEnd === "number") {
    params.set("dateBegin", options.dateBegin.toString());
    params.set("dateEnd", options.dateEnd.toString());
  }

  
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

  
  const artworks: Artwork[] = [];
  for (const objectId of searchData.objectIDs.slice(0, 50)) { 

    const detailUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`;
    const detailRes = await fetch(detailUrl);
    if (!detailRes.ok) continue;
    const detailData = await detailRes.json() as any;

    
    const art: Artwork = {
      id: String(detailData.objectID),
      title: detailData.title || "Untitled",
      author: detailData.artistDisplayName || "Unknown",
      date: detailData.objectDate || "",
      imageUrl: detailData.primaryImageSmall || "",
      source: "MET",
      
    };

    artworks.push(art);
  }

  return artworks;
}
// metApi.ts
export async function fetchSingleArtwork(objectId: string): Promise<Artwork | null> {
  const detailUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`;
  const detailRes = await fetch(detailUrl);
  if (!detailRes.ok) {
    throw new Error(`MET detail fetch error: ${detailRes.status}`);
  }
  const detailData = await detailRes.json();
  return {
    id: String(detailData.objectID),
    title: detailData.title || "Untitled",
    author: detailData.artistDisplayName || "Unknown",
    date: detailData.objectDate || "",
    imageUrl: detailData.primaryImageSmall || "",
    source: "Met",
  };
}
