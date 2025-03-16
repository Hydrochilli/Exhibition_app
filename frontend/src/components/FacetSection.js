import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const FacetSection = ({ title, items }) => {
    return (_jsxs("div", { className: "border p-4 rounded shadow mb-6", children: [_jsx("h3", { className: "text-xl font-bold mb-4", children: title }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: items.map((item) => (_jsx("div", { className: "p-2 border rounded hover:bg-gray-100 cursor-pointer", children: _jsx("span", { className: "font-semibold", children: item.title }) }, item.id))) })] }));
};
export default FacetSection;
