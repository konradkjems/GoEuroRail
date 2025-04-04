"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EditTrip;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const link_1 = __importDefault(require("next/link"));
const outline_1 = require("@heroicons/react/24/outline");
const TripForm_1 = __importDefault(require("@/components/TripForm"));
const utils_1 = require("@/lib/utils");
function EditTrip({ params }) {
    const router = (0, navigation_1.useRouter)();
    const [trip, setTrip] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        // Load trip data
        const trips = (0, utils_1.loadTrips)();
        const foundTrip = trips.find(t => t.id === params.id);
        if (foundTrip) {
            setTrip(foundTrip);
        }
        else {
            // Trip not found, redirect to home
            router.push("/");
        }
        setIsLoading(false);
    }, [params.id, router]);
    const handleSubmit = (formData) => {
        if (!trip)
            return;
        setIsSubmitting(true);
        try {
            // Load all trips
            const trips = (0, utils_1.loadTrips)();
            // Find the index of the trip to update
            const tripIndex = trips.findIndex(t => t.id === trip.id);
            if (tripIndex !== -1) {
                // Create updated trip object
                const updatedTrip = {
                    ...trip,
                    name: formData.name,
                    startDate: new Date(formData.startDate),
                    endDate: new Date(formData.endDate),
                    notes: formData.notes,
                    stops: formData.stops
                        .filter(stop => stop.cityId) // Filter out empty stops
                        .map(stop => {
                        const city = trip.stops.find(s => s.city.id === stop.cityId)?.city;
                        if (!city) {
                            throw new Error(`City with ID ${stop.cityId} not found`);
                        }
                        return {
                            city,
                            arrivalDate: stop.arrivalDate ? new Date(stop.arrivalDate) : null,
                            departureDate: stop.departureDate ? new Date(stop.departureDate) : null,
                            accommodation: stop.accommodation,
                            notes: stop.notes
                        };
                    })
                };
                // Update the trip in the array
                trips[tripIndex] = updatedTrip;
                // Save all trips
                (0, utils_1.saveTrips)(trips);
                // Redirect to trip details
                router.push(`/trips/${trip.id}`);
            }
        }
        catch (error) {
            console.error("Error updating trip:", error);
            alert("There was an error updating your trip. Please try again.");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    if (isLoading) {
        return React.createElement("div", { className: "text-center py-12" }, "Loading...");
    }
    if (!trip) {
        return React.createElement("div", { className: "text-center py-12" }, "Trip not found");
    }
    return (React.createElement("div", { className: "space-y-6" },
        React.createElement("div", { className: "flex items-center mb-6" },
            React.createElement(link_1.default, { href: `/trips/${trip.id}`, className: "flex items-center text-blue-600 hover:text-blue-800" },
                React.createElement(outline_1.ArrowLeftIcon, { className: "h-4 w-4 mr-1" }),
                "Back to Trip Details")),
        React.createElement("div", { className: "bg-white p-6 rounded-lg shadow-sm" },
            React.createElement("h1", { className: "text-2xl font-bold text-gray-900 mb-6" }, "Edit Trip"),
            React.createElement(TripForm_1.default, { initialData: trip, onSubmit: handleSubmit }))));
}
//# sourceMappingURL=page.js.map