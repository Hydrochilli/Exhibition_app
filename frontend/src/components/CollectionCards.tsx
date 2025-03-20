import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchEuropeanaCollections } from "../api/europeanaApi";

const CollectionCards: React.FC = () => {
  const [collections, setCollections] = useState<any[]>([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await fetchEuropeanaCollections("");
        console.log("Fetched collections:", data);
        setCollections(data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };

    fetchCollections();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
      {collections.map((collection) => {
        let collectionId = collection.id;
        if (collectionId.includes("http")) {
          const parts = collectionId.split("/");
          collectionId = parts[parts.length - 1];
        }
        collectionId = collectionId.replace(/[^a-zA-Z0-9-_]/g, "");

        return (
          <Link
            key={collection.id}
            to={`/collection/${collectionId}`}
            className="block border rounded p-4 shadow-md hover:shadow-lg transition cursor-pointer"
          >
            <div className="h-40 overflow-hidden">
              {collection.imageUrl ? (
                <img
                  src={collection.imageUrl}
                  alt={collection.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <span>No Image</span>
                </div>
              )}
            </div>
            <h3 className="text-lg font-semibold mt-2">{collection.title}</h3>
            <p className="text-sm text-gray-700">{collection.description}</p>
          </Link>
        );
      })}
    </div>
  );
};

export default CollectionCards;
