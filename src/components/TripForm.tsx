import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { cities } from "@/lib/cities";
import { Trip, FormTrip, FormTripStop } from "@/types";
import { formatDate } from "@/lib/utils";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface TripFormProps {
  initialData?: Trip;
  onSubmit: (data: FormTrip) => void;
}

const DEFAULT_STOP: FormTripStop = {
  cityId: "",
  arrivalDate: "",
  departureDate: "",
  accommodation: "",
  notes: ""
};

export default function TripForm({ initialData, onSubmit }: TripFormProps) {
  const isEditing = !!initialData;
  
  // Convert trip data to form format if editing
  const defaultValues: FormTrip = isEditing
    ? {
        name: initialData.name,
        startDate: formatDate(initialData.startDate),
        endDate: formatDate(initialData.endDate),
        notes: initialData.notes,
        stops: initialData.stops.map(stop => ({
          cityId: stop.city.id,
          arrivalDate: stop.arrivalDate ? formatDate(stop.arrivalDate) : "",
          departureDate: stop.departureDate ? formatDate(stop.departureDate) : "",
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

  const { register, control, handleSubmit, formState: { errors } } = useForm<FormTrip>({
    defaultValues
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "stops"
  });

  const handleFormSubmit = (data: FormTrip) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Trip Name
          </label>
          <input
            id="name"
            type="text"
            {...register("name", { required: "Trip name is required" })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              {...register("startDate", { required: "Start date is required" })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              {...register("endDate", { required: "End date is required" })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Trip Notes
          </label>
          <textarea
            id="notes"
            rows={3}
            {...register("notes")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
          />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Stops</h3>
        
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div 
              key={field.id} 
              className="p-4 border border-gray-200 rounded-md bg-gray-50 relative"
            >
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                aria-label="Remove stop"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
              
              <div className="mb-4">
                <label 
                  htmlFor={`stops.${index}.cityId`} 
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <select
                  id={`stops.${index}.cityId`}
                  {...register(`stops.${index}.cityId` as const, { 
                    required: "City is required" 
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                >
                  <option value="" className="text-black">Select a city</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id} className="text-black">
                      {city.name}, {city.country}
                    </option>
                  ))}
                </select>
                {errors.stops?.[index]?.cityId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.stops[index]?.cityId?.message}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label 
                    htmlFor={`stops.${index}.arrivalDate`} 
                    className="block text-sm font-medium text-gray-700"
                  >
                    Arrival Date
                  </label>
                  <input
                    id={`stops.${index}.arrivalDate`}
                    type="date"
                    {...register(`stops.${index}.arrivalDate` as const)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor={`stops.${index}.departureDate`} 
                    className="block text-sm font-medium text-gray-700"
                  >
                    Departure Date
                  </label>
                  <input
                    id={`stops.${index}.departureDate`}
                    type="date"
                    {...register(`stops.${index}.departureDate` as const)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label 
                  htmlFor={`stops.${index}.accommodation`} 
                  className="block text-sm font-medium text-gray-700"
                >
                  Accommodation
                </label>
                <input
                  id={`stops.${index}.accommodation`}
                  type="text"
                  {...register(`stops.${index}.accommodation` as const)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="Hotel, hostel, Airbnb, etc."
                />
              </div>
              
              <div>
                <label 
                  htmlFor={`stops.${index}.notes`} 
                  className="block text-sm font-medium text-gray-700"
                >
                  Notes
                </label>
                <textarea
                  id={`stops.${index}.notes`}
                  rows={2}
                  {...register(`stops.${index}.notes` as const)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                  placeholder="Activities, important information, etc."
                />
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => append({ ...DEFAULT_STOP })}
            className="flex items-center justify-center w-full py-2 px-4 border border-dashed border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:text-blue-500 hover:border-blue-300 focus:outline-none"
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            Add Another Stop
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isEditing ? "Update Trip" : "Create Trip"}
        </button>
      </div>
    </form>
  );
} 