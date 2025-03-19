import React from "react";
import { Link } from "react-router-dom";

type Artwork = {
  id: string;
  title: string;
  author: string;
  date: string;
  imageUrl: string;
  source: string;
 
};

const addToTemporaryCollection = (artwork: Artwork) => {
  let collection = JSON.parse(localStorage.getItem("temporaryCollection") || "[]");
  collection.push(artwork);
  localStorage.setItem("temporaryCollection", JSON.stringify(collection));
  alert("Added to Temporary Collection!");
};

const ArtworkCard: React.FC<{ artwork: Artwork }> = ({ artwork }) => {
  console.log("DEBUG: ArtworkCard rendering with:", artwork);

  return (
    <div className="border p-2 shadow-md rounded-lg transition-transform duration-200 hover:scale-105">
      <Link
        to={`/artwork/${artwork.id}`}
        state={{ source: artwork.source }}
        className="block"
      >
        {artwork.imageUrl ? (
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className="w-full h-48 object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            No Image
          </div>
        )}
        <h3 className="text-lg font-semibold mt-2">{artwork.title}</h3>
        <p className="text-sm text-gray-700">{artwork.author}</p>
        <p className="text-xs text-gray-500">{artwork.date}</p>
      </Link>

      <button
        className="mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        onClick={() => addToTemporaryCollection(artwork)}
      >
        Add to My Gallery
      </button>
    </div>
  );
};

export default ArtworkCard;
