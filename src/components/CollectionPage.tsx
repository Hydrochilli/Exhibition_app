// src/pages/CollectionPage.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchEuropeanaCollectionArtworks } from "../api/europeanaApi";
import { fetchMetArtworksPage } from "../api/metApi";
import ArtworkList from "./ArtworkList";

const CollectionPage: React.FC = () => {
  const { collectionId } = useParams();
  const [collectionArtworks, setCollectionArtworks] = useState<any[]>([]);
  const [relatedArtworks, setRelatedArtworks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const data = await fetchEuropeanaCollectionArtworks(collectionId);
        setCollectionArtworks(data.artworks);
        if (data.artworks.length > 0) {
          setSearchQuery(data.artworks[0].title || data.artworks[0].author);
        }
      } catch (error) {
        console.error("Error fetching collection artworks:", error);
      }
    };

    fetchArtworks();
  }, [collectionId]);

  useEffect(() => {
    if (!searchQuery) return;
    const fetchRelatedArtworks = async () => {
      try {
        const data = await fetchMetArtworksPage(searchQuery, 1, 10);
        setRelatedArtworks(data.artworks);
      } catch (error) {
        console.error("Error fetching related artworks:", error);
      }
    };

    fetchRelatedArtworks();
  }, [searchQuery]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Collection Artworks</h1>
      <ArtworkList artworks={collectionArtworks} currentPage={1} totalPages={1} onPrev={() => {}} onNext={() => {}} />
      
      <h2 className="text-xl font-semibold mt-8">Related Works from Other Museums</h2>
      <ArtworkList artworks={relatedArtworks} currentPage={1} totalPages={1} onPrev={() => {}} onNext={() => {}} />
    </div>
  );
};

export default CollectionPage;
