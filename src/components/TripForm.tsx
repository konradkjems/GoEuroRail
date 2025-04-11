import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { cities } from "@/lib/cities";
import { Trip, FormTrip, FormTripStop } from "@/types";
import { formatDate } from "@/lib/utils";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface TripFormProps {
  initialData?: FormTrip;
  onSubmit: (data: FormTrip) => void;
  isSubmitting?: boolean;
}

const DEFAULT_STOP: FormTripStop = {
  cityId: "",
  arrivalDate: "",
  departureDate: "",
  nights: 1,
  accommodation: "",
  notes: ""
};

export default function TripForm({ initialData, onSubmit, isSubmitting = false }: TripFormProps) {
  const isEditing = !!initialData;
  
  // Convert trip data to form format if editing
  const defaultValues: FormTrip = isEditing
    ? {
        _id: initialData._id,
        name: initialData.name,
        startDate: initialData.startDate,
        endDate: initialData.endDate,
        notes: initialData.notes,
        stops: initialData.stops.map(stop => ({
          cityId: stop.cityId,
          arrivalDate: stop.arrivalDate,
          departureDate: stop.departureDate,
          nights: stop.nights || 1,
          accommodation: stop.accommodation || '',
          notes: stop.notes || ''
        }))
      }
    : {
        _id: Date.now().toString(),
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
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`stops.${index}.useInterrailPass`}
                    {...register(`stops.${index}.useInterrailPass` as const)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`stops.${index}.useInterrailPass`}
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Use Interrail Pass for this journey
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Toggle this if you plan to use your Interrail pass for this train journey
                </p>
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
          disabled={isSubmitting}
          className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
            isSubmitting ? 'bg-[#06D6A0]/70' : 'bg-[#06D6A0] hover:bg-[#05c091]'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : isEditing ? 'Update Trip' : 'Create Trip'}
        </button>
      </div>
    </form>
  );
} 