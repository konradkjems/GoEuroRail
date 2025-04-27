import React from "react";
import { FormTripStop, City } from "@/types";
import { formatDate } from "@/lib/utils";
import {
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  PencilIcon,
  ArrowRightIcon,
  HomeIcon,
  InformationCircleIcon,
  MoonIcon,
  RocketLaunchIcon
} from "@heroicons/react/24/outline";

// TrainIcon is not directly available, using RocketLaunchIcon as a substitute
const TrainIcon = RocketLaunchIcon;

interface TripItineraryItemProps {
  stop: FormTripStop;
  city: City | undefined;
  index: number;
  isSelected: boolean;
  isLastStop: boolean;
  onSelect: () => void;
  onUpdate: (updatedStop: Partial<FormTripStop>) => void;
  onTransportClick: () => void;
}

export default function TripItineraryItem({
  stop,
  city,
  index,
  isSelected,
  isLastStop,
  onSelect,
  onUpdate,
  onTransportClick
}: TripItineraryItemProps) {
  if (!city) {
    return (
      <div className="border rounded-lg p-4 bg-gray-50">
        <p className="text-red-500">City not found (ID: {stop.cityId})</p>
      </div>
    );
  }

  const arrivalDate = new Date(stop.arrivalDate);
  const departureDate = new Date(stop.departureDate);
  
  // Calculate nights
  const nights = Math.round((departureDate.getTime() - arrivalDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div 
      className={`border rounded-lg overflow-hidden transition-all ${
        isSelected ? 'ring-2 ring-blue-500 border-blue-500' : 'hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      <div className="flex border-b">
        {/* Left column - City and dates */}
        <div className="p-4 flex-1">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            {city.name}
            <button 
              className="ml-1 text-gray-400 hover:text-gray-600"
              onClick={(e) => {
                e.stopPropagation();
                // Show city info (not implemented yet)
              }}
            >
              <InformationCircleIcon className="h-4 w-4" />
            </button>
          </h3>
          <p className="text-sm text-gray-500">{city.country}</p>
          
          <div className="mt-3 flex items-center text-sm text-gray-600">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>{formatDate(stop.arrivalDate)} - {formatDate(stop.departureDate)}</span>
          </div>
          
          <div className="mt-1 flex items-center text-sm text-gray-600">
            <MoonIcon className="h-4 w-4 mr-1" />
            <span>{nights} night{nights !== 1 ? 's' : ''}</span>
          </div>
        </div>
        
        {/* Right column - Transport */}
        {!isLastStop && (
          <div 
            className="w-24 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              onTransportClick();
            }}
          >
            <TrainIcon className="h-6 w-6 text-gray-500" />
            <span className="text-xs text-gray-500 mt-1">Transport</span>
            {stop.trainDetails && (
              <div className="text-xs text-gray-500 mt-1 px-2 text-center">
                {stop.trainDetails.duration}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Bottom section - Accommodation */}
      {stop.accommodation && (
        <div className="p-3 bg-gray-50 border-t">
          <div className="flex items-start">
            <HomeIcon className="h-4 w-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-900 font-medium">Accommodation</p>
              <p className="text-sm text-gray-600">{stop.accommodation}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Notes section */}
      {stop.notes && (
        <div className="p-3 bg-gray-50 border-t">
          <div className="flex items-start">
            <InformationCircleIcon className="h-4 w-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-900 font-medium">Notes</p>
              <p className="text-sm text-gray-600">{stop.notes}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 