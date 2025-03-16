import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { curatedCategories } from '../data/curatedCategories';
import { Link } from 'react-router-dom';
const CategoryCard = ({ category }) => {
    return (_jsxs(Link, { to: `/search?query=${encodeURIComponent(category.query)}`, className: "border rounded overflow-hidden shadow hover:shadow-lg transition", children: [_jsx("div", { className: "h-40 overflow-hidden", children: _jsx("img", { src: category.imageUrl, alt: category.title, className: "w-full h-full object-cover" }) }), _jsxs("div", { className: "p-4", children: [_jsx("h3", { className: "text-lg font-semibold", children: category.title }), _jsx("p", { className: "text-sm text-gray-600 mt-2", children: category.description })] })] }));
};
const MainCategory = ({ category }) => {
    const subcategories = category.subcategories || [];
    const displayedSubcategories = subcategories.slice(0, 4);
    const hasMore = subcategories.length > 4;
    return (_jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-2", children: category.title }), _jsx("p", { className: "text-gray-700 mb-4", children: category.description }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: displayedSubcategories.map((subcat) => (_jsx(CategoryCard, { category: subcat }, subcat.id))) }), hasMore && (_jsx("div", { className: "mt-4 text-right", children: _jsxs(Link, { to: `/category/${category.id}`, className: "text-blue-600 hover:underline", children: ["More ", category.title] }) }))] }));
};
const CuratedCategories = () => {
    return (_jsx("div", { className: "mb-8", children: curatedCategories.map((cat) => (_jsx(MainCategory, { category: cat }, cat.id))) }));
};
export default CuratedCategories;
