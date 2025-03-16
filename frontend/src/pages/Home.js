import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import SearchBar from "../components/SearchBar";
import CuratedCategories from "../components/CuratedCategories";
import GalleriesSection from "../components/GalleriesSection";
import SearchResults from "../components/SearchResults";
const FiltersSection = ({ century, onCenturyChange, department, onDepartmentChange, selectedApi, onApiChange, onApply, }) => {
    return (_jsxs("div", { className: "flex flex-col md:flex-row gap-4 justify-center my-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block mb-1 font-semibold", children: "Century" }), _jsxs("select", { value: century, onChange: (e) => onCenturyChange(e.target.value), className: "border rounded p-1", children: [_jsx("option", { value: "", children: "All" }), _jsx("option", { value: "16", children: "16th Century (1500\u20131599)" }), _jsx("option", { value: "17", children: "17th Century (1600\u20131699)" }), _jsx("option", { value: "18", children: "18th Century (1700\u20131799)" }), _jsx("option", { value: "19", children: "19th Century (1800\u20131899)" }), _jsx("option", { value: "20", children: "20th Century (1900\u20131999)" }), _jsx("option", { value: "21", children: "21st Century (2000\u20132100)" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-1 font-semibold", children: "Department" }), _jsxs("select", { value: department, onChange: (e) => onDepartmentChange(e.target.value), className: "border rounded p-1", children: [_jsx("option", { value: "", children: "All" }), _jsx("option", { value: "European Painting", children: "European Painting" }), _jsx("option", { value: "Greek and Roman Art", children: "Greek and Roman Art" }), _jsx("option", { value: "Islamic Art", children: "Islamic Art" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-1 font-semibold", children: "Source" }), _jsxs("select", { value: selectedApi, onChange: (e) => onApiChange(e.target.value), className: "border rounded p-1", children: [_jsx("option", { value: "All", children: "All APIs" }), _jsx("option", { value: "Met", children: "The Met" }), _jsx("option", { value: "Cleveland", children: "Cleveland" })] })] }), _jsx("div", { className: "flex items-end", children: _jsx("button", { onClick: onApply, className: "px-4 py-2 bg-green-700 text-white rounded", children: "Apply Filters" }) })] }));
};
const Home = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [century, setCentury] = useState("");
    const [department, setDepartment] = useState("");
    const [selectedApi, setSelectedApi] = useState("All");
    const [query, setQuery] = useState("");
    const handleSearch = (term) => {
        setSearchTerm(term);
    };
    const applyFilters = () => {
        setQuery(searchTerm.trim());
    };
    return (_jsxs("div", { className: "container mx-auto p-4", children: [_jsx(SearchBar, { onSearch: handleSearch }), _jsx(FiltersSection, { century: century, onCenturyChange: setCentury, department: department, onDepartmentChange: setDepartment, selectedApi: selectedApi, onApiChange: setSelectedApi, onApply: applyFilters }), query ? (_jsx(SearchResults, { searchTerm: query, century: century, department: department, selectedApi: selectedApi })) : searchTerm ? (_jsx(SearchResults, { searchTerm: searchTerm })) : (_jsxs(_Fragment, { children: [_jsx(CuratedCategories, {}), _jsx(GalleriesSection, {})] }))] }));
};
export default Home;
