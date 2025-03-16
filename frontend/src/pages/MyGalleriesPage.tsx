// src/pages/MyGalleriesPage.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";


type Artwork = {
  id: string;
  title: string;
  author: string;
  date: string;
  imageUrl: string;
  source: string;
};

type Gallery = {
  id: string;
  name: string;
  artworks: Artwork[];
};

export default function MyGalleriesPage() {
  const { user } = useAuth();
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [newGalleryName, setNewGalleryName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
   
    async function loadGalleries() {
      if (!user?.token) return;
      try {
        const res = await fetch("/api/galleries", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load galleries");
        setGalleries(data.galleries || []);
      } catch (err: any) {
        setError(err.message);
      }
    }
    loadGalleries();
  }, [user]);

  async function handleCreateGallery() {
    if (!user?.token || !newGalleryName.trim()) return;
    try {
      const res = await fetch("/api/galleries", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newGalleryName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create gallery");
      setGalleries([...galleries, data.gallery]);
      setNewGalleryName("");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-6 p-4">
      <h2 className="text-2xl font-bold mb-4">My Galleries</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border p-2 flex-1"
          value={newGalleryName}
          onChange={(e) => setNewGalleryName(e.target.value)}
          placeholder="New Gallery Name"
        />
        <button
          onClick={handleCreateGallery}
          className="bg-green-700 text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </div>

      {galleries.map((gal) => (
        <div key={gal.id} className="border rounded p-3 mb-4">
          <h3 className="text-xl font-semibold mb-2">{gal.name}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gal.artworks.map((art) => (
              <div key={art.id} className="border p-2">
                <p className="font-semibold">{art.title}</p>
                <p>{art.author}</p>
                <p className="text-sm text-gray-500">{art.date}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
