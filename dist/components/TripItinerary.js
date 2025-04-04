"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TripItinerary;
const utils_1 = require("@/lib/utils");
const outline_1 = require("@heroicons/react/24/outline");
const link_1 = __importDefault(require("next/link"));
const react_1 = require("react");
const cities_1 = require("@/lib/cities");
function TripItinerary({ trip, onDeleteTrip, selectedStopIndex = -1, onSelectStop, onUpdateTrip }) {
    const [isEditing, setIsEditing] = (0, react_1.useState)(false);
    const [editedTrip, setEditedTrip] = (0, react_1.useState)(null);
    const [showAddDestination, setShowAddDestination] = (0, react_1.useState)(false);
    const [newDestination, setNewDestination] = (0, react_1.useState)("");
    const [newDestinationInput, setNewDestinationInput] = (0, react_1.useState)("");
    (0, react_1.useEffect)(() => {
        setEditedTrip(trip);
    }, [trip]);
    // Handle delete trip
    const handleDeleteTrip = () => {
        if (!trip)
            return;
        if (confirm("Are you sure you want to delete this trip?") && onDeleteTrip) {
            onDeleteTrip(trip.id);
        }
    };
    // Save changes
    const handleSaveChanges = () => {
        if (editedTrip && onUpdateTrip) {
            onUpdateTrip(editedTrip);
            setIsEditing(false);
        }
    };
    // Cancel editing
    const handleCancelEdit = () => {
        if (trip) {
            setEditedTrip(JSON.parse(JSON.stringify(trip)));
        }
        setIsEditing(false);
    };
    // Add new destination
    const handleAddDestination = () => {
        if (!editedTrip || !newDestination)
            return;
        const cityToAdd = cities_1.cities.find(city => city.id === newDestination);
        if (!cityToAdd)
            return;
        const newStop = {
            city: cityToAdd,
            arrivalDate: new Date(),
            departureDate: new Date(Date.now() + 86400000), // Next day
            nights: 1
        };
        setEditedTrip({
            ...editedTrip,
            stops: [...editedTrip.stops, newStop]
        });
        setShowAddDestination(false);
        setNewDestination("");
    };
    // Add new custom destination
    const handleAddCustomDestination = () => {
        if (!editedTrip || !newDestinationInput)
            return;
        const newCity = {
            id: `custom-${Date.now()}`,
            name: newDestinationInput,
            country: "Custom Destination",
            coordinates: { lat: 0, lng: 0 } // Default coordinates
        };
        const newStop = {
            city: newCity,
            arrivalDate: new Date(),
            departureDate: new Date(Date.now() + 86400000), // Next day
            nights: 1
        };
        setEditedTrip({
            ...editedTrip,
            stops: [...editedTrip.stops, newStop]
        });
        setShowAddDestination(false);
        setNewDestinationInput("");
    };
    // Handle adding a destination after a specific stop
    const handleAddDestinationAfter = (index, cityId) => {
        if (!editedTrip)
            return;
        const cityToAdd = cities_1.cities.find(city => city.id === cityId);
        if (!cityToAdd)
            return;
        // Get the current stop and next stop (if any)
        const currentStop = editedTrip.stops[index];
        const nextStop = editedTrip.stops[index + 1];
        // Calculate arrival and departure dates
        const arrivalDate = currentStop.departureDate
            ? new Date(currentStop.departureDate)
            : new Date(); // Default to current date if no departure date
        const departureDate = nextStop?.arrivalDate
            ? new Date(nextStop.arrivalDate)
            : new Date(arrivalDate.getTime() + 86400000); // Next day if no next stop
        const newStop = {
            city: cityToAdd,
            arrivalDate,
            departureDate,
            nights: 1
        };
        // Insert the new stop after the current index
        const updatedStops = [...editedTrip.stops];
        updatedStops.splice(index + 1, 0, newStop);
        const updatedTrip = {
            ...editedTrip,
            stops: updatedStops
        };
        setEditedTrip(updatedTrip);
        if (onUpdateTrip) {
            onUpdateTrip(updatedTrip);
        }
    };
    // Handle updating a stop
    const handleUpdateStop = (index, updatedStop) => {
        if (!editedTrip)
            return;
        const updatedStops = [...editedTrip.stops];
        updatedStops[index] = updatedStop;
        // Update subsequent stops' dates based on the change
        for (let i = index + 1; i < updatedStops.length; i++) {
            const previousStop = updatedStops[i - 1];
            const currentStop = updatedStops[i];
            // Calculate new arrival date based on previous stop's departure
            const newArrivalDate = new Date(previousStop.arrivalDate);
            newArrivalDate.setDate(newArrivalDate.getDate() + previousStop.nights);
            // Calculate new departure date based on current stop's nights
            const newDepartureDate = new Date(newArrivalDate);
            newDepartureDate.setDate(newDepartureDate.getDate() + currentStop.nights);
            updatedStops[i] = {
                ...currentStop,
                arrivalDate: newArrivalDate,
                departureDate: newDepartureDate
            };
        }
        // Calculate new end date based on last stop
        const lastStop = updatedStops[updatedStops.length - 1];
        const newEndDate = new Date(lastStop.arrivalDate);
        newEndDate.setDate(newEndDate.getDate() + lastStop.nights);
        const updatedTrip = {
            ...editedTrip,
            stops: updatedStops,
            endDate: newEndDate
        };
        setEditedTrip(updatedTrip);
        if (onUpdateTrip) {
            onUpdateTrip(updatedTrip);
        }
    };
    // Handle removing a stop
    const handleRemoveStop = (index) => {
        if (!editedTrip)
            return;
        const updatedStops = editedTrip.stops.filter((_, i) => i !== index);
        // Update dates for all stops after the removed stop
        for (let i = index; i < updatedStops.length; i++) {
            const previousStop = updatedStops[i - 1];
            const currentStop = updatedStops[i];
            // If this is the first stop after removal, use the previous stop's dates
            if (i === index && previousStop) {
                const newArrivalDate = new Date(previousStop.arrivalDate);
                newArrivalDate.setDate(newArrivalDate.getDate() + previousStop.nights);
                const newDepartureDate = new Date(newArrivalDate);
                newDepartureDate.setDate(newDepartureDate.getDate() + currentStop.nights);
                updatedStops[i] = {
                    ...currentStop,
                    arrivalDate: newArrivalDate,
                    departureDate: newDepartureDate
                };
            }
            // For subsequent stops, calculate based on the previous stop
            else if (i > index) {
                const newArrivalDate = new Date(previousStop.arrivalDate);
                newArrivalDate.setDate(newArrivalDate.getDate() + previousStop.nights);
                const newDepartureDate = new Date(newArrivalDate);
                newDepartureDate.setDate(newDepartureDate.getDate() + currentStop.nights);
                updatedStops[i] = {
                    ...currentStop,
                    arrivalDate: newArrivalDate,
                    departureDate: newDepartureDate
                };
            }
        }
        // Calculate new end date based on last stop
        const lastStop = updatedStops[updatedStops.length - 1];
        const newEndDate = lastStop ? new Date(lastStop.arrivalDate) : editedTrip.startDate;
        if (lastStop) {
            newEndDate.setDate(newEndDate.getDate() + lastStop.nights);
        }
        const updatedTrip = {
            ...editedTrip,
            stops: updatedStops,
            endDate: newEndDate
        };
        setEditedTrip(updatedTrip);
        if (onUpdateTrip) {
            onUpdateTrip(updatedTrip);
        }
    };
    // Handle moving a stop up or down
    const handleMoveStop = (index, direction) => {
        if (!editedTrip)
            return;
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= editedTrip.stops.length)
            return;
        const updatedStops = [...editedTrip.stops];
        const temp = updatedStops[index];
        updatedStops[index] = updatedStops[newIndex];
        updatedStops[newIndex] = temp;
        // Update dates for all stops after the moved ones
        for (let i = Math.min(index, newIndex); i < updatedStops.length; i++) {
            const previousStop = updatedStops[i - 1];
            const currentStop = updatedStops[i];
            if (i === 0) {
                // First stop uses trip start date
                currentStop.arrivalDate = editedTrip.startDate;
                currentStop.departureDate = new Date(new Date(currentStop.arrivalDate).getTime() + (currentStop.nights * 24 * 60 * 60 * 1000));
            }
            else {
                // Calculate based on previous stop
                currentStop.arrivalDate = new Date(new Date(previousStop.arrivalDate).getTime() + (previousStop.nights * 24 * 60 * 60 * 1000));
                currentStop.departureDate = new Date(new Date(currentStop.arrivalDate).getTime() + (currentStop.nights * 24 * 60 * 60 * 1000));
            }
        }
        // Calculate new end date based on last stop
        const lastStop = updatedStops[updatedStops.length - 1];
        const newEndDate = new Date(new Date(lastStop.arrivalDate).getTime() + (lastStop.nights * 24 * 60 * 60 * 1000));
        const updatedTrip = {
            ...editedTrip,
            stops: updatedStops,
            endDate: newEndDate
        };
        setEditedTrip(updatedTrip);
        if (onUpdateTrip) {
            onUpdateTrip(updatedTrip);
        }
    };
    // If no trip is selected
    if (!trip) {
        return (React.createElement("div", { className: "h-full flex flex-col items-center justify-center bg-white p-8" },
            React.createElement("div", { className: "text-center" },
                React.createElement(outline_1.MapPinIcon, { className: "h-12 w-12 mx-auto text-gray-400 mb-4" }),
                React.createElement("h2", { className: "text-xl font-semibold text-gray-700 mb-2" }, "No Trip Selected"),
                React.createElement("p", { className: "text-gray-500 mb-6" }, "Select an existing trip or create a new one"),
                React.createElement(link_1.default, { href: "/trips/new", className: "inline-flex items-center px-4 py-2 bg-[#FFD166] text-[#264653] rounded-md hover:bg-[#FFC233] font-medium" }, "Create New Trip"))));
    }
    return (React.createElement("div", { className: "bg-white h-full flex flex-col" },
        React.createElement("div", { className: "p-4 border-b border-gray-200" },
            React.createElement("div", { className: "flex justify-between items-start" },
                isEditing ? (React.createElement("input", { type: "text", value: editedTrip?.name || "", onChange: (e) => editedTrip && setEditedTrip({ ...editedTrip, name: e.target.value }), className: "text-xl font-bold text-[#264653] border-b border-[#FFD166] focus:outline-none" })) : (React.createElement("h1", { className: "text-xl font-bold text-[#264653]" }, trip.name)),
                React.createElement("div", { className: "flex space-x-2" }, isEditing ? (React.createElement(React.Fragment, null,
                    React.createElement("button", { onClick: handleSaveChanges, className: "text-[#06D6A0] hover:text-[#05C090]", "aria-label": "Save changes" },
                        React.createElement(outline_1.CheckIcon, { className: "h-5 w-5" })),
                    React.createElement("button", { onClick: handleCancelEdit, className: "text-[#F94144] hover:text-[#E53E41]", "aria-label": "Cancel edit" },
                        React.createElement(outline_1.XMarkIcon, { className: "h-5 w-5" })))) : (React.createElement(React.Fragment, null,
                    React.createElement("button", { onClick: () => setIsEditing(true), className: "text-[#264653] hover:text-[#06D6A0]", "aria-label": "Edit trip" },
                        React.createElement(outline_1.PencilIcon, { className: "h-5 w-5" })),
                    React.createElement("button", { onClick: handleDeleteTrip, className: "text-[#264653] hover:text-[#F94144]", "aria-label": "Delete trip" },
                        React.createElement(outline_1.TrashIcon, { className: "h-5 w-5" })))))),
            React.createElement("div", { className: "flex items-center text-sm text-[#264653] mt-2" },
                React.createElement(outline_1.CalendarIcon, { className: "h-4 w-4 mr-1 flex-shrink-0" }),
                React.createElement("span", null,
                    (0, utils_1.formatDate)(trip.startDate),
                    " to ",
                    (0, utils_1.formatDate)(trip.endDate)),
                trip.travelers && trip.travelers > 0 && (React.createElement("div", { className: "flex items-center ml-4" },
                    React.createElement(outline_1.UsersIcon, { className: "h-4 w-4 mr-1 flex-shrink-0" }),
                    React.createElement("span", null,
                        trip.travelers,
                        " ",
                        trip.travelers === 1 ? 'person' : 'people')))),
            isEditing ? (React.createElement("textarea", { value: editedTrip?.notes || "", onChange: (e) => editedTrip && setEditedTrip({ ...editedTrip, notes: e.target.value }), placeholder: "Add notes about your trip...", className: "mt-2 text-sm text-[#264653] w-full border border-gray-200 rounded p-2", rows: 2 })) : (trip.notes && React.createElement("p", { className: "mt-2 text-sm text-[#264653]" }, trip.notes))),
        React.createElement("div", { className: "p-4 bg-[#FAF3E0]" },
            React.createElement("div", { className: "flex justify-between items-center mb-1" },
                React.createElement("h2", { className: "text-lg font-medium text-[#264653]" }, "Trip Itinerary"),
                React.createElement("span", { className: "text-sm text-[#264653]" },
                    trip.stops.length,
                    " stops"))),
        React.createElement("div", { className: "flex-1 overflow-auto" },
            trip.stops.length > 0 ? (React.createElement("div", null, (isEditing ? editedTrip?.stops ?? [] : trip.stops).map((stop, index) => (React.createElement(StopCard, { key: `${stop.city.id}-${index}`, stop: stop, index: index, isSelected: index === selectedStopIndex, onClick: () => onSelectStop && onSelectStop(index), isLastStop: index === trip.stops.length - 1, isEditing: isEditing, onRemove: () => handleRemoveStop(index), onUpdate: (updatedStop) => handleUpdateStop(index, updatedStop), onAddDestinationAfter: handleAddDestinationAfter, onMove: handleMoveStop, editedTrip: editedTrip }))))) : (React.createElement("div", { className: "text-center py-8" },
                React.createElement("p", { className: "text-[#264653]" }, "No stops added to this trip yet"),
                React.createElement("button", { onClick: () => setShowAddDestination(true), className: "inline-flex items-center mt-4 px-4 py-2 text-sm text-[#06D6A0]" },
                    React.createElement(outline_1.PlusIcon, { className: "h-4 w-4 mr-1" }),
                    "Add Stops"))),
            showAddDestination && (React.createElement("div", { className: "p-4 bg-[#FAF3E0] border-t border-gray-200" },
                React.createElement("h3", { className: "font-medium text-[#264653] mb-2" }, "Add New Destination"),
                React.createElement("div", { className: "space-y-2" },
                    React.createElement("div", { className: "flex space-x-2" },
                        React.createElement("select", { value: newDestination, onChange: (e) => setNewDestination(e.target.value), className: "flex-1 rounded border border-gray-200 p-2" },
                            React.createElement("option", { value: "" }, "Select a city"),
                            cities_1.cities
                                .filter(city => !editedTrip?.stops.some(stop => stop.city.id === city.id))
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map(city => (React.createElement("option", { key: city.id, value: city.id },
                                city.name,
                                ", ",
                                city.country)))),
                        React.createElement("button", { onClick: (e) => {
                                e.preventDefault();
                                if (handleAddDestinationAfter) {
                                    handleAddDestinationAfter(-1, newDestination);
                                    setShowAddDestination(false);
                                    setNewDestination("");
                                }
                            }, disabled: !newDestination, className: "bg-[#06D6A0] text-white px-4 py-2 rounded disabled:opacity-50" }, "Add"),
                        React.createElement("button", { onClick: () => setShowAddDestination(false), className: "px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50" }, "Cancel")),
                    React.createElement("div", { className: "flex items-center space-x-2" },
                        React.createElement("div", { className: "flex-1 border-t border-gray-300 my-2" },
                            React.createElement("span", { className: "bg-white px-2 text-sm text-gray-500" }, "or"))),
                    React.createElement("div", { className: "flex space-x-2" },
                        React.createElement("input", { type: "text", value: newDestinationInput, onChange: (e) => setNewDestinationInput(e.target.value), placeholder: "Type a custom destination", className: "flex-1 rounded border border-gray-200 p-2" }),
                        React.createElement("button", { onClick: () => handleAddCustomDestination(), disabled: !newDestinationInput, className: "bg-[#06D6A0] text-white px-4 py-2 rounded disabled:opacity-50" }, "Add"))))),
            trip.stops.length > 0 && !showAddDestination && (React.createElement("div", { className: "p-4 border-t border-gray-200 flex justify-center" },
                React.createElement("button", { onClick: () => setShowAddDestination(true), className: "flex items-center text-[#06D6A0] hover:text-[#05C090]" },
                    React.createElement(outline_1.PlusIcon, { className: "h-5 w-5 mr-1" }),
                    React.createElement("span", null, "Add New Destination"))))),
        React.createElement("div", { className: "p-3 bg-[#FAF3E0] border-t border-gray-200" },
            React.createElement("div", { className: "grid grid-cols-2 gap-3" },
                React.createElement("button", { onClick: isEditing ? handleSaveChanges : () => setIsEditing(true), className: "flex justify-center items-center py-2 bg-[#FFD166] text-[#264653] rounded text-sm font-medium hover:bg-[#FFC233]" }, isEditing ? "Save Changes" : "Edit Trip"),
                React.createElement("button", { className: "flex justify-center items-center py-2 bg-white border border-gray-300 rounded text-sm font-medium text-[#264653] hover:bg-gray-50" }, "Share")),
            React.createElement("div", { className: "flex justify-center mt-2 text-xs text-[#264653]" },
                React.createElement("div", { className: "flex items-center" },
                    React.createElement("span", { className: "w-3 h-3 rounded-full bg-[#06D6A0] mr-1" }),
                    React.createElement("span", null, "Autosave"))))));
}
function StopCard({ stop, index, isSelected = false, onClick, isLastStop = false, isEditing = false, onRemove, onUpdate, onAddDestinationAfter, onMove, editedTrip }) {
    const [showHostels, setShowHostels] = (0, react_1.useState)(false);
    const [editedCityName, setEditedCityName] = (0, react_1.useState)(stop.city.name);
    const [editedNights, setEditedNights] = (0, react_1.useState)(stop.nights || 0);
    const [showAddDestination, setShowAddDestination] = (0, react_1.useState)(false);
    const [newDestination, setNewDestination] = (0, react_1.useState)("");
    // Handle nights adjustment
    const handleNightsChange = (delta) => {
        const newNights = Math.max(0, editedNights + delta);
        setEditedNights(newNights);
        if (onUpdate) {
            onUpdate({
                ...stop,
                nights: newNights,
                departureDate: new Date(new Date(stop.arrivalDate).getTime() + (newNights * 24 * 60 * 60 * 1000))
            });
        }
    };
    // Dummy data for the reference design
    const hostels = [
        { name: "AdHoc Hostel", rating: 9.4, price: "€32" },
        { name: "Hostel Celica", rating: 9.3, price: "€29" },
        { name: "Party Hostel ZZZ", rating: 7.9, price: "€31" },
        { name: "Aladin hostel", rating: 8.8, price: "€28" },
        { name: "Hostel Vrba", rating: 8.5, price: "€35" },
    ];
    // Determine what kind of stop it is
    const isStartStop = index === 0;
    const isStopover = !isStartStop && !isLastStop && (stop.nights === 0 || !stop.nights);
    return (React.createElement("div", { className: "border-b border-gray-200" },
        React.createElement("div", { className: "p-4" },
            React.createElement("div", { className: "flex justify-between items-start" },
                React.createElement("div", { className: "flex-1" },
                    React.createElement("div", { className: "flex items-center" },
                        React.createElement("h3", { className: "font-medium text-[#264653]" }, stop.city.name),
                        isEditing && (React.createElement("button", { onClick: onRemove, className: "ml-2 text-[#F94144] hover:text-[#E53E41] p-1 rounded-full hover:bg-red-50", title: "Remove stop" },
                            React.createElement(outline_1.TrashIcon, { className: "h-4 w-4" })))),
                    stop.arrivalDate && (React.createElement("div", { className: "text-sm text-[#264653]/70 mt-1" },
                        (0, utils_1.formatDate)(stop.arrivalDate),
                        " - ",
                        (0, utils_1.formatDate)(new Date(new Date(stop.arrivalDate).getTime() + (stop.nights * 24 * 60 * 60 * 1000)))))),
                React.createElement("div", { className: "flex items-center space-x-2 bg-[#FAF3E0] p-2 rounded-lg" },
                    React.createElement("button", { onClick: () => handleNightsChange(-1), className: "text-[#264653] hover:text-[#06D6A0] p-1.5 rounded-full border border-gray-200 hover:border-[#06D6A0] hover:bg-white transition-colors", title: "Decrease nights" },
                        React.createElement(outline_1.MinusIcon, { className: "h-4 w-4" })),
                    React.createElement("div", { className: "min-w-[80px] text-center" },
                        React.createElement("div", { className: "font-medium text-[#264653]" }, editedNights),
                        React.createElement("div", { className: "text-xs text-[#264653]/70" }, "nights")),
                    React.createElement("button", { onClick: () => handleNightsChange(1), className: "text-[#264653] hover:text-[#06D6A0] p-1.5 rounded-full border border-gray-200 hover:border-[#06D6A0] hover:bg-white transition-colors", title: "Increase nights" },
                        React.createElement(outline_1.PlusIcon, { className: "h-4 w-4" }))))),
        stop.nights > 0 && (React.createElement("div", { className: "bg-[#FAF3E0] border-t border-gray-200" },
            React.createElement("div", { className: "px-4 py-2 flex justify-between items-center cursor-pointer hover:bg-[#FAF3E0]/80", onClick: () => setShowHostels(!showHostels) },
                React.createElement("span", { className: "font-medium text-sm text-[#264653]" },
                    "Hostels in ",
                    stop.city.name),
                showHostels ? (React.createElement(outline_1.ChevronUpIcon, { className: "h-4 w-4 text-[#264653]" })) : (React.createElement(outline_1.ChevronDownIcon, { className: "h-4 w-4 text-[#264653]" }))),
            showHostels && (React.createElement("div", { className: "p-2 space-y-2" },
                hostels.map((hostel, i) => (React.createElement("div", { key: i, className: "flex justify-between items-center p-2 text-sm" },
                    React.createElement("div", null,
                        React.createElement("div", { className: i === 0 ? "text-[#06D6A0] font-medium" : "text-[#264653]" }, hostel.name),
                        React.createElement("div", { className: "flex items-center" },
                            React.createElement("span", { className: "text-xs font-medium bg-[#06D6A0]/20 text-[#06D6A0] px-1 rounded" }, hostel.rating),
                            React.createElement("span", { className: "text-xs text-[#264653]/70 ml-1" },
                                "from ",
                                hostel.price)))))),
                React.createElement("div", { className: "text-right px-2" },
                    React.createElement(link_1.default, { href: "#", className: "text-[#06D6A0] text-xs" }, "See all 21 hostels")))))),
        !isLastStop && (React.createElement("div", { className: "border-t border-gray-200 flex items-stretch" },
            React.createElement("div", { className: "flex-none p-2 flex flex-col items-center justify-center space-y-2" },
                React.createElement("button", { onClick: () => setShowAddDestination(true), className: "w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center text-[#264653] hover:bg-[#FAF3E0] hover:border-[#06D6A0] hover:text-[#06D6A0] transition-colors", title: "Add destination after this stop" },
                    React.createElement(outline_1.PlusIcon, { className: "h-4 w-4" })),
                React.createElement("div", { className: "flex flex-col space-y-1" },
                    React.createElement("button", { onClick: () => onMove && onMove(index, 'up'), disabled: index === 0, className: `w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center text-[#264653] transition-colors ${index === 0
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-[#FAF3E0] hover:border-[#FFD166] hover:text-[#FFD166]'}`, title: "Move stop up" },
                        React.createElement(outline_1.ChevronUpIcon, { className: "h-4 w-4" })),
                    React.createElement("button", { onClick: () => onMove && onMove(index, 'down'), disabled: isLastStop, className: `w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center text-[#264653] transition-colors ${isLastStop
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-[#FAF3E0] hover:border-[#FFD166] hover:text-[#FFD166]'}`, title: "Move stop down" },
                        React.createElement(outline_1.ChevronDownIcon, { className: "h-4 w-4" })))),
            React.createElement("div", { className: "grow flex items-center bg-[#FFD166]/30 p-2" },
                React.createElement(outline_1.SunIcon, { className: "h-6 w-6 text-[#FFD166] mr-2" }),
                React.createElement("div", { className: "flex-1" },
                    React.createElement("div", { className: "font-medium text-[#264653]" }, "~10h 10m"),
                    React.createElement("div", { className: "text-sm text-[#264653]" }, "View trains"))),
            React.createElement("div", { className: "flex-none bg-[#FAF3E0] p-2 flex items-center justify-center" },
                React.createElement("div", { className: "w-12 h-6 bg-gray-200 rounded-full flex items-center justify-end p-1 cursor-pointer" },
                    React.createElement("div", { className: "w-4 h-4 bg-white rounded-full" }))))),
        showAddDestination && (React.createElement("div", { className: "p-4 bg-[#FAF3E0] border-t border-gray-200" },
            React.createElement("h3", { className: "font-medium text-[#264653] mb-2" }, "Add New Destination"),
            React.createElement("div", { className: "space-y-2" },
                React.createElement("div", { className: "flex space-x-2" },
                    React.createElement("select", { value: newDestination, onChange: (e) => setNewDestination(e.target.value), className: "flex-1 rounded border border-gray-200 p-2" },
                        React.createElement("option", { value: "" }, "Select a city"),
                        cities_1.cities
                            .filter(city => !editedTrip?.stops.some(stop => stop.city.id === city.id))
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map(city => (React.createElement("option", { key: city.id, value: city.id },
                            city.name,
                            ", ",
                            city.country)))),
                    React.createElement("button", { onClick: (e) => {
                            e.preventDefault();
                            if (onAddDestinationAfter) {
                                onAddDestinationAfter(index, newDestination);
                                setShowAddDestination(false);
                                setNewDestination("");
                            }
                        }, disabled: !newDestination, className: "bg-[#06D6A0] text-white px-4 py-2 rounded disabled:opacity-50" }, "Add"),
                    React.createElement("button", { onClick: () => setShowAddDestination(false), className: "px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50" }, "Cancel")))))));
}
//# sourceMappingURL=TripItinerary.js.map