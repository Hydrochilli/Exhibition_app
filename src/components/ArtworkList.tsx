//src/components/ArtworkList.tsx

import React from "react";
import ArtworkCard from "./ArtworkCard";
import PaginationControls from "./PaginationControls";

type Artwork = {
  id: string;
  title: string;
  imageUrl: string;
  author: string;
  date: string;
};

type ArtworkListProps = {
  artworks?: Artwork[]; // ✅ Make artworks optional to prevent undefined errors
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

const ArtworkList: React.FC<ArtworkListProps> = ({
  artworks = [], // ✅ Default to an empty array
  currentPage,
  totalPages,
  onPrev,
  onNext
}) => {
  if (!artworks.length) {
    return <p className="text-center text-gray-500">No artworks found.</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {artworks.map((art) => (
          <ArtworkCard
            key={art.id}
            title={art.title}
            imageUrl={art.imageUrl}
            author={art.author}
            date={art.date}
          />
        ))}
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={onPrev}
        onNext={onNext}
      />
    </div>
  );
};

export default ArtworkList;
