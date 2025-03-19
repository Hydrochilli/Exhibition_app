export async function searchMet(options) {
    const artworks = []; // initialize explicitly
    const params = new URLSearchParams();
    params.set("q", options.q);
    if (options.hasImages)
        params.set("hasImages", "true");
    if (options.dateBegin)
        params.set("dateBegin", options.dateBegin.toString());
    if (options.dateEnd)
        params.set("dateEnd", options.dateEnd.toString());
    const searchUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?${params.toString()}`;
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) {
        console.error("MET search error", searchRes.status);
        return [];
    }
    const searchData = await searchRes.json();
    if (!searchData.objectIDs || searchData.objectIDs.length === 0)
        return [];
    for (const objectId of searchData.objectIDs.slice(0, 50)) {
        const detailUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`;
        const detailRes = await fetch(detailUrl);
        if (!detailRes.ok)
            continue;
        const obj = await detailRes.json();
        // ✅ Integrated imageUrl fix explicitly here:
        const imageUrl = obj.primaryImageSmall || obj.primaryImage || "";
        const art = {
            id: objectId.toString(),
            title: obj.title || "Untitled",
            author: obj.artistDisplayName || "Unknown",
            date: obj.objectDate || "",
            imageUrl, // ✅ Corrected and explicitly defined
            source: "MET",
            description: obj.description,
        };
        artworks.push(art);
    }
    return artworks;
}
// Fetch single artwork explicitly corrected:
export async function fetchSingleArtwork(objectId) {
    const detailUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`;
    const detailRes = await fetch(detailUrl);
    if (!detailRes.ok) {
        console.error(`MET artwork detail error ${detailRes.status}`);
        return null;
    }
    const obj = await detailRes.json();
    const imageUrl = obj.primaryImageSmall || obj.primaryImage || "";
    return {
        id: objectId,
        title: obj.title || "Untitled",
        author: obj.artistDisplayName || "Unknown",
        date: obj.objectDate || "",
        imageUrl,
        source: "Met",
        description: obj.creditLine || obj.inscriptions || obj.objectName || "No description available."
    };
}
http: ; //localhost:5173/artwork/127573
