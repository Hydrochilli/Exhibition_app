import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ArtworkCard from "./ArtworkCard";
import PaginationControls from "./PaginationControls";
const ArtworkList = ({ artworks = [], currentPage, totalPages, onPrev, onNext }) => {
    if (!artworks.length) {
        return _jsx("p", { className: "text-center text-gray-500", children: "No artworks found." });
    }
    return (_jsxs("div", { children: [_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: artworks.map((art) => (_jsx(ArtworkCard, { artwork: art }, art.id))) }), _jsx(PaginationControls, { currentPage: currentPage, totalPages: totalPages, onPrev: onPrev, onNext: onNext })] }));
};
export default ArtworkList;
