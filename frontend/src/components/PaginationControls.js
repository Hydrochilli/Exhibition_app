import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const PaginationControls = ({ currentPage, totalPages, onPrev, onNext, }) => {
    return (_jsxs("div", { className: "flex justify-center items-center mt-6 space-x-2", children: [_jsx("button", { className: "px-3 py-2 bg-gray-200 rounded disabled:opacity-50", onClick: onPrev, disabled: currentPage === 1, children: "\u25C0 Prev" }), _jsxs("span", { className: "px-4 py-2 text-lg font-semibold", children: ["Page ", currentPage, " of ", totalPages] }), _jsx("button", { className: "px-3 py-2 bg-gray-200 rounded disabled:opacity-50", onClick: onNext, disabled: currentPage === totalPages, children: "Next \u25B6" })] }));
};
export default PaginationControls;
