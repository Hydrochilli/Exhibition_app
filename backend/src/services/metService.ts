import fetch from "node-fetch";


type Artwork = {
  id: string;
  title: string;
  author: string;
  date: string;
  imageUrl: string;
  source: string;
};


function getDateRange(century: string): [number, number] {
  switch (century) {
    case "16": return [1500, 1599];
    case "17": return [1600, 1699];
    case "18": return [1700, 1799];
    case "19": return [1800, 1899];
    case "20": return [1900, 1999];
    case "21": return [2000, 2099];
    default:   return [0, 9999]; 
  }
}


async function fetchArtworkDetails(objectId: number): Promise<Artwork | null> {
  const detailUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`;

  try {
    const detailResp = await fetch(detailUrl);
    

    if (!detailResp.ok) {
      console.error(`MET API error ${detailResp.status}: ${detailResp.statusText}`);
      return null; 
    }

    const text = await detailResp.text();
    if (text.startsWith("<")) {
      console.error(`Invalid JSON response for object ${objectId}: Likely an HTML error page.`);
      return null;
    }

    const detailData = JSON.parse(text);
    
    return {
      id: String(detailData.objectID || objectId),
      title: detailData.title || "Untitled",
      author: detailData.artistDisplayName || "Unknown",
      date: detailData.objectDate || "",
      imageUrl: detailData.primaryImageSmall || "",
      source: "Met",
    };
  } catch (error) {
    console.error(`Error fetching object ${objectId}:`, error);
    return null;
  }
}



export async function fetchFromMet(
  searchTerm: string,
  century?: string,
  department?: string
): Promise<Artwork[]> {
  const url = new URL("https://collectionapi.metmuseum.org/public/collection/v1/search");
  url.searchParams.set("q", searchTerm);

  if (century) {
    const [begin, end] = getDateRange(century);
    url.searchParams.set("dateBegin", String(begin));
    url.searchParams.set("dateEnd", String(end));
  }


  if (department) {
    url.searchParams.set("departmentId", department);
  }

  try {
    const res = await fetch(url.toString());

    if (!res.ok) {
      throw new Error(`MET API error: ${res.status}`);
    }

    const data: { objectIDs?: number[] } = await res.json();

    if (!data.objectIDs || data.objectIDs.length === 0) {
      return []; 
    }

  
    const first100 = data.objectIDs.slice(0, 100);
    const artworkPromises = first100.map(fetchArtworkDetails);

    const artworks = await Promise.all(artworkPromises);

    
    return artworks.filter((art): art is Artwork => art !== null);
  } catch (error) {
    console.error("Error in fetchFromMet:", error);
    return []; 
  }
}

