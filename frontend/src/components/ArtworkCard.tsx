// ArtworkCard.tsx
import React from "react";
import { Link } from "react-router-dom";

type Artwork = {
  id: string;
  title: string;
  author: string;
  date: string;
  imageUrl: string;
  source: string; // "Met" | "Cleveland" etc.
};

type Props = {
  artwork: Artwork;
};

const ArtworkCard: React.FC<Props> = ({ artwork }) => {
  return (
    <div className="border p-2 shadow-md rounded-lg">
      {/* We only want one <Link> wrapper. */}
      <Link
        to={`/artwork/${artwork.id}`}
        state={{ source: artwork.source }} // pass the source in router state
        className="block"
      >
        {artwork.imageUrl ? (
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className="w-full h-48 object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">No Image</div>
        )}
        <h3 className="text-lg font-semibold mt-2">{artwork.title}</h3>
        <p className="text-sm text-gray-700">{artwork.author}</p>
        <p className="text-xs text-gray-500">{artwork.date}</p>
        <p className="text-xs text-gray-400">Source: {artwork.source}</p>
      </Link>
    </div>
  );
};

export default ArtworkCard;
