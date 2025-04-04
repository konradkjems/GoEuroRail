"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TripCard;
const utils_1 = require("@/lib/utils");
const link_1 = __importDefault(require("next/link"));
const outline_1 = require("@heroicons/react/24/outline");
function TripCard({ trip, onDelete }) {
    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this trip?")) {
            onDelete(trip.id);
        }
    };
    return (React.createElement("div", { className: "bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow" },
        React.createElement("div", { className: "p-5" },
            React.createElement("div", { className: "flex justify-between items-start" },
                React.createElement("h3", { className: "text-xl font-bold text-gray-800 mb-2" }, trip.name),
                React.createElement("div", { className: "flex space-x-2" },
                    React.createElement(link_1.default, { href: `/trips/${trip.id}/edit`, className: "text-blue-600 hover:text-blue-800", "aria-label": "Edit trip" },
                        React.createElement(outline_1.PencilIcon, { className: "h-5 w-5" })),
                    React.createElement("button", { onClick: handleDelete, className: "text-red-600 hover:text-red-800", "aria-label": "Delete trip" },
                        React.createElement(outline_1.TrashIcon, { className: "h-5 w-5" })))),
            React.createElement("div", { className: "flex items-center text-sm text-gray-600 mb-3" },
                React.createElement(outline_1.CalendarIcon, { className: "h-4 w-4 mr-1" }),
                React.createElement("span", null,
                    (0, utils_1.formatDate)(trip.startDate),
                    " to ",
                    (0, utils_1.formatDate)(trip.endDate))),
            React.createElement("div", { className: "mb-4" },
                React.createElement("h4", { className: "text-sm font-semibold text-gray-700 flex items-center mb-2" },
                    React.createElement(outline_1.MapPinIcon, { className: "h-4 w-4 mr-1" }),
                    "Destinations:"),
                React.createElement("div", { className: "flex flex-wrap gap-1" }, trip.stops.map((stop, index) => (React.createElement("span", { key: index, className: "inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded" }, stop.city.name))))),
            trip.notes && (React.createElement("p", { className: "text-sm text-gray-600 line-clamp-2 mb-3" }, trip.notes)),
            React.createElement(link_1.default, { href: `/trips/${trip.id}`, className: "inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors" }, "View Details"))));
}
//# sourceMappingURL=TripCard.js.map