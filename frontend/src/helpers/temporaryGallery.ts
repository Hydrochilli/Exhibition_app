// src/helpers/temporaryGallery.ts

// 1) Define or import an Artwork interface
// If you already have an Artwork type elsewhere, you can import it instead.
interface Artwork {
    id: string;
    title: string;
    author: string;
    date: string;
    imageUrl: string;
    source: string;
    description: string;
  }
  

  export const addToTemporaryGallery = (artwork: Artwork) => {
    let gallery: Artwork[] = JSON.parse(localStorage.getItem("temporaryCollection") || "[]");
  
    // to prevent duplicates:
    if (!gallery.some((item: Artwork) => item.id === artwork.id)) {
      gallery.push(artwork);
      localStorage.setItem("temporaryCollection", JSON.stringify(gallery));
    }
  };
  