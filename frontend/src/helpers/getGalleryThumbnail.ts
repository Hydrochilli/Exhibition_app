// src/helpers/getGalleryThumbnail.ts
const getGalleryThumbnail = (gallery: any): string => {
    console.log("Gallery object in getGalleryThumbnail:", gallery);
    // Check for a direct thumbnail property.
    if (gallery.thumbnail && typeof gallery.thumbnail === "string" && gallery.thumbnail.trim() !== "") {
      console.log("Using gallery.thumbnail:", gallery.thumbnail);
      return gallery.thumbnail;
    }
    // Check if gallery.isShownBy exists and has a thumbnail.
    if (gallery.isShownBy) {
      if (typeof gallery.isShownBy === "object") {
        if (
          gallery.isShownBy.thumbnail &&
          typeof gallery.isShownBy.thumbnail === "string" &&
          gallery.isShownBy.thumbnail.trim() !== ""
        ) {
          console.log("Using gallery.isShownBy.thumbnail:", gallery.isShownBy.thumbnail);
          return gallery.isShownBy.thumbnail;
        }
      } else if (typeof gallery.isShownBy === "string" && gallery.isShownBy.trim() !== "") {
        console.log("Using gallery.isShownBy as string:", gallery.isShownBy);
        return gallery.isShownBy;
      }
    }
    console.log("No thumbnail found for gallery id:", gallery.id);
    return "";
  };
  
  export default getGalleryThumbnail;
  