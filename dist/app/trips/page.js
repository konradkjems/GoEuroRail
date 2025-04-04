"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TripsPage;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const link_1 = __importDefault(require("next/link"));
const Layout_1 = __importDefault(require("@/components/Layout"));
const outline_1 = require("@heroicons/react/24/outline");
const utils_1 = require("@/lib/utils");
function TripsPage() {
    const router = (0, navigation_1.useRouter)();
    const [trips, setTrips] = (0, react_1.useState)([]);
    const [isClient, setIsClient] = (0, react_1.useState)(false);
    const [isDeleting, setIsDeleting] = (0, react_1.useState)(null);
    // Load trips from localStorage
    (0, react_1.useEffect)(() => {
        setIsClient(true);
        const savedTrips = localStorage.getItem('trips');
        if (savedTrips) {
            try {
                const parsedTrips = JSON.parse(savedTrips);
                setTrips(parsedTrips);
            }
            catch (error) {
                console.error("Error parsing trips:", error);
            }
        }
    }, []);
    // Handle trip deletion
    const handleDeleteTrip = (id) => {
        if (confirm("Are you sure you want to delete this trip? This action cannot be undone.")) {
            setIsDeleting(id);
            const updatedTrips = trips.filter(trip => trip.id !== id);
            setTrips(updatedTrips);
            // Update localStorage
            localStorage.setItem('trips', JSON.stringify(updatedTrips));
            setIsDeleting(null);
        }
    };
    // Calculate trip statistics
    const getTripStats = (trip) => {
        const cities = trip.stops.length;
        const days = trip.stops.reduce((total, stop) => total + (stop.nights || 0), 0);
        const countries = [...new Set(trip.stops.map(stop => stop.city.country))].length;
        return { cities, days, countries };
    };
    return (React.createElement(Layout_1.default, null,
        React.createElement("div", { className: "container mx-auto p-4 max-w-6xl" },
            React.createElement("div", { className: "flex justify-between items-center mb-6" },
                React.createElement("h1", { className: "text-2xl font-bold text-[#264653]" }, "My Trips"),
                React.createElement(link_1.default, { href: "/trips/new", className: "flex items-center py-2 px-4 bg-[#FFD166] text-[#264653] rounded hover:bg-[#FFC233]" },
                    React.createElement(outline_1.PlusIcon, { className: "h-5 w-5 mr-1" }),
                    React.createElement("span", null, "New Trip"))),
            isClient && (React.createElement("div", null, trips.length > 0 ? (React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" }, trips.map(trip => {
                const { cities, days, countries } = getTripStats(trip);
                return (React.createElement("div", { key: trip.id, className: "bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow" },
                    React.createElement("div", { className: "h-36 bg-[#264653] relative flex items-center justify-center bg-opacity-80" },
                        React.createElement("div", { className: "absolute inset-0 opacity-30 bg-center bg-cover", style: { backgroundImage: trip.stops.length > 0 ?
                                    `url(https://source.unsplash.com/featured/600x400?${trip.stops[0].city.name},landmark)` :
                                    'url(https://source.unsplash.com/featured/600x400?europe,train)'
                            } }),
                        React.createElement("div", { className: "relative z-10 text-center px-4" },
                            React.createElement("h2", { className: "text-xl font-bold text-white mb-2" }, trip.name),
                            React.createElement("div", { className: "flex items-center justify-center text-xs text-white/90" },
                                React.createElement(outline_1.CalendarIcon, { className: "h-3 w-3 mr-1" }),
                                React.createElement("span", null,
                                    (0, utils_1.formatDate)(trip.startDate),
                                    " - ",
                                    (0, utils_1.formatDate)(trip.endDate))))),
                    React.createElement("div", { className: "p-4 border-b border-gray-100" },
                        React.createElement("div", { className: "grid grid-cols-3 gap-2 text-center" },
                            React.createElement("div", { className: "flex flex-col items-center" },
                                React.createElement("div", { className: "text-lg font-semibold text-[#06D6A0]" }, cities),
                                React.createElement("div", { className: "text-xs text-gray-500" }, "Cities")),
                            React.createElement("div", { className: "flex flex-col items-center" },
                                React.createElement("div", { className: "text-lg font-semibold text-[#FFD166]" }, days),
                                React.createElement("div", { className: "text-xs text-gray-500" }, "Days")),
                            React.createElement("div", { className: "flex flex-col items-center" },
                                React.createElement("div", { className: "text-lg font-semibold text-[#F94144]" }, countries),
                                React.createElement("div", { className: "text-xs text-gray-500" }, "Countries")))),
                    React.createElement("div", { className: "px-4 py-3 bg-[#FAF3E0]/50" },
                        React.createElement("div", { className: "text-sm font-medium text-[#264653] mb-2" }, "Itinerary:"),
                        React.createElement("div", { className: "space-y-1" }, trip.stops.length > 0 ? (React.createElement("div", null,
                            trip.stops.slice(0, 3).map((stop, index) => (React.createElement("div", { key: index, className: "flex items-center text-sm" },
                                React.createElement(outline_1.MapPinIcon, { className: "h-3 w-3 text-[#264653] mr-1 flex-shrink-0" }),
                                React.createElement("span", { className: "truncate" },
                                    stop.city.name,
                                    ", ",
                                    stop.city.country)))),
                            trip.stops.length > 3 && (React.createElement("div", { className: "text-xs text-[#264653]/70 mt-1" },
                                "+",
                                trip.stops.length - 3,
                                " more stops")))) : (React.createElement("div", { className: "text-sm text-[#264653]/70 italic" }, "No stops added yet")))),
                    React.createElement("div", { className: "flex justify-between p-3 bg-white" },
                        React.createElement("div", { className: "flex space-x-1" },
                            React.createElement("button", { onClick: () => handleDeleteTrip(trip.id), disabled: isDeleting === trip.id, className: "p-1 text-[#264653] hover:text-[#F94144] rounded", title: "Delete trip" },
                                React.createElement(outline_1.TrashIcon, { className: "h-5 w-5" })),
                            React.createElement(link_1.default, { href: `/trips/${trip.id}/edit`, className: "p-1 text-[#264653] hover:text-[#06D6A0] rounded", title: "Edit trip" },
                                React.createElement(outline_1.PencilIcon, { className: "h-5 w-5" }))),
                        React.createElement(link_1.default, { href: `/trips/${trip.id}`, className: "px-3 py-1 bg-[#FFD166] text-[#264653] text-sm rounded hover:bg-[#FFC233]" }, "View Trip"))));
            }))) : (React.createElement("div", { className: "bg-white rounded-lg p-8 text-center border border-gray-200" },
                React.createElement("div", { className: "mx-auto w-16 h-16 bg-[#FAF3E0] rounded-full flex items-center justify-center mb-4" },
                    React.createElement(outline_1.MapPinIcon, { className: "h-8 w-8 text-[#FFD166]" })),
                React.createElement("h2", { className: "text-xl font-semibold text-[#264653] mb-2" }, "No trips yet"),
                React.createElement("p", { className: "text-[#264653]/70 mb-6" }, "Create your first trip to start planning your European rail adventure"),
                React.createElement(link_1.default, { href: "/trips/new", className: "inline-flex items-center py-2 px-4 bg-[#FFD166] text-[#264653] rounded hover:bg-[#FFC233]" },
                    React.createElement(outline_1.PlusIcon, { className: "h-5 w-5 mr-1" }),
                    React.createElement("span", null, "Create New Trip")))))))));
}
//# sourceMappingURL=page.js.map