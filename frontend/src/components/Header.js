import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
const Header = () => {
    const { user, logout } = useAuth();
    return (_jsxs("header", { className: "flex justify-between p-4 bg-gray-900 text-white", children: [_jsx(Link, { to: "/", className: "text-xl font-bold", children: "Exhibition App" }), _jsxs("nav", { className: "flex items-center gap-4", children: [_jsx(Link, { to: "/temporary-collection", className: "px-4 py-2 bg-gray-700 text-white rounded", children: "Temporary Collection" }), user ? (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/profile", className: "hover:underline", children: "My Collections" }), _jsx("button", { onClick: logout, className: "bg-red-500 px-3 py-1 rounded hover:bg-red-700", children: "Logout" })] })) : (_jsx(_Fragment, { children: _jsx(Link, { to: "/login", className: "hover:underline", children: "Login" }) })), _jsx(Link, { to: "/register", className: "hover/underline", children: "Register" })] })] }));
};
export default Header;
