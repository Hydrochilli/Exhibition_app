import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
const addToTemporaryCollection = (artwork) => {
    let collection = JSON.parse(localStorage.getItem("temporaryCollection") || "[]");
    collection.push(artwork);
    localStorage.setItem("temporaryCollection", JSON.stringify(collection));
    alert("Added to Temporary Collection!");
};
const ArtworkCard = ({ artwork }) => {
    console.log("DEBUG: ArtworkCard rendering with:", artwork);
    return (_jsxs("div", { className: "border p-2 shadow-md rounded-lg transition-transform duration-200 hover:scale-105", children: [_jsxs(Link, { to: `/artwork/${artwork.id}`, state: { source: artwork.source }, className: "block", children: [artwork.imageUrl ? (_jsx("img", { src: artwork.imageUrl, alt: artwork.title, className: "w-full h-48 object-cover rounded-md" })) : (_jsx("div", { className: "w-full h-48 bg-gray-200 flex items-center justify-center", children: "No Image" })), _jsx("h3", { className: "text-lg font-semibold mt-2", children: artwork.title }), _jsx("p", { className: "text-sm text-gray-700", children: artwork.author }), _jsx("p", { className: "text-xs text-gray-500", children: artwork.date })] }), _jsx("button", { className: "mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition", onClick: () => addToTemporaryCollection(artwork), children: "Add to My Gallery" })] }));
};
export default ArtworkCard;
