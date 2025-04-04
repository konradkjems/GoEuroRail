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
exports.default = TripDetails;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const Layout_1 = __importDefault(require("@/components/Layout"));
const SplitView_1 = __importDefault(require("@/components/SplitView"));
const TripItinerary_1 = __importDefault(require("@/components/TripItinerary"));
const dynamic_1 = __importDefault(require("next/dynamic"));
const cities_1 = require("@/lib/cities");
// Dynamically import the map component to avoid server-side rendering issues
const InterrailMap = (0, dynamic_1.default)(() => Promise.resolve().then(() => __importStar(require("@/components/InterrailMap"))), {
    ssr: false,
    loading: () => React.createElement("div", { className: "h-full w-full bg-gray-100 flex items-center justify-center" }, "Loading map...")
});
function TripDetails({ params }) {
    const router = (0, navigation_1.useRouter)();
    const [trip, setTrip] = (0, react_1.useState)(null);
    const [selectedStopIndex, setSelectedStopIndex] = (0, react_1.useState)(-1);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        if (!params.id)
            return;
        // Special case for new trip
        if (params.id === 'new') {
            // Create a new empty trip
            const today = new Date();
            const nextWeek = new Date(today);
            nextWeek.setDate(today.getDate() + 7);
            const newTrip = {
                id: Date.now().toString(),
                name: "New Trip",
                startDate: today.toISOString().split('T')[0],
                endDate: nextWeek.toISOString().split('T')[0],
                notes: "",
                travelers: 1,
                stops: []
            };
            setTrip(newTrip);
            setIsLoading(false);
            // Get existing trips to add this one
            const savedTrips = localStorage.getItem('trips');
            let existingTrips = [];
            if (savedTrips) {
                existingTrips = JSON.parse(savedTrips);
            }
            // Add to localStorage
            const updatedTrips = [...existingTrips, newTrip];
            localStorage.setItem('trips', JSON.stringify(updatedTrips));
            // Update URL to use real ID without reloading
            router.replace(`/trips/${newTrip.id}`);
            return;
        }
        // Normal trip loading
        const savedTrips = localStorage.getItem('trips');
        if (savedTrips) {
            const parsedTrips = JSON.parse(savedTrips);
            const foundTrip = parsedTrips.find((t) => t.id === params.id);
            if (foundTrip) {
                setTrip(foundTrip);
            }
            else {
                // Trip not found, redirect to home
                router.push('/');
            }
        }
        setIsLoading(false);
    }, [params.id, router]);
    (0, react_1.useEffect)(() => {
        // Listen for addCityToTrip event
        const handleAddCityToTrip = (event) => {
            const { cityId } = event.detail;
            if (trip && cityId) {
                addCityToTrip(cityId);
            }
        };
        window.addEventListener('addCityToTrip', handleAddCityToTrip);
        return () => {
            window.removeEventListener('addCityToTrip', handleAddCityToTrip);
        };
    }, [trip]);
    const handleDeleteTrip = (id) => {
        if (!id)
            return;
        const savedTrips = localStorage.getItem('trips');
        if (savedTrips) {
            const parsedTrips = JSON.parse(savedTrips);
            const updatedTrips = parsedTrips.filter((t) => t.id !== id);
            // Update localStorage
            localStorage.setItem('trips', JSON.stringify(updatedTrips));
            // Redirect to home
            router.push('/');
        }
    };
    const handleUpdateTrip = (updatedTrip) => {
        if (!updatedTrip)
            return;
        const savedTrips = localStorage.getItem('trips');
        if (savedTrips) {
            const parsedTrips = JSON.parse(savedTrips);
            const updatedTrips = parsedTrips.map((t) => t.id === updatedTrip.id ? updatedTrip : t);
            // Update localStorage
            localStorage.setItem('trips', JSON.stringify(updatedTrips));
            // Update local state
            setTrip(updatedTrip);
        }
    };
    const handleCityClick = (cityId) => {
        if (!trip)
            return;
        // Find the stop index for this city
        const stopIndex = trip.stops.findIndex(stop => stop.city.id === cityId);
        if (stopIndex !== -1) {
            setSelectedStopIndex(stopIndex);
        }
    };
    // Function to add a city to the trip
    const addCityToTrip = (cityId) => {
        if (!trip)
            return;
        // Find the city from our cities list
        const cityToAdd = cities_1.cities.find(city => city.id === cityId);
        if (!cityToAdd)
            return;
        // Check if city is already in the trip
        const isAlreadyInTrip = trip.stops.some(stop => stop.city.id === cityId);
        if (isAlreadyInTrip) {
            alert(`${cityToAdd.name} is already in your trip.`);
            return;
        }
        // Estimate the arrival and departure dates based on the last stop or trip start date
        let arrivalDate;
        if (trip.stops.length > 0) {
            // Get the last stop's departure date or add 1 day to arrival if no departure
            const lastStop = trip.stops[trip.stops.length - 1];
            const lastStopDate = lastStop.departureDate ||
                (lastStop.arrivalDate ? new Date(new Date(lastStop.arrivalDate).getTime() + 86400000).toISOString() : null);
            arrivalDate = lastStopDate || trip.startDate;
        }
        else {
            arrivalDate = trip.startDate;
        }
        // Create a departure date 1 day after arrival
        const arrivalDateObj = new Date(arrivalDate);
        const departureDateObj = new Date(arrivalDateObj);
        departureDateObj.setDate(departureDateObj.getDate() + 1);
        // Create the new stop
        const newStop = {
            city: cityToAdd,
            arrivalDate: arrivalDateObj.toISOString(),
            departureDate: departureDateObj.toISOString(),
            nights: 1
        };
        // Add the stop to the trip
        const updatedTrip = {
            ...trip,
            stops: [...trip.stops, newStop]
        };
        // Update the trip
        handleUpdateTrip(updatedTrip);
        // Select the new stop
        setSelectedStopIndex(updatedTrip.stops.length - 1);
    };
    if (isLoading) {
        return (React.createElement(Layout_1.default, null,
            React.createElement("div", { className: "h-full flex items-center justify-center" },
                React.createElement("p", { className: "text-gray-500" }, "Loading..."))));
    }
    if (!trip) {
        return (React.createElement(Layout_1.default, null,
            React.createElement("div", { className: "h-full flex items-center justify-center" },
                React.createElement("p", { className: "text-gray-500" }, "Trip not found"))));
    }
    // Map section
    const mapSection = (React.createElement("div", { className: "h-full" },
        React.createElement(InterrailMap, { selectedTrip: trip, onCityClick: handleCityClick })));
    // Content section
    const contentSection = (React.createElement("div", { className: "h-full flex flex-col" },
        React.createElement(TripItinerary_1.default, { trip: trip, onDeleteTrip: handleDeleteTrip, selectedStopIndex: selectedStopIndex, onSelectStop: setSelectedStopIndex, onUpdateTrip: handleUpdateTrip })));
    return (React.createElement(Layout_1.default, null,
        React.createElement(SplitView_1.default, { mapSection: mapSection, contentSection: contentSection, mapWidth: "70%" })));
}
//# sourceMappingURL=page.js.map