"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InterrailMap;
const react_leaflet_1 = require("react-leaflet");
require("leaflet/dist/leaflet.css");
const cities_1 = require("@/lib/cities");
const dynamic_1 = __importDefault(require("next/dynamic"));
const leaflet_1 = __importDefault(require("leaflet"));
const MapWithNoSSR = (0, dynamic_1.default)(() => Promise.resolve(MapDisplay), {
    ssr: false,
    loading: () => (React.createElement("div", { className: "h-full w-full flex items-center justify-center bg-gray-100" },
        React.createElement("p", { className: "text-gray-500" }, "Loading map..."))),
});
// Get custom icon based on whether city is selected
function getIcon(city, selectedTrip, selectedStopIndex) {
    // Check if this city is in the selected trip
    const isInTrip = selectedTrip?.stops.some(stop => stop.city.id === city.id);
    // Check if this city is the selected stop
    const isSelectedStop = selectedTrip?.stops[selectedStopIndex]?.city.id === city.id;
    if (isSelectedStop) {
        return new leaflet_1.default.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
    }
    else if (isInTrip) {
        return new leaflet_1.default.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
    }
    else {
        return new leaflet_1.default.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
    }
}
function MapDisplay({ selectedTrip, onCityClick, className }) {
    // Center on Europe
    const center = [48.8566, 2.3522]; // Paris as center of Europe
    // Get trip route coordinates if a trip is selected
    const routeCoordinates = selectedTrip?.stops.map(stop => [
        stop.city.coordinates.lat,
        stop.city.coordinates.lng,
    ]) || [];
    // Get trip city IDs to highlight them on the map
    const tripCityIds = selectedTrip?.stops.map(stop => stop.city.id) || [];
    const handleMarkerClick = (cityId) => {
        if (onCityClick) {
            onCityClick(cityId);
        }
    };
    return (React.createElement(react_leaflet_1.MapContainer, { center: [48.8566, 2.3522], zoom: 5, style: { height: "100%", width: "100%" }, className: `${className || ""}`, zoomControl: false },
        React.createElement(react_leaflet_1.ZoomControl, { position: "bottomright" }),
        React.createElement(react_leaflet_1.TileLayer, { attribution: '\u00A9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" }),
        cities_1.cities.map((city) => {
            const isTripStop = tripCityIds.includes(city.id);
            return (React.createElement(react_leaflet_1.Marker, { key: city.id, position: [city.coordinates.lat, city.coordinates.lng], icon: getIcon(city, selectedTrip, 0), eventHandlers: {
                    click: () => handleMarkerClick(city.id),
                } },
                React.createElement(react_leaflet_1.Popup, null,
                    React.createElement("div", { className: "p-2" },
                        React.createElement("h3", { className: "font-bold text-gray-900" }, city.name),
                        React.createElement("p", { className: "text-gray-700" }, city.country),
                        isTripStop && selectedTrip ? (React.createElement("button", { className: "mt-2 px-2 py-1 bg-[#FFD166] text-[#264653] text-xs rounded hover:bg-[#FFC233]", onClick: () => handleMarkerClick(city.id) }, "View Details")) : selectedTrip && (React.createElement("button", { className: "mt-2 px-2 py-1 bg-[#06D6A0] text-white text-xs rounded hover:bg-[#05C090]", onClick: (e) => {
                                e.stopPropagation();
                                if (onCityClick) {
                                    // We'll implement addCityToTrip in the parent component
                                    window.dispatchEvent(new CustomEvent('addCityToTrip', { detail: { cityId: city.id } }));
                                }
                            } }, "Add to Trip"))))));
        }),
        selectedTrip && routeCoordinates.length > 1 && (React.createElement(react_leaflet_1.Polyline, { positions: routeCoordinates, color: "#06D6A0", weight: 4, opacity: 0.7, dashArray: "10,10" }))));
}
function InterrailMap(props) {
    return React.createElement(MapWithNoSSR, { ...props });
}
//# sourceMappingURL=InterrailMap.js.map