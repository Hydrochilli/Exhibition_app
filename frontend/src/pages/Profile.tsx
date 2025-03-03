// src/pages/Profile.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

type Gallery = {
  id: string;
  title: string;
  thumbnail: string;
};

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:3001/api/galleries/user`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setGalleries(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching galleries:", err);
          setLoading(false);
        });
    }
  }, [user]);

  if (!user) return <p className="text-center mt-6">Please log in to view your profile.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold text-center mb-6">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Profile Card */}
        <div className="border p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-3">User Profile</h2>
          <div className="flex items-center gap-4">
            <img
              src={user.avatarUrl || "https://via.placeholder.com/100"}
              alt="User Avatar"
              className="w-20 h-20 rounded-full border"
            />
            <div>
              <p className="font-semibold">{user.username}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">{user.city || "Location not set"}</p>
            </div>
          </div>
        </div>

        {/* My Galleries Card */}
        <div className="border p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-3">My Collections</h2>
          {loading ? (
            <p>Loading your galleries...</p>
          ) : galleries.length === 0 ? (
            <p>No collections yet. <Link to="/" className="text-blue-500">Start curating</Link></p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {galleries.map((gallery) => (
                <Link to={`/gallery/${gallery.id}`} key={gallery.id} className="border p-2 rounded-lg shadow hover:shadow-lg">
                  <img src={gallery.thumbnail || "https://via.placeholder.com/150"} alt={gallery.title} className="w-full h-32 object-cover rounded" />
                  <p className="text-sm text-center font-semibold mt-2">{gallery.title}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
