import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

type Artwork = {
  id: string;
  title: string;
  author: string;
  date: string;
  imageUrl: string;
  source: string;
};

const TemporaryCollection: React.FC = () => {
  const [collection, setCollection] = useState<Artwork[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load collection from localStorage
  useEffect(() => {
    const storedCollection = JSON.parse(localStorage.getItem("temporaryCollection") || "[]");
    setCollection(storedCollection);
  }, []);

  // Remove artwork from collection
  const removeItem = (id: string) => {
    const updatedCollection = collection.filter((artwork) => artwork.id !== id);
    setCollection(updatedCollection);
    localStorage.setItem("temporaryCollection", JSON.stringify(updatedCollection));
  };

  // Save collection to "My Collections"
  const saveToMyCollections = async () => {
    if (!user || !user.token) {
      alert("You need to log in to save your collection.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/galleries/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          title: "My Gallery",
          description: "A collection of my favorite artworks",
          artworks: collection.map((art) => ({
            id: art.id,
            title: art.title,
            author: art.author,
            date: art.date,
            imageUrl: art.imageUrl,
            source: art.source,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save gallery");
      }

      alert("Your collection has been saved!");
      localStorage.removeItem("temporaryCollection");
      setCollection([]);

      // Force refresh of user galleries in profile
      navigate("/profile");
    } catch (error) {
      console.error("Error saving gallery:", error);
      alert("Error saving collection.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold">Temporary Collection</h2>

      {collection.length === 0 ? (
        <p className="text-gray-500 mt-4">No items added yet.</p>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {collection.map((art) => (
              <div key={art.id} className="border p-2 shadow-md rounded-lg">
                {art.imageUrl ? (
                  <img src={art.imageUrl} alt={art.title} className="w-full h-48 object-cover rounded-md" />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">No Image</div>
                )}
                <h3 className="text-lg font-semibold mt-2">{art.title}</h3>
                <p className="text-sm text-gray-700">{art.author}</p>
                <p className="text-xs text-gray-500">{art.date}</p>
                <p className="text-xs text-gray-400">Source: {art.source}</p>

                {/* Remove Button */}
                <button
                  className="mt-2 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
                  onClick={() => removeItem(art.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Save to My Collections Button */}
          <div className="mt-6 text-center">
            <button
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
              onClick={saveToMyCollections}
            >
              Save to My Collections
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemporaryCollection;

