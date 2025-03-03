import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

type Gallery = {
  id: string;
  title: string;
  description: string;
  created_at: string;
};

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [galleries, setGalleries] = useState<Gallery[]>([]);

  useEffect(() => {
    if (!user) return;

    async function fetchGalleries() {
      try {
        const response = await fetch(`http://localhost:3001/api/galleries/user/${user.id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch galleries");

        const data = await response.json();
        setGalleries(data);
      } catch (error) {
        console.error("Error fetching galleries:", error);
      }
    }

    fetchGalleries();
  }, [user]); // Refresh when user logs in

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold">User Profile</h2>
      <p><strong>Username:</strong> {user?.username}</p>
      <p><strong>Email:</strong> {user?.email}</p>

      <h2 className="text-xl font-semibold mt-6">My Collections</h2>
      {galleries.length === 0 ? (
        <p className="text-gray-500">
          No collections yet.{" "}
          <Link to="/" className="text-blue-600 hover:underline">
            Start curating!
          </Link>
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {galleries.map((gallery) => (
            <div key={gallery.id} className="border p-4 shadow-md rounded-lg">
              <h3 className="text-lg font-semibold">{gallery.title}</h3>
              <p className="text-sm text-gray-600">{gallery.description}</p>
              <p className="text-xs text-gray-400">
                Created: {new Date(gallery.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
