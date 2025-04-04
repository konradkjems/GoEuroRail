"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TestPage;
const link_1 = __importDefault(require("next/link"));
function TestPage() {
    return (React.createElement("div", { className: "p-8" },
        React.createElement("h1", { className: "text-2xl font-bold mb-4" }, "Test Page"),
        React.createElement("p", { className: "mb-4" }, "If you can see this page, Next.js routing is working correctly."),
        React.createElement(link_1.default, { href: "/", className: "text-blue-500 hover:underline" }, "Go back to home")));
}
//# sourceMappingURL=page.js.map