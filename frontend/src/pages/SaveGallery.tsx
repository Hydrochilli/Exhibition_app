import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const SaveGallery = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const saveGallery = async () => {
    const collection = JSON.parse(localStorage.getItem("temporaryCollection") || "[]")

    if (collection.length === 0) return alert("No items to save!");

    const response = await fetch("http://localhost:3001/api/gallery/create", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${user?.token}` },
      body: JSON.stringify({ title, description, artworks: collection }),
    });

    if (response.ok) {
      localStorage.removeItem("temporaryCollection"); // Clear after saving
      alert("Gallery Saved!");
      navigate("/profile"); // Redirect to user profile
    } else {
      alert("Failed to save gallery.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold">Save Your Collection</h2>
      <input
        type="text"
        placeholder="Gallery Title"
        className="border p-2 w-full mt-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Gallery Description"
        className="border p-2 w-full mt-2"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded" onClick={saveGallery}>
        Save to My Collections
      </button>
    </div>
  );
};

export default SaveGallery;
