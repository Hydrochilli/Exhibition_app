import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
const ArtworkCard = ({ artwork }) => {
    return (_jsx("div", { className: "border p-2 shadow-md rounded-lg", children: _jsxs(Link, { to: `/artwork/${artwork.id}`, state: { source: artwork.source }, className: "block", children: [artwork.imageUrl ? (_jsx("img", { src: artwork.imageUrl, alt: artwork.title, className: "w-full h-48 object-cover rounded-md" })) : (_jsx("div", { className: "w-full h-48 bg-gray-200 flex items-center justify-center", children: "No Image" })), _jsx("h3", { className: "text-lg font-semibold mt-2", children: artwork.title }), _jsx("p", { className: "text-sm text-gray-700", children: artwork.author }), _jsx("p", { className: "text-xs text-gray-500", children: artwork.date }), _jsxs("p", { className: "text-xs text-gray-400", children: ["Source: ", artwork.source] })] }) }));
};
export default ArtworkCard;
