import fetch from "node-fetch";

// Define the Artwork type inline
type Artwork = {
  id: string;
  title: string;
  author: string;
  date: string;
  imageUrl: string;
  source: string;
};

// Function to interpret the century as date ranges
function getDateRange(century: string): [number, number] {
  switch (century) {
    case "16": return [1500, 1599];
    case "17": return [1600, 1699];
    case "18": return [1700, 1799];
    case "19": return [1800, 1899];
    case "20": return [1900, 1999];
    case "21": return [2000, 2099];
    default:   return [0, 9999]; // No filter applied
  }
}

/**
 * Fetch artwork details from the MET API.
 */
async function fetchArtworkDetails(objectId: number): Promise<Artwork | null> {
  const detailUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`;

  try {
    const detailResp = await fetch(detailUrl);
    
    // Check if the response is OK
    if (!detailResp.ok) {
      console.error(`MET API error ${detailResp.status}: ${detailResp.statusText}`);
      return null; // Skip invalid responses
    }

    // Ensure response is valid JSON before parsing
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

/**
 * Fetches search data from the MET API using optional filters.
 */
export async function fetchFromMet(
  searchTerm: string,
  century?: string,
  department?: string
): Promise<Artwork[]> {
  const url = new URL("https://collectionapi.metmuseum.org/public/collection/v1/search");
  url.searchParams.set("q", searchTerm);

  // Apply century filter
  if (century) {
    const [begin, end] = getDateRange(century);
    url.searchParams.set("dateBegin", String(begin));
    url.searchParams.set("dateEnd", String(end));
  }

  // Apply department filter
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
      return []; // No results found
    }

    // Fetch details for first 100 objects for better performance
    const first100 = data.objectIDs.slice(0, 100);
    const artworkPromises = first100.map(fetchArtworkDetails);

    // Fetch all artworks in parallel
    const artworks = await Promise.all(artworkPromises);

    // Remove any null results from failed requests
    return artworks.filter((art): art is Artwork => art !== null);
  } catch (error) {
    console.error("Error in fetchFromMet:", error);
    return []; // Ensure function always returns an array
  }
}

