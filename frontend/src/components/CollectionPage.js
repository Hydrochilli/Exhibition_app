import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { searchMet } from "../api/metApi";
import { fetchEuropeanaCollectionArtworks } from "../api/europeanaApi";
import ArtworkList from "./ArtworkList";
const CollectionPage = () => {
    const { collectionId } = useParams();
    const [collectionArtworks, setCollectionArtworks] = useState([]);
    const [relatedArtworks, setRelatedArtworks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    useEffect(() => {
        const fetchArtworks = async () => {
            try {
                if (!collectionId)
                    return;
                const data = await fetchEuropeanaCollectionArtworks(collectionId);
                setCollectionArtworks(data.artworks);
                if (data.artworks.length > 0) {
                    setSearchQuery(data.artworks[0].title || data.artworks[0].author);
                }
            }
            catch (error) {
                console.error("Error fetching collection artworks:", error);
            }
        };
        fetchArtworks();
    }, [collectionId]);
    useEffect(() => {
        if (!searchQuery)
            return;
        const fetchRelatedArtworks = async () => {
            try {
                const data = await searchMet({ q: searchQuery });
                setRelatedArtworks(data);
            }
            catch (error) {
                console.error("Error fetching related artworks:", error);
            }
        };
        fetchRelatedArtworks();
    }, [searchQuery]);
    return (_jsxs("div", { className: "container mx-auto p-4", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Collection Artworks" }), _jsx(ArtworkList, { artworks: collectionArtworks, currentPage: 1, totalPages: 1, onPrev: () => { }, onNext: () => { } }), _jsx("h2", { className: "text-xl font-semibold mt-8", children: "Related Works from Other Museums" }), _jsx(ArtworkList, { artworks: relatedArtworks, currentPage: 1, totalPages: 1, onPrev: () => { }, onNext: () => { } })] }));
};
export default CollectionPage;
