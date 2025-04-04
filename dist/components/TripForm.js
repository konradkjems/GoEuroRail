"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TripForm;
const react_hook_form_1 = require("react-hook-form");
const cities_1 = require("@/lib/cities");
const utils_1 = require("@/lib/utils");
const outline_1 = require("@heroicons/react/24/outline");
const DEFAULT_STOP = {
    cityId: "",
    arrivalDate: "",
    departureDate: "",
    accommodation: "",
    notes: ""
};
function TripForm({ initialData, onSubmit }) {
    const isEditing = !!initialData;
    // Convert trip data to form format if editing
    const defaultValues = isEditing
        ? {
            name: initialData.name,
            startDate: (0, utils_1.formatDate)(initialData.startDate),
            endDate: (0, utils_1.formatDate)(initialData.endDate),
            notes: initialData.notes,
            stops: initialData.stops.map(stop => ({
                cityId: stop.city.id,
                arrivalDate: stop.arrivalDate ? (0, utils_1.formatDate)(stop.arrivalDate) : "",
                departureDate: stop.departureDate ? (0, utils_1.formatDate)(stop.departureDate) : "",
                accommodation: stop.accommodation,
                notes: stop.notes
            }))
        }
        : {
            name: "",
            startDate: "",
            endDate: "",
            notes: "",
            stops: [{ ...DEFAULT_STOP }]
        };
    const { register, control, handleSubmit, formState: { errors } } = (0, react_hook_form_1.useForm)({
        defaultValues
    });
    const { fields, append, remove } = (0, react_hook_form_1.useFieldArray)({
        control,
        name: "stops"
    });
    const handleFormSubmit = (data) => {
        onSubmit(data);
    };
    return (React.createElement("form", { onSubmit: handleSubmit(handleFormSubmit), className: "space-y-6" },
        React.createElement("div", { className: "space-y-4" },
            React.createElement("div", null,
                React.createElement("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-700" }, "Trip Name"),
                React.createElement("input", { id: "name", type: "text", ...register("name", { required: "Trip name is required" }), className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black" }),
                errors.name && (React.createElement("p", { className: "mt-1 text-sm text-red-600" }, errors.name.message))),
            React.createElement("div", { className: "grid grid-cols-2 gap-4" },
                React.createElement("div", null,
                    React.createElement("label", { htmlFor: "startDate", className: "block text-sm font-medium text-gray-700" }, "Start Date"),
                    React.createElement("input", { id: "startDate", type: "date", ...register("startDate", { required: "Start date is required" }), className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black" }),
                    errors.startDate && (React.createElement("p", { className: "mt-1 text-sm text-red-600" }, errors.startDate.message))),
                React.createElement("div", null,
                    React.createElement("label", { htmlFor: "endDate", className: "block text-sm font-medium text-gray-700" }, "End Date"),
                    React.createElement("input", { id: "endDate", type: "date", ...register("endDate", { required: "End date is required" }), className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black" }),
                    errors.endDate && (React.createElement("p", { className: "mt-1 text-sm text-red-600" }, errors.endDate.message)))),
            React.createElement("div", null,
                React.createElement("label", { htmlFor: "notes", className: "block text-sm font-medium text-gray-700" }, "Trip Notes"),
                React.createElement("textarea", { id: "notes", rows: 3, ...register("notes"), className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black" }))),
        React.createElement("div", { className: "border-t border-gray-200 pt-6" },
            React.createElement("h3", { className: "text-lg font-medium text-gray-900 mb-4" }, "Stops"),
            React.createElement("div", { className: "space-y-6" },
                fields.map((field, index) => (React.createElement("div", { key: field.id, className: "p-4 border border-gray-200 rounded-md bg-gray-50 relative" },
                    React.createElement("button", { type: "button", onClick: () => remove(index), className: "absolute top-2 right-2 text-gray-400 hover:text-red-500", "aria-label": "Remove stop" },
                        React.createElement(outline_1.XMarkIcon, { className: "h-5 w-5" })),
                    React.createElement("div", { className: "mb-4" },
                        React.createElement("label", { htmlFor: `stops.${index}.cityId`, className: "block text-sm font-medium text-gray-700" }, "City"),
                        React.createElement("select", { id: `stops.${index}.cityId`, ...register(`stops.${index}.cityId`, {
                                required: "City is required"
                            }), className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black" },
                            React.createElement("option", { value: "", className: "text-black" }, "Select a city"),
                            cities_1.cities.map(city => (React.createElement("option", { key: city.id, value: city.id, className: "text-black" },
                                city.name,
                                ", ",
                                city.country)))),
                        errors.stops?.[index]?.cityId && (React.createElement("p", { className: "mt-1 text-sm text-red-600" }, errors.stops[index]?.cityId?.message))),
                    React.createElement("div", { className: "grid grid-cols-2 gap-4 mb-4" },
                        React.createElement("div", null,
                            React.createElement("label", { htmlFor: `stops.${index}.arrivalDate`, className: "block text-sm font-medium text-gray-700" }, "Arrival Date"),
                            React.createElement("input", { id: `stops.${index}.arrivalDate`, type: "date", ...register(`stops.${index}.arrivalDate`), className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black" })),
                        React.createElement("div", null,
                            React.createElement("label", { htmlFor: `stops.${index}.departureDate`, className: "block text-sm font-medium text-gray-700" }, "Departure Date"),
                            React.createElement("input", { id: `stops.${index}.departureDate`, type: "date", ...register(`stops.${index}.departureDate`), className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black" }))),
                    React.createElement("div", { className: "mb-4" },
                        React.createElement("label", { htmlFor: `stops.${index}.accommodation`, className: "block text-sm font-medium text-gray-700" }, "Accommodation"),
                        React.createElement("input", { id: `stops.${index}.accommodation`, type: "text", ...register(`stops.${index}.accommodation`), className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black", placeholder: "Hotel, hostel, Airbnb, etc." })),
                    React.createElement("div", null,
                        React.createElement("label", { htmlFor: `stops.${index}.notes`, className: "block text-sm font-medium text-gray-700" }, "Notes"),
                        React.createElement("textarea", { id: `stops.${index}.notes`, rows: 2, ...register(`stops.${index}.notes`), className: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black", placeholder: "Activities, important information, etc." }))))),
                React.createElement("button", { type: "button", onClick: () => append({ ...DEFAULT_STOP }), className: "flex items-center justify-center w-full py-2 px-4 border border-dashed border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:text-blue-500 hover:border-blue-300 focus:outline-none" },
                    React.createElement(outline_1.PlusIcon, { className: "h-5 w-5 mr-1" }),
                    "Add Another Stop"))),
        React.createElement("div", { className: "flex justify-end" },
            React.createElement("button", { type: "submit", className: "px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500" }, isEditing ? "Update Trip" : "Create Trip"))));
}
//# sourceMappingURL=TripForm.js.map