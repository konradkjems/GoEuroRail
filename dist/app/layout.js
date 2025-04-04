"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
const google_1 = require("next/font/google");
require("./globals.css");
const inter = (0, google_1.Inter)({ subsets: ["latin"] });
exports.metadata = {
    title: 'GoEuroRail - Plan Your European Rail Adventure',
    description: 'Plan and organize your rail trip across Europe with GoEuroRail. Create itineraries, add stops, and visualize your journey on an interactive map.',
    icons: {
        icon: '/logo.svg',
    },
};
function RootLayout({ children, }) {
    return (React.createElement("html", { lang: "en" },
        React.createElement("body", { className: `${inter.className} bg-gray-50 min-h-screen` }, children)));
}
//# sourceMappingURL=layout.js.map