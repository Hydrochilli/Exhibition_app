import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/CollectionCards.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchEuropeanaCollections } from "../api/europeanaApi";
const CollectionCards = () => {
    const [collections, setCollections] = useState([]);
    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const data = await fetchEuropeanaCollections("");
                console.log("Fetched collections:", data);
                setCollections(data);
            }
            catch (error) {
                console.error("Error fetching collections:", error);
            }
        };
        fetchCollections();
    }, []);
    return (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6", children: collections.map((collection) => {
            let collectionId = collection.id;
            if (collectionId.includes("http")) {
                const parts = collectionId.split("/");
                collectionId = parts[parts.length - 1];
            }
            collectionId = collectionId.replace(/[^a-zA-Z0-9-_]/g, "");
            return (_jsxs(Link, { to: `/collection/${collectionId}`, className: "block border rounded p-4 shadow-md hover:shadow-lg transition cursor-pointer", children: [_jsx("div", { className: "h-40 overflow-hidden", children: collection.imageUrl ? (_jsx("img", { src: collection.imageUrl, alt: collection.title, className: "w-full h-full object-cover" })) : (_jsx("div", { className: "w-full h-full bg-gray-300 flex items-center justify-center", children: _jsx("span", { children: "No Image" }) })) }), _jsx("h3", { className: "text-lg font-semibold mt-2", children: collection.title }), _jsx("p", { className: "text-sm text-gray-700", children: collection.description })] }, collection.id));
        }) }));
};
export default CollectionCards;
