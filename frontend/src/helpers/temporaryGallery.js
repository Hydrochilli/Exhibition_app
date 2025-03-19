// src/helpers/temporaryGallery.ts
export const addToTemporaryGallery = (artwork) => {
    let gallery = JSON.parse(localStorage.getItem("temporaryCollection") || "[]");
    // to prevent duplicates:
    if (!gallery.some((item) => item.id === artwork.id)) {
        gallery.push(artwork);
        localStorage.setItem("temporaryCollection", JSON.stringify(gallery));
    }
};
