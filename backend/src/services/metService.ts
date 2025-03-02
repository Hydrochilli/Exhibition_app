// src/services/metService.ts

// 1) Define the Artwork type inline
type Artwork = {
    id: string;
    title: string;
    author: string;
    date: string;
    imageUrl: string;
    source: string;
  };
  
  // 2) Provide a function to interpret the century as date ranges
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
  
  /**
   * fetchFromMet
   * Fetches search data from the Met's API, optionally using century and department,
   * returns an array of Artwork objects
   */
  export async function fetchFromMet(
    searchTerm: string,
    century?: string,
    department?: string
  ): Promise<Artwork[]> {
    // 3) Dynamically import node-fetch (if you're forced to use CommonJS)
    const { default: fetch } = await import("node-fetch");
  
    // 4) Build the base search URL
    const url = new URL("https://collectionapi.metmuseum.org/public/collection/v1/search");
    url.searchParams.set("q", searchTerm);
  
    // 5) If century is given, we set dateBegin/dateEnd
    if (century) {
      const [begin, end] = getDateRange(century);
      url.searchParams.set("dateBegin", String(begin));
      url.searchParams.set("dateEnd", String(end));
    }
  
    // 6) If department is given, we set departmentId
    if (department) {
      url.searchParams.set("departmentId", department);
    }
  
    // 7) Perform the search
    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error(`MET API error: ${res.status}`);
    }
  
    // 8) The search response: has objectIDs?
    const data: { objectIDs?: number[] } = await res.json();
  
    if (!data.objectIDs || data.objectIDs.length === 0) {
      return []; // no results
    }
  
    // 9) For each object ID, fetch detail. Limit to 50 for performance
    const first50 = data.objectIDs.slice(0, 50);
    const results: Artwork[] = [];
  
    for (const objectId of first50) {
      const detailUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`;
      const detailResp = await fetch(detailUrl);
      if (!detailResp.ok) {
        continue;
      }
  
      // We'll cast to `any` or partial type, since we can't be certain
      // what the MET returns. We'll just pick out the fields we need.
      const detailData: any = await detailResp.json();
  
      // 10) Build the Artwork object
      results.push({
        id: String(detailData.objectID || objectId),
        title: detailData.title || "Untitled",
        author: detailData.artistDisplayName || "Unknown",
        date: detailData.objectDate || "",
        imageUrl: detailData.primaryImageSmall || "",
        source: "Met",
      });
    }
  
    return results;
  }
  
