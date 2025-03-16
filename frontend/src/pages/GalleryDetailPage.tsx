import React from 'react';
import { useParams } from 'react-router-dom';

const GalleryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Gallery Detail Page</h1>
      <p>This is a placeholder for gallery with id: {id}</p>
    </div>
  );
};

export default GalleryDetailPage;
