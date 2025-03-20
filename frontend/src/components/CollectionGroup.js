import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { fetchEuropeanaCollections } from "../api/europeanaApi";
import { Link } from "react-router-dom";
const CollectionGroup = ({ title, query }) => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchEuropeanaCollections(query);
                setCollections(data);
            }
            catch (err) {
                setError(err.message);
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [query]);
    if (loading)
        return _jsxs("div", { children: ["Loading ", title, " collections..."] });
    if (error)
        return _jsxs("div", { children: ["Error loading ", title, " collections: ", error] });
    const filteredCollections = collections.filter((collection) => collection.imageUrl && collection.imageUrl.trim() !== "" &&
        collection.description && collection.description.trim() !== "" &&
        collection.description !== "No description available");
    return (_jsxs("div", { className: "mb-8", children: [_jsx("h3", { className: "text-2xl font-bold mb-4", children: title }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: filteredCollections.map((collection) => {
                    let collectionId = collection.id;
                    if (collectionId.includes("http")) {
                        const parts = collectionId.split("/");
                        collectionId = parts[parts.length - 1];
                    }
                    collectionId = collectionId.replace(/[^a-zA-Z0-9-_]/g, "");
                    return (_jsxs(Link, { to: `/collection/${collectionId}`, className: "block border rounded p-4 shadow-md hover:shadow-lg transition cursor-pointer", children: [_jsx("div", { className: "h-40 overflow-hidden", children: _jsx("img", { src: collection.imageUrl, alt: collection.title, className: "w-full h-full object-cover" }) }), _jsx("h4", { className: "text-lg font-semibold mt-2", children: collection.title }), _jsx("p", { className: "text-sm text-gray-700", children: collection.description })] }, collection.id));
                }) })] }));
};
export default CollectionGroup;
