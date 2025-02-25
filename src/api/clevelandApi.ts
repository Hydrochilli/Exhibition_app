// src/api/clevelandApi.ts

import axios from "axios";
import { Artwork } from "./metApi"; // Reuse the same Artwork interface

/**
 * Cleveland Museum of Art open-access API.
 * Docs: https://openaccess-api.clevelandart.org/
 */
const CLEVELAND_BASE_URL = "https://openaccess-api.clevelandart.org/api/artworks";

export const searchCleveland = async (searchTerm: string): Promise<Artwork[]> => {
    const { data } = await axios.get(CLEVELAND_BASE_URL, {
      params: {
        q: searchTerm,
        limit: 100,
        has_image: 1,
      },
    });
  
    if (!data.data || !Array.isArray(data.data)) return [];
  
    return data.data.map((record: any) => {
      let imageUrl = "";
  
      // 1) Check main images object
      if (record.images?.web?.url) {
        imageUrl = record.images.web.url;
      } else if (record.images?.print?.url) {
        imageUrl = record.images.print.url;
      } else if (record.images?.full?.url) {
        imageUrl = record.images.full.url; // caution: might be TIF
      }
  
      // 2) If still empty, look at alternate_images
      if (!imageUrl && record.alternate_images?.length) {
        // Just pick the first alt image for demonstration
        const alt = record.alternate_images[0];
        if (alt.web?.url) {
          imageUrl = alt.web.url;
        } else if (alt.print?.url) {
          imageUrl = alt.print.url;
        } else if (alt.full?.url) {
          imageUrl = alt.full.url;
        }
      }
  
      return {
        id: String(record.id),
        title: record.title || "Untitled",
        imageUrl,
        author:
          record.creators && record.creators.length
            ? record.creators[0].description
            : "Unknown",
        date: record.creation_date || "",
        source: "CLEVELAND" as const,
      };
    });
  };
  