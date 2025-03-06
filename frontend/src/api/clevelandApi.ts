// src/api/clevelandApi.ts

export interface Artwork {
  id: string;
  title: string;
  author: string;
  date: string;
  imageUrl: string;
  source: string;
}

export async function fetchSingleClevelandArtwork(objectId: string): Promise<Artwork | null> {
  try {
    const url = `https://openaccess-api.clevelandart.org/api/artworks/${objectId}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Cleveland detail fetch error: ${res.status}`);
    }
    const json = await res.json();
    if (!json.data) {
      return null;
    }
    const item = json.data;

    // shape the result
    return {
      id: String(item.id),
      title: item.title || "Untitled",
      author: item.creators?.[0]?.description || item.creators?.[0]?.name || "Unknown",
      date: item.creation_date || "",
      imageUrl: item.images?.web?.url || "",
      source: "Cleveland",
    };
  } catch (err) {
    console.error("Error fetching single Cleveland item:", err);
    return null;
  }
}


interface ClevelandOptions {
  q: string;             
  has_image?: number;   
  minYear?: number;      
  maxYear?: number;      
}

export async function fetchFromCleveland(options: ClevelandOptions): Promise<Artwork[]> {
  
  const params = new URLSearchParams();

 
  params.set("q", options.q);

  
  if (options.has_image === 1) {
    params.set("has_image", "1");
  }

 
  if (options.minYear != null && options.maxYear != null) {
    params.set("minYear", String(options.minYear));
    params.set("maxYear", String(options.maxYear));
  }

 
  const url = `https://openaccess-api.clevelandart.org/api/artworks?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) {
    console.error("Cleveland fetch error", response.status);
    
    return [];
  }

  
  const data = await response.json();

 
  if (!data.data) {
    return [];
  }

  
  const artworks: Artwork[] = data.data.map((item: any) => {
   
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
      
    };
  });

  
  return artworks;
}
