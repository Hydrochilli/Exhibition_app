import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Typography } from "@mui/material";
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
const GalleryDetail = () => {
    const { id } = useParams();
    const gallery = mockGallery; // Replace with API fetch later
    const [selectedImage, setSelectedImage] = useState(gallery.images[0]);
    return (_jsxs("div", { className: "container mx-auto p-4", children: [_jsx(Typography, { variant: "h4", align: "center", gutterBottom: true, children: gallery.name }), _jsxs(Card, { className: "shadow-lg p-4", children: [_jsx("img", { src: selectedImage.src, alt: selectedImage.title, className: "w-full max-h-[500px] object-contain mx-auto" }), _jsx(Typography, { align: "center", children: selectedImage.title })] }), _jsx(Slider, { slidesToShow: 3, infinite: true, centerMode: true, children: gallery.images.map((image) => (_jsx("img", { src: image.src, alt: image.title, className: "h-24 mx-2 cursor-pointer", onClick: () => setSelectedImage(image) }, image.id))) })] }));
};
export default GalleryDetail;
