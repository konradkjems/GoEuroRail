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
exports.default = NewTrip;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const Layout_1 = __importDefault(require("@/components/Layout"));
const SplitView_1 = __importDefault(require("@/components/SplitView"));
const cities_1 = require("@/lib/cities");
const link_1 = __importDefault(require("next/link"));
const dynamic_1 = __importDefault(require("next/dynamic"));
const outline_1 = require("@heroicons/react/24/outline");
// Dynamically import the map component to avoid server-side rendering issues
const InterrailMap = (0, dynamic_1.default)(() => Promise.resolve().then(() => __importStar(require("@/components/InterrailMap"))), {
    ssr: false,
    loading: () => React.createElement("div", { className: "h-full w-full bg-gray-100 flex items-center justify-center" }, "Loading map...")
});
function NewTrip() {
    const router = (0, navigation_1.useRouter)();
    const [isClient, setIsClient] = (0, react_1.useState)(false);
    const [selectedCities, setSelectedCities] = (0, react_1.useState)([]);
    // Form state
    const [tripName, setTripName] = (0, react_1.useState)("My European Adventure");
    const [startDate, setStartDate] = (0, react_1.useState)("");
    const [travelers, setTravelers] = (0, react_1.useState)(1);
    const [notes, setNotes] = (0, react_1.useState)("");
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    const [formErrors, setFormErrors] = (0, react_1.useState)({});
    // Initialize dates
    (0, react_1.useEffect)(() => {
        setIsClient(true);
        // Set default start date to today
        const today = new Date();
        setStartDate(today.toISOString().split('T')[0]);
    }, []);
    // Calculate end date based on stays
    const calculateEndDate = (stops) => {
        if (stops.length === 0)
            return new Date(startDate);
        let currentDate = new Date(startDate);
        stops.forEach(stop => {
            currentDate.setDate(currentDate.getDate() + (stop.nights || 1));
        });
        return currentDate;
    };
    // Handle city selection from the map
    const handleCityClick = (cityId) => {
        const city = cities_1.cities.find(c => c.id === cityId);
        if (!city)
            return;
        if (selectedCities.some(c => c.id === cityId)) {
            // Remove city if already selected
            setSelectedCities(selectedCities.filter(c => c.id !== cityId));
        }
        else {
            // Add city if not selected
            setSelectedCities([...selectedCities, city]);
        }
    };
    // Remove a city from selection
    const handleRemoveCity = (cityId) => {
        setSelectedCities(selectedCities.filter(c => c.id !== cityId));
    };
    // Validate form
    const validateForm = () => {
        const errors = {};
        if (!tripName.trim()) {
            errors.name = "Trip name is required";
        }
        if (!startDate) {
            errors.startDate = "Start date is required";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };
    // Create trip
    const handleCreateTrip = () => {
        if (!validateForm())
            return;
        setIsSubmitting(true);
        // Create stops from selected cities with default 1 night stay
        const stops = selectedCities.map((city, index) => {
            let currentDate = new Date(startDate);
            if (index > 0) {
                // Add the nights from previous stops to get the arrival date
                for (let i = 0; i < index; i++) {
                    currentDate.setDate(currentDate.getDate() + 1); // Default 1 night per stop
                }
            }
            const arrivalDate = new Date(currentDate);
            const departureDate = new Date(currentDate);
            departureDate.setDate(departureDate.getDate() + 1);
            return {
                city,
                arrivalDate,
                departureDate,
                nights: 1,
                notes: "",
                accommodation: ""
            };
        });
        // Calculate end date based on stays
        const endDate = calculateEndDate(stops);
        // Create new trip
        const newTrip = {
            id: Date.now().toString(),
            name: tripName,
            startDate: new Date(startDate),
            endDate,
            travelers,
            notes,
            stops
        };
        // Save to localStorage
        try {
            const savedTrips = localStorage.getItem('trips');
            let existingTrips = [];
            if (savedTrips) {
                existingTrips = JSON.parse(savedTrips);
            }
            localStorage.setItem('trips', JSON.stringify([...existingTrips, newTrip]));
            // Redirect to the trip detail page
            router.push(`/trips/${newTrip.id}`);
        }
        catch (error) {
            console.error("Error saving trip:", error);
            setIsSubmitting(false);
            alert("There was an error creating your trip. Please try again.");
        }
    };
    // Map section with city selection
    const mapSection = (React.createElement("div", { className: "h-full relative" },
        React.createElement(InterrailMap, { selectedTrip: {
                id: "temp",
                name: tripName,
                startDate,
                endDate,
                notes: "",
                travelers: 1,
                stops: selectedCities.map(city => ({
                    city,
                    arrivalDate: startDate,
                    departureDate: endDate,
                    accommodation: "",
                    notes: ""
                }))
            }, onCityClick: handleCityClick }),
        React.createElement("div", { className: "absolute top-4 left-4 bg-white p-2 rounded-md shadow-md" },
            React.createElement("p", { className: "text-xs text-[#264653] font-medium" }, "Click on cities to add them to your trip"))));
    // Content section with trip form
    const contentSection = (React.createElement("div", { className: "h-full flex flex-col bg-white" },
        React.createElement("div", { className: "p-4 border-b border-gray-200" },
            React.createElement("h1", { className: "text-xl font-bold text-[#264653]" }, "Create New Trip"),
            React.createElement("p", { className: "text-sm text-[#264653]/70" }, "Plan your European rail adventure")),
        React.createElement("div", { className: "flex-1 overflow-auto p-4" },
            React.createElement("div", { className: "space-y-6" },
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-sm font-medium text-[#264653] mb-1" }, "Trip Name"),
                    React.createElement("input", { type: "text", value: tripName, onChange: (e) => setTripName(e.target.value), className: "w-full p-2 border border-gray-300 rounded focus:border-[#FFD166] focus:ring focus:ring-[#FFD166]/20 focus:outline-none", placeholder: "My European Adventure" }),
                    formErrors.name && (React.createElement("p", { className: "mt-1 text-xs text-[#F94144]" }, formErrors.name))),
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-sm font-medium text-[#264653] mb-1" }, "Start Date"),
                    React.createElement("div", { className: "relative" },
                        React.createElement("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" },
                            React.createElement(outline_1.CalendarIcon, { className: "h-4 w-4 text-gray-400" })),
                        React.createElement("input", { type: "date", value: startDate, onChange: (e) => setStartDate(e.target.value), className: "w-full pl-10 p-2 border border-gray-300 rounded focus:border-[#FFD166] focus:ring focus:ring-[#FFD166]/20 focus:outline-none" })),
                    formErrors.startDate && (React.createElement("p", { className: "mt-1 text-xs text-[#F94144]" }, formErrors.startDate))),
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-sm font-medium text-[#264653] mb-1" }, "Number of Travelers"),
                    React.createElement("div", { className: "relative" },
                        React.createElement("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" },
                            React.createElement(outline_1.UsersIcon, { className: "h-4 w-4 text-gray-400" })),
                        React.createElement("input", { type: "number", min: "1", value: travelers, onChange: (e) => setTravelers(parseInt(e.target.value)), className: "w-full pl-10 p-2 border border-gray-300 rounded focus:border-[#FFD166] focus:ring focus:ring-[#FFD166]/20 focus:outline-none" }))),
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-sm font-medium text-[#264653] mb-1" }, "Trip Notes (Optional)"),
                    React.createElement("div", { className: "relative" },
                        React.createElement("div", { className: "absolute top-3 left-3 flex items-start pointer-events-none" },
                            React.createElement(outline_1.DocumentTextIcon, { className: "h-4 w-4 text-gray-400" })),
                        React.createElement("textarea", { value: notes, onChange: (e) => setNotes(e.target.value), className: "w-full pl-10 p-2 border border-gray-300 rounded focus:border-[#FFD166] focus:ring focus:ring-[#FFD166]/20 focus:outline-none", rows: 3, placeholder: "Add any notes about your trip here..." }))),
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-sm font-medium text-[#264653] mb-2" }, "Selected Cities"),
                    selectedCities.length > 0 ? (React.createElement("div", { className: "space-y-2" }, selectedCities.map((city, index) => (React.createElement("div", { key: city.id, className: "flex items-center justify-between bg-gray-50 p-2 rounded" },
                        React.createElement("div", { className: "flex items-center" },
                            React.createElement(outline_1.MapPinIcon, { className: "h-4 w-4 text-[#264653] mr-2" }),
                            React.createElement("span", { className: "text-sm text-[#264653]" },
                                city.name,
                                ", ",
                                city.country)),
                        React.createElement("button", { onClick: () => handleRemoveCity(city.id), className: "text-[#F94144] hover:text-[#E53E41]" },
                            React.createElement(outline_1.XMarkIcon, { className: "h-4 w-4" }))))))) : (React.createElement("p", { className: "text-sm text-[#264653]/70" }, "Click cities on the map to add them to your trip"))))),
        React.createElement("div", { className: "p-4 bg-[#FAF3E0] border-t border-gray-200" },
            React.createElement("div", { className: "grid grid-cols-2 gap-3" },
                React.createElement("button", { onClick: handleCreateTrip, disabled: isSubmitting || selectedCities.length === 0, className: "flex justify-center items-center py-2 bg-[#FFD166] text-[#264653] rounded text-sm font-medium hover:bg-[#FFC233] disabled:opacity-50" }, isSubmitting ? 'Creating...' : 'Create Trip'),
                React.createElement(link_1.default, { href: "/", className: "flex justify-center items-center py-2 bg-white border border-gray-300 rounded text-sm font-medium text-[#264653] hover:bg-gray-50" }, "Cancel")))));
    return (React.createElement(Layout_1.default, null, isClient && (React.createElement(SplitView_1.default, { mapSection: mapSection, contentSection: contentSection, mapWidth: "70%" }))));
}
//# sourceMappingURL=page.js.map