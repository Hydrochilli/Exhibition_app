// src/components/EntitySuggestions.tsx
import React, { useState, useEffect } from "react";
import { fetchEntitySuggestions } from "../api/europeanaEntityApi";

type Entity = {
  id: string;
  prefLabel?: string | { [lang: string]: string[] | string };
  note?: string | { [lang: string]: string[] | string };
  thumbnail?: string;
};

type EntitySuggestionsProps = {
  query: string;
  title: string;
};

const EntitySuggestions: React.FC<EntitySuggestionsProps> = ({ query, title }) => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const data = await fetchEntitySuggestions(query);
        console.log(`Fetched suggestions for "${query}":`, data);
        
        setEntities(data.items || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, [query]);

  if (loading) return <div>Loading {title}...</div>;
  if (error) return <div>Error loading {title}: {error}</div>;

  return (
    <div className="border p-4 rounded shadow mb-6">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {entities.map((entity) => {
          // Extract the description (used as the title) from prefLabel
          let displayDescription = "No Title";
          if (entity.prefLabel) {
            if (typeof entity.prefLabel === "string") {
              displayDescription = entity.prefLabel;
            } else if (entity.prefLabel.en) {
              displayDescription = Array.isArray(entity.prefLabel.en)
                ? entity.prefLabel.en[0]
                : entity.prefLabel.en;
            }
          }
          // Extract the note as the short description beneath
          let displayNote = "";
          if (entity.note) {
            if (typeof entity.note === "string") {
              displayNote = entity.note;
            } else if (entity.note.en) {
              displayNote = Array.isArray(entity.note.en)
                ? entity.note.en[0]
                : entity.note.en;
            }
          }
          const thumbnailUrl = entity.thumbnail || "https://via.placeholder.com/150";

          return (
            <div
              key={entity.id}
              className="flex flex-col h-full border rounded hover:bg-gray-100 cursor-pointer"
            >
              <img
                src={thumbnailUrl}
                alt={displayDescription}
                className="w-full h-32 object-cover"
              />
              <div className="p-2 flex flex-col">
                {/* Display the description (title) at the top */}
                <div className="font-semibold text-center">
                  {displayDescription}
                </div>
                {/* Display the note beneath */}
                {displayNote && (
                  <div className="text-sm text-gray-600 mt-1 text-center">
                    {displayNote.length > 100
                      ? displayNote.substring(0, 100) + "..."
                      : displayNote}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EntitySuggestions;

