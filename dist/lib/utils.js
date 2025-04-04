"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = formatDate;
exports.parseDate = parseDate;
exports.addDays = addDays;
exports.getCityById = getCityById;
exports.convertFormTripToTrip = convertFormTripToTrip;
exports.convertFormTripStopToTripStop = convertFormTripStopToTripStop;
exports.saveTrips = saveTrips;
exports.loadTrips = loadTrips;
const date_fns_1 = require("date-fns");
const cities_1 = require("./cities");
const uuid_1 = require("uuid");
function formatDate(date) {
    if (!date)
        return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
function parseDate(dateString) {
    return new Date(dateString);
}
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(date.getDate() + days);
    return result;
}
function getCityById(id) {
    return cities_1.cities.find(city => city.id === id);
}
function convertFormTripToTrip(formTrip) {
    const stops = formTrip.stops
        .filter(stop => stop.cityId) // Filter out empty stops
        .map(stop => convertFormTripStopToTripStop(stop));
    return {
        id: (0, uuid_1.v4)(),
        name: formTrip.name,
        startDate: (0, date_fns_1.parseISO)(formTrip.startDate),
        endDate: (0, date_fns_1.parseISO)(formTrip.endDate),
        stops,
        notes: formTrip.notes
    };
}
function convertFormTripStopToTripStop(formStop) {
    const city = getCityById(formStop.cityId);
    if (!city) {
        throw new Error(`City with ID ${formStop.cityId} not found`);
    }
    return {
        city,
        arrivalDate: formStop.arrivalDate ? (0, date_fns_1.parseISO)(formStop.arrivalDate) : null,
        departureDate: formStop.departureDate ? (0, date_fns_1.parseISO)(formStop.departureDate) : null,
        accommodation: formStop.accommodation,
        notes: formStop.notes,
        nights: 1 // Default to 1 night
    };
}
// Simple client-side storage functions
function saveTrips(trips) {
    if (typeof window !== "undefined") {
        localStorage.setItem("interrail-trips", JSON.stringify(trips));
    }
}
function loadTrips() {
    if (typeof window !== "undefined") {
        const tripsJson = localStorage.getItem("interrail-trips");
        if (tripsJson) {
            try {
                const parsedTrips = JSON.parse(tripsJson);
                return parsedTrips.map((trip) => ({
                    ...trip,
                    startDate: new Date(trip.startDate),
                    endDate: new Date(trip.endDate),
                    stops: trip.stops.map((stop) => ({
                        ...stop,
                        arrivalDate: stop.arrivalDate ? new Date(stop.arrivalDate) : null,
                        departureDate: stop.departureDate ? new Date(stop.departureDate) : null
                    }))
                }));
            }
            catch (error) {
                console.error("Error parsing trips from localStorage:", error);
            }
        }
    }
    return [];
}
//# sourceMappingURL=utils.js.map