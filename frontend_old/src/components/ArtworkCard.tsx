// src/components/ArtworkCard.tsx
import React from "react";

type ArtworkCardProps = {
  title: string;
  imageUrl: string;
  author: string;
  date: string;
};

const ArtworkCard: React.FC<ArtworkCardProps> = ({ title, imageUrl, author, date }) => {
  return (
    <div className="border rou2.2 Browse Artworks with Paginationnded p-2 shadow-sm flex flex-col items-center">
      <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      <h3 className="text-lg font-semibold mt-2">{title}</h3>
      <p className="text-sm text-gray-700">{author}</p>
      <p className="text-xs text-gray-500">{date}</p>
    </div>
  );
};

export default ArtworkCard;
