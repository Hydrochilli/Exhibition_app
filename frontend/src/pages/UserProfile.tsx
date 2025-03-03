import React from "react";
import { Card, CardContent, Typography, Avatar, List, ListItem, Button } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const UserProfile: React.FC = () => {
  const { user } = useAuth(); // Assuming user context exists

  if (!user) return <div>Please log in to view your profile.</div>;

  return (
    <div className="container mx-auto p-4 grid gap-6">
      {/* User Info Card */}
      <Card className="p-4 shadow-lg">
        <CardContent>
          <Avatar src={user.avatarUrl} alt={user.username} sx={{ width: 80, height: 80, margin: "auto" }} />
          <Typography variant="h5" align="center" className="mt-2">{user.name || user.username}</Typography>
          <Typography variant="body1" align="center">{user.email}</Typography>
          <Typography variant="body2" align="center" color="textSecondary">{user.city || "Location not set"}</Typography>
          <Button component={Link} to="/edit-profile" variant="contained" color="primary" className="mt-3">Edit Profile</Button>
        </CardContent>
      </Card>

      {/* Saved Galleries Card */}
      <Card className="p-4 shadow-lg">
        <CardContent>
          <Typography variant="h6">Saved Galleries</Typography>
          {user.galleries.length > 0 ? (
            <List>
              {user.galleries.map((gallery) => (
                <ListItem key={gallery.id} component={Link} to={`/gallery/${gallery.id}`} className="hover:bg-gray-100 cursor-pointer">
                  {gallery.name}
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No galleries saved. <Link to="/curate">Start curating!</Link></Typography>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
