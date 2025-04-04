"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EuropeMap;
const react_leaflet_1 = require("react-leaflet");
require("leaflet/dist/leaflet.css");
const leaflet_1 = require("leaflet");
const cities_1 = require("@/lib/cities");
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
function MapDisplay() {
    // Center on Europe
    const center = [48.8566, 2.3522]; // Paris as center of Europe
    return (React.createElement(react_leaflet_1.MapContainer, { center: center, zoom: 4, style: { height: "400px", width: "100%" }, className: "rounded-lg shadow-lg z-0" },
        React.createElement(react_leaflet_1.TileLayer, { attribution: '\u00A9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" }),
        cities_1.cities.map((city) => (React.createElement(react_leaflet_1.Marker, { key: city.id, position: [city.coordinates.lat, city.coordinates.lng], icon: getIcon() },
            React.createElement(react_leaflet_1.Popup, null,
                React.createElement("div", { className: "p-2" },
                    React.createElement("h3", { className: "font-bold text-gray-900" }, city.name),
                    React.createElement("p", { className: "text-gray-700" }, city.country))))))));
}
function EuropeMap() {
    return React.createElement(MapWithNoSSR, null);
}
//# sourceMappingURL=EuropeMap.js.map