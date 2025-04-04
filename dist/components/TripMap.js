"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TripMap;
const react_leaflet_1 = require("react-leaflet");
require("leaflet/dist/leaflet.css");
const leaflet_1 = require("leaflet");
const utils_1 = require("@/lib/utils");
// Need to handle SSR with Leaflet
const dynamic_1 = __importDefault(require("next/dynamic"));
const MapWithNoSSR = (0, dynamic_1.default)(() => Promise.resolve(MapDisplay), {
    ssr: false,
});
// Fix for Leaflet default icon in Next.js
function getIcon() {
    return new leaflet_1.Icon({
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
        shadowSize: [41, 41],
    });
}
function MapDisplay({ trip }) {
    // Extract coordinates for centering the map
    const coordinates = trip.stops.map(stop => [
        stop.city.coordinates.lat,
        stop.city.coordinates.lng,
    ]);
    // If no stops, center on Europe
    const center = coordinates.length > 0
        ? [coordinates[0][0], coordinates[0][1]]
        : [48.8566, 2.3522]; // Paris as default center
    return (React.createElement(react_leaflet_1.MapContainer, { center: [center[0], center[1]], zoom: 5, style: { height: "500px", width: "100%" }, className: "rounded-lg shadow-lg z-0" },
        React.createElement(react_leaflet_1.TileLayer, { attribution: '\u00A9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" }),
        trip.stops.map((stop, index) => (React.createElement(react_leaflet_1.Marker, { key: `${stop.city.id}-${index}`, position: [stop.city.coordinates.lat, stop.city.coordinates.lng], icon: getIcon() },
            React.createElement(react_leaflet_1.Popup, null,
                React.createElement("div", { className: "p-2" },
                    React.createElement("h3", { className: "font-bold text-gray-900" },
                        stop.city.name,
                        ", ",
                        stop.city.country),
                    stop.arrivalDate && (React.createElement("p", { className: "text-gray-700" },
                        "Arrival: ",
                        (0, utils_1.formatDate)(stop.arrivalDate))),
                    stop.departureDate && (React.createElement("p", { className: "text-gray-700" },
                        "Departure: ",
                        (0, utils_1.formatDate)(stop.departureDate))),
                    stop.accommodation && (React.createElement("p", { className: "text-gray-700" },
                        "Accommodation: ",
                        stop.accommodation))))))),
        trip.stops.length > 1 && (React.createElement(react_leaflet_1.Polyline, { positions: coordinates, color: "blue", weight: 3, opacity: 0.7 }))));
}
function TripMap({ trip }) {
    return React.createElement(MapWithNoSSR, { trip: trip });
}
//# sourceMappingURL=TripMap.js.map