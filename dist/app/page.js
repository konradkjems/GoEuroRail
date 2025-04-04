"use strict";
"use client";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
const react_1 = require("react");
const Layout_1 = __importDefault(require("@/components/Layout"));
const SplitView_1 = __importDefault(require("@/components/SplitView"));
const dynamic_1 = __importDefault(require("next/dynamic"));
const TripItinerary_1 = __importDefault(require("@/components/TripItinerary"));
const navigation_1 = require("next/navigation");
const outline_1 = require("@heroicons/react/24/outline");
const cities_1 = require("@/lib/cities");
const link_1 = __importDefault(require("next/link"));
// Dynamically import the map component to avoid server-side rendering issues
const InterrailMap = (0, dynamic_1.default)(() => Promise.resolve().then(() => __importStar(require("@/components/InterrailMap"))), {
    ssr: false,
    loading: () => React.createElement("div", { className: "h-full w-full bg-gray-100 flex items-center justify-center" }, "Loading map...")
});
function Home() {
    const [trips, setTrips] = (0, react_1.useState)([]);
    const [selectedTrip, setSelectedTrip] = (0, react_1.useState)(null);
    const [selectedStopIndex, setSelectedStopIndex] = (0, react_1.useState)(-1);
    const [isClient, setIsClient] = (0, react_1.useState)(false);
    const [showNewTripForm, setShowNewTripForm] = (0, react_1.useState)(false);
    const router = (0, navigation_1.useRouter)();
    // New trip state
    const [newTripName, setNewTripName] = (0, react_1.useState)("");
    const [newTripStartDate, setNewTripStartDate] = (0, react_1.useState)("");
    const [newTripEndDate, setNewTripEndDate] = (0, react_1.useState)("");
    (0, react_1.useEffect)(() => {
        // This will only run on the client
        setIsClient(true);
        // Set default dates for new trip
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        setNewTripStartDate(today.toISOString().split('T')[0]);
        setNewTripEndDate(nextWeek.toISOString().split('T')[0]);
        // Load trips from localStorage on component mount
        const savedTrips = localStorage.getItem('trips');
        if (savedTrips) {
            const parsedTrips = JSON.parse(savedTrips);
            setTrips(parsedTrips);
            // Select the first trip if available
            if (parsedTrips.length > 0) {
                setSelectedTrip(parsedTrips[0]);
            }
        }
        // Listen for addCityToTrip event
        const handleAddCityToTrip = (event) => {
            const { cityId } = event.detail;
            if (selectedTrip && cityId) {
                addCityToTrip(cityId);
            }
        };
        window.addEventListener('addCityToTrip', handleAddCityToTrip);
        return () => {
            window.removeEventListener('addCityToTrip', handleAddCityToTrip);
        };
    }, [selectedTrip]); // Re-add the event listener when selectedTrip changes
    // Function to add a city to the selected trip
    const addCityToTrip = (cityId) => {
        if (!selectedTrip)
            return;
        // Find the city from our cities list
        const cityToAdd = cities_1.cities.find(city => city.id === cityId);
        if (!cityToAdd)
            return;
        // Check if city is already in the trip
        const isAlreadyInTrip = selectedTrip.stops.some(stop => stop.city.id === cityId);
        if (isAlreadyInTrip) {
            alert(`${cityToAdd.name} is already in your trip.`);
            return;
        }
        // Estimate the arrival and departure dates based on the last stop or trip start date
        let arrivalDate;
        if (selectedTrip.stops.length > 0) {
            // Get the last stop's departure date or add 1 day to arrival if no departure
            const lastStop = selectedTrip.stops[selectedTrip.stops.length - 1];
            arrivalDate = lastStop.departureDate || selectedTrip.startDate;
        }
        else {
            arrivalDate = selectedTrip.startDate;
        }
        // Create a departure date 1 day after arrival
        const arrivalDateObj = new Date(arrivalDate);
        const departureDateObj = new Date(arrivalDateObj);
        departureDateObj.setDate(arrivalDateObj.getDate() + 1);
        // Create the new stop
        const newStop = {
            city: cityToAdd,
            arrivalDate: arrivalDateObj.toISOString().split('T')[0],
            departureDate: departureDateObj.toISOString().split('T')[0],
            nights: 1
        };
        // Add the stop to the trip
        const updatedTrip = {
            ...selectedTrip,
            stops: [...selectedTrip.stops, newStop]
        };
        // Update the trip
        handleUpdateTrip(updatedTrip);
        // Select the new stop
        setSelectedStopIndex(updatedTrip.stops.length - 1);
    };
    // Create a new trip
    const handleCreateTrip = () => {
        if (!newTripName)
            return;
        const newTrip = {
            id: Date.now().toString(),
            name: newTripName,
            startDate: newTripStartDate,
            endDate: newTripEndDate,
            notes: "",
            travelers: 1,
            stops: []
        };
        const updatedTrips = [...trips, newTrip];
        setTrips(updatedTrips);
        setSelectedTrip(newTrip);
        setShowNewTripForm(false);
        // Save to localStorage
        localStorage.setItem('trips', JSON.stringify(updatedTrips));
    };
    // Handle trip deletion
    const handleDeleteTrip = (id) => {
        const updatedTrips = trips.filter(trip => trip.id !== id);
        setTrips(updatedTrips);
        // Update localStorage
        localStorage.setItem('trips', JSON.stringify(updatedTrips));
        // Update selected trip
        if (updatedTrips.length > 0) {
            setSelectedTrip(updatedTrips[0]);
        }
        else {
            setSelectedTrip(null);
        }
    };
    // Handle trip update
    const handleUpdateTrip = (updatedTrip) => {
        const updatedTrips = trips.map(trip => trip.id === updatedTrip.id ? updatedTrip : trip);
        setTrips(updatedTrips);
        setSelectedTrip(updatedTrip);
        // Update localStorage
        localStorage.setItem('trips', JSON.stringify(updatedTrips));
    };
    // Handle city clicks from the map
    const handleCityClick = (cityId) => {
        if (!selectedTrip)
            return;
        // Find the stop index for this city
        const stopIndex = selectedTrip.stops.findIndex(stop => stop.city.id === cityId);
        if (stopIndex !== -1) {
            setSelectedStopIndex(stopIndex);
        }
    };
    // Map section with overlay for new trip form when needed
    const mapSection = (React.createElement("div", { className: "h-full relative" },
        React.createElement(InterrailMap, { selectedTrip: selectedTrip, onCityClick: handleCityClick }),
        showNewTripForm && (React.createElement("div", { className: "absolute inset-0 bg-black/50 flex items-center justify-center p-4" },
            React.createElement("div", { className: "bg-white rounded-lg p-6 w-full max-w-md" },
                React.createElement("h2", { className: "text-xl font-bold text-[#264653] mb-4" }, "Create New Trip"),
                React.createElement("div", { className: "space-y-4" },
                    React.createElement("div", null,
                        React.createElement("label", { className: "block text-sm font-medium text-[#264653] mb-1" }, "Trip Name"),
                        React.createElement("input", { type: "text", value: newTripName, onChange: (e) => setNewTripName(e.target.value), className: "w-full p-2 border border-gray-300 rounded", placeholder: "Summer in Europe" })),
                    React.createElement("div", null,
                        React.createElement("label", { className: "block text-sm font-medium text-[#264653] mb-1" }, "Start Date"),
                        React.createElement("input", { type: "date", value: newTripStartDate, onChange: (e) => setNewTripStartDate(e.target.value), className: "w-full p-2 border border-gray-300 rounded" })),
                    React.createElement("div", null,
                        React.createElement("label", { className: "block text-sm font-medium text-[#264653] mb-1" }, "End Date"),
                        React.createElement("input", { type: "date", value: newTripEndDate, onChange: (e) => setNewTripEndDate(e.target.value), className: "w-full p-2 border border-gray-300 rounded" })),
                    React.createElement("div", { className: "flex space-x-3 pt-2" },
                        React.createElement("button", { onClick: handleCreateTrip, disabled: !newTripName, className: "flex-1 bg-[#FFD166] text-[#264653] py-2 rounded hover:bg-[#FFC233] disabled:opacity-50" }, "Create Trip"),
                        React.createElement("button", { onClick: () => setShowNewTripForm(false), className: "flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300" }, "Cancel")))))),
        !selectedTrip && !showNewTripForm && (React.createElement("div", { className: "absolute top-4 right-4" },
            React.createElement(link_1.default, { href: "/trips/new", className: "bg-[#FFD166] text-[#264653] px-4 py-2 rounded-md shadow hover:bg-[#FFC233] flex items-center" },
                React.createElement(outline_1.PlusIcon, { className: "h-5 w-5 mr-1" }),
                "Create New Trip")))));
    // Content section component
    const contentSection = (React.createElement("div", { className: "h-full flex flex-col" },
        React.createElement(TripItinerary_1.default, { trip: selectedTrip, onDeleteTrip: handleDeleteTrip, selectedStopIndex: selectedStopIndex, onSelectStop: setSelectedStopIndex, onUpdateTrip: handleUpdateTrip })));
    return (React.createElement(Layout_1.default, null, isClient && (React.createElement(SplitView_1.default, { mapSection: mapSection, contentSection: contentSection, mapWidth: "70%" }))));
}
//# sourceMappingURL=page.js.map