import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { fetchEntitySuggestions } from "../api/europeanaEntityApi";
const EntitySuggestions = ({ query, title }) => {
    const [entities, setEntities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const data = await fetchEntitySuggestions(query);
                console.log(`Fetched suggestions for "${query}":`, data);
                setEntities(data.items || []);
            }
            catch (err) {
                setError(err.message);
            }
            finally {
                setLoading(false);
            }
        };
        fetchSuggestions();
    }, [query]);
    if (loading)
        return _jsxs("div", { children: ["Loading ", title, "..."] });
    if (error)
        return _jsxs("div", { children: ["Error loading ", title, ": ", error] });
    return (_jsxs("div", { className: "border p-4 rounded shadow mb-6", children: [_jsx("h3", { className: "text-xl font-bold mb-4", children: title }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: entities.map((entity) => {
                    let displayDescription = "No Title";
                    if (entity.prefLabel) {
                        if (typeof entity.prefLabel === "string") {
                            displayDescription = entity.prefLabel;
                        }
                        else if (entity.prefLabel.en) {
                            displayDescription = Array.isArray(entity.prefLabel.en)
                                ? entity.prefLabel.en[0]
                                : entity.prefLabel.en;
                        }
                    }
                    let displayNote = "";
                    if (entity.note) {
                        if (typeof entity.note === "string") {
                            displayNote = entity.note;
                        }
                        else if (entity.note.en) {
                            displayNote = Array.isArray(entity.note.en)
                                ? entity.note.en[0]
                                : entity.note.en;
                        }
                    }
                    const thumbnailUrl = entity.thumbnail || "https://via.placeholder.com/150";
                    return (_jsxs("div", { className: "flex flex-col h-full border rounded hover:bg-gray-100 cursor-pointer", children: [_jsx("img", { src: thumbnailUrl, alt: displayDescription, className: "w-full h-32 object-cover" }), _jsxs("div", { className: "p-2 flex flex-col", children: [_jsx("div", { className: "font-semibold text-center", children: displayDescription }), displayNote && (_jsx("div", { className: "text-sm text-gray-600 mt-1 text-center", children: displayNote.length > 100
                                            ? displayNote.substring(0, 100) + "..."
                                            : displayNote }))] })] }, entity.id));
                }) })] }));
};
export default EntitySuggestions;
