import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, Typography } from "@mui/material";
import Slider from "react-slick"; 
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 

const mockGallery = {
  id: "1",
  name: "Renaissance Paintings",
  images: [
    { id: "a", src: "https://example.com/image1.jpg", title: "Mona Lisa" },
    { id: "b", src: "https://example.com/image2.jpg", title: "The Last Supper" },
    { id: "c", src: "https://example.com/image3.jpg", title: "Starry Night" }
  ]
};

const GalleryDetail: React.FC = () => {
  const { id } = useParams();
  const gallery = mockGallery; // Replace with API fetch later
  const [selectedImage, setSelectedImage] = useState(gallery.images[0]);

  return (
    <div className="container mx-auto p-4">
      <Typography variant="h4" align="center" gutterBottom>{gallery.name}</Typography>

     
      <Card className="shadow-lg p-4">
        <img src={selectedImage.src} alt={selectedImage.title} className="w-full max-h-[500px] object-contain mx-auto" />
        <Typography align="center">{selectedImage.title}</Typography>
      </Card>

   
      <Slider slidesToShow={3} infinite centerMode>
        {gallery.images.map((image) => (
          <img 
            key={image.id}
            src={image.src}
            alt={image.title}
            className="h-24 mx-2 cursor-pointer"
            onClick={() => setSelectedImage(image)}
          />
        ))}
      </Slider>
    </div>
  );
};

export default GalleryDetail;
