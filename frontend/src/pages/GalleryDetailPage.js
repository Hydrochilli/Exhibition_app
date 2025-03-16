import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from 'react-router-dom';
const GalleryDetailPage = () => {
    const { id } = useParams();
    return (_jsxs("div", { className: "container mx-auto p-4", children: [_jsx("h1", { className: "text-3xl font-bold", children: "Gallery Detail Page" }), _jsxs("p", { children: ["This is a placeholder for gallery with id: ", id] })] }));
};
export default GalleryDetailPage;
