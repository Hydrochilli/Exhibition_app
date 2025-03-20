
import React, { useState, useEffect } from "react";
import { fetchEuropeanaCollections } from "../api/europeanaApi";
import { Link } from "react-router-dom";

type Collection = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
};

type CollectionGroupProps = {
  title: string;
  query: string;
};

const CollectionGroup: React.FC<CollectionGroupProps> = ({ title, query }) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchEuropeanaCollections(query);
        setCollections(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [query]);

  if (loading) return <div>Loading {title} collections...</div>;
  if (error) return <div>Error loading {title} collections: {error}</div>;

  const filteredCollections = collections.filter(
    (collection) =>
      collection.imageUrl && collection.imageUrl.trim() !== "" &&
      collection.description && collection.description.trim() !== "" &&
      collection.description !== "No description available"
  );

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCollections.map((collection) => {
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
                <img
                  src={collection.imageUrl}
                  alt={collection.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-lg font-semibold mt-2">{collection.title}</h4>
              <p className="text-sm text-gray-700">{collection.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CollectionGroup;
