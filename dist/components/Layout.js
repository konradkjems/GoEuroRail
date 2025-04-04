"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Layout;
const link_1 = __importDefault(require("next/link"));
const react_1 = require("react");
const outline_1 = require("@heroicons/react/24/outline");
const navigation_1 = require("next/navigation");
function Layout({ children }) {
    const [isLoggedIn, setIsLoggedIn] = (0, react_1.useState)(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = (0, react_1.useState)(false);
    const pathname = (0, navigation_1.usePathname)();
    const isActive = (path) => pathname === path;
    return (React.createElement("div", { className: "flex flex-col h-screen" },
        React.createElement("header", { className: "bg-white shadow relative z-20" },
            React.createElement("div", { className: "container mx-auto px-4 py-4 flex justify-between items-center" },
                React.createElement(link_1.default, { href: "/", className: "text-xl font-bold text-[#264653] flex items-center" },
                    React.createElement("img", { src: "/logo.svg", alt: "GoEuroRail Logo", className: "w-8 h-8 mr-2" }),
                    React.createElement("span", null,
                        React.createElement("span", { className: "text-[#264653]" }, "Go"),
                        React.createElement("span", { className: "text-[#06D6A0]" }, "Euro"),
                        React.createElement("span", { className: "text-[#FFD166]" }, "Rail"))),
                React.createElement("nav", { className: "hidden md:flex space-x-4" },
                    React.createElement(link_1.default, { href: "/", className: `nav-link flex items-center text-[#264653] hover:text-[#06D6A0] ${isActive('/') ? 'text-[#06D6A0]' : ''}` },
                        React.createElement(outline_1.HomeIcon, { className: "h-4 w-4 mr-1" }),
                        React.createElement("span", null, "Home")),
                    React.createElement(link_1.default, { href: "/trips", className: `nav-link flex items-center text-[#264653] hover:text-[#06D6A0] ${isActive('/trips') ? 'text-[#06D6A0]' : ''}` },
                        React.createElement(outline_1.MapIcon, { className: "h-4 w-4 mr-1" }),
                        React.createElement("span", null, "My Trips")),
                    React.createElement(link_1.default, { href: "/trips/new", className: "px-3 py-1 bg-[#FFD166] text-[#264653] rounded hover:bg-[#FFC233] flex items-center" },
                        React.createElement(outline_1.PlusIcon, { className: "h-4 w-4 mr-1" }),
                        React.createElement("span", null, "New Trip"))),
                React.createElement("div", { className: "md:hidden" },
                    React.createElement("button", { onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen), className: "text-[#264653] hover:text-[#06D6A0] transition-colors", "aria-label": "Toggle mobile menu" },
                        React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                            React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 12h16M4 18h16" }))))),
            isMobileMenuOpen && (React.createElement("div", { className: "md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-50" },
                React.createElement("div", { className: "container mx-auto px-4 py-2 space-y-2" },
                    React.createElement(link_1.default, { href: "/", className: `block py-2 text-[#264653] hover:text-[#06D6A0] ${isActive('/') ? 'text-[#06D6A0]' : ''}`, onClick: () => setIsMobileMenuOpen(false) },
                        React.createElement("div", { className: "flex items-center" },
                            React.createElement(outline_1.HomeIcon, { className: "h-4 w-4 mr-2" }),
                            React.createElement("span", null, "Home"))),
                    React.createElement(link_1.default, { href: "/trips", className: `block py-2 text-[#264653] hover:text-[#06D6A0] ${isActive('/trips') ? 'text-[#06D6A0]' : ''}`, onClick: () => setIsMobileMenuOpen(false) },
                        React.createElement("div", { className: "flex items-center" },
                            React.createElement(outline_1.MapIcon, { className: "h-4 w-4 mr-2" }),
                            React.createElement("span", null, "My Trips"))),
                    React.createElement(link_1.default, { href: "/trips/new", className: "block py-2 px-3 bg-[#FFD166] text-[#264653] rounded hover:bg-[#FFC233]", onClick: () => setIsMobileMenuOpen(false) },
                        React.createElement("div", { className: "flex items-center" },
                            React.createElement(outline_1.PlusIcon, { className: "h-4 w-4 mr-2" }),
                            React.createElement("span", null, "New Trip"))))))),
        React.createElement("main", { className: "flex-1 overflow-auto" }, children)));
}
//# sourceMappingURL=Layout.js.map