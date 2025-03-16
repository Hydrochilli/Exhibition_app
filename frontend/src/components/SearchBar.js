import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
const SearchBar = ({ onSearch }) => {
    const [term, setTerm] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(term);
    };
    return (_jsxs(Box, { component: "form", onSubmit: handleSubmit, className: "flex flex-col items-center md:flex-row md:justify-center md:gap-4 my-4", children: [_jsx(TextField, { className: "mb-2 md:mb-0 w-full", label: "Search...", variant: "outlined", value: term, onChange: (e) => setTerm(e.target.value) }), _jsx(Button, { type: "submit", variant: "contained", className: "bg-green-700 hover:bg-green-800", children: "Search" })] }));
};
export default SearchBar;
