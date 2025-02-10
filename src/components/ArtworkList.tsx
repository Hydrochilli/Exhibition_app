// src/components/ArtworkList.tsx
import React from "react";
import ArtworkCard from "./ArtworkCard";
import PaginationControls from "./PaginationControls";

type Artwork = {
  id: string; // or number
  title: string;
  imageUrl: string;
  author: string;
  date: string;
};

type ArtworkListProps = {
  artworks: Artwork[];
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

const ArtworkList: React.FC<ArtworkListProps> = ({
  artworks,
  currentPage,
  totalPages,
  onPrev,
  onNext
}) => {
  return (
    <div>
      {/* Grid of Artworks */}
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

      {/* Pagination */}
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
