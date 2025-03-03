import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Avatar, List, ListItem, Button } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

type Gallery = {
  id: string;
  title: string;
  description: string;
  created_at: string;
};

const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    async function fetchGalleries() {
      try {
        console.log(`Fetching galleries for user ID: ${user.id}`);
        
        const response = await fetch(`http://localhost:3001/api/galleries/user/${user.id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Fetch error:", errorText);
          throw new Error(`Failed to fetch galleries: ${errorText}`);
        }

        const data = await response.json();
        console.log("Galleries received:", data);
        setGalleries(data);
      } catch (err: any) {
        console.error("Error fetching galleries:", err);
        setError(err.message || "Could not load collections.");
      } finally {
        setLoading(false);
      }
    }

    fetchGalleries();
  }, [user]);

  if (!user) return <div>Please log in to view your profile.</div>;

  return (
    <div className="container mx-auto p-4 grid gap-6">
      {/* User Info Card */}
      <Card className="p-4 shadow-lg">
        <CardContent className="text-center">
          <Avatar src={user.avatarUrl} alt={user.username} sx={{ width: 80, height: 80, margin: "auto" }} />
          <Typography variant="h5" className="mt-2">{user.name || user.username}</Typography>
          <Typography variant="body1">{user.email}</Typography>
          <Typography variant="body2" color="textSecondary">{user.city || "Location not set"}</Typography>
          <Button component={Link} to="/edit-profile" variant="contained" color="primary" className="mt-3">Edit Profile</Button>
        </CardContent>
      </Card>

      {/* Saved Galleries Card */}
      <Card className="p-4 shadow-lg">
        <CardContent>
          <Typography variant="h6">My Collections</Typography>

          {loading ? (
            <Typography color="textSecondary">Loading galleries...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : galleries.length > 0 ? (
            <List>
              {galleries.map((gallery) => (
                <ListItem key={gallery.id} component={Link} to={`/gallery/${gallery.id}`} className="hover:bg-gray-100 cursor-pointer">
                  <Typography>{gallery.title}</Typography>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>
              No collections yet. <Link to="/">Start curating!</Link>
            </Typography>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
