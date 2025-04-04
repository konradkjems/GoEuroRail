"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Navbar;
const link_1 = __importDefault(require("next/link"));
const outline_1 = require("@heroicons/react/24/outline");
function Navbar() {
    return (React.createElement("nav", { className: "bg-blue-600 p-4 shadow-md" },
        React.createElement("div", { className: "max-w-7xl mx-auto flex justify-between items-center" },
            React.createElement(link_1.default, { href: "/", className: "text-white font-bold text-xl flex items-center" },
                React.createElement(outline_1.MapIcon, { className: "h-6 w-6 mr-2" }),
                "Interrail Planner"),
            React.createElement("div", { className: "flex space-x-4" },
                React.createElement(link_1.default, { href: "/", className: "text-white hover:text-blue-200 flex items-center" },
                    React.createElement(outline_1.HomeIcon, { className: "h-5 w-5 mr-1" }),
                    React.createElement("span", null, "Home")),
                React.createElement(link_1.default, { href: "/trips/new", className: "text-white hover:text-blue-200 flex items-center" },
                    React.createElement(outline_1.PlusIcon, { className: "h-5 w-5 mr-1" }),
                    React.createElement("span", null, "New Trip"))))));
}
//# sourceMappingURL=Navbar.js.map