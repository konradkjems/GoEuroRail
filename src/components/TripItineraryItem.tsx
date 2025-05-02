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
  RocketLaunchIcon,
  TruckIcon,
  LinkIcon
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

  // Get transport details (using either customTransport or legacy trainDetails)
  const hasTransport = stop.customTransport || stop.trainDetails;
  const isTrainTransport = stop.customTransport ? stop.customTransport.transportType === "train" : true;
  
  // Format transport time nicely
  const formatTime = (time: string) => {
    if (!time) return "";
    // If time is in 24-hour format (e.g., "14:30"), convert to 12-hour format
    const [hour, minute] = time.split(":");
    const hourNum = parseInt(hour, 10);
    const ampm = hourNum >= 12 ? "PM" : "AM";
    const hour12 = hourNum % 12 || 12;
    return `${hour12}:${minute} ${ampm}`;
  };

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
            {isTrainTransport ? (
              <TrainIcon className="h-6 w-6 text-gray-500" />
            ) : (
              <TruckIcon className="h-6 w-6 text-gray-500" />
            )}
            <span className="text-xs text-gray-500 mt-1">
              {hasTransport ? (isTrainTransport ? 'Train' : 'Bus') : 'Transport'}
            </span>
            {stop.customTransport && (
              <div className="text-xs text-center text-gray-500 mt-1 px-2">
                {formatTime(stop.customTransport.departureTime)}
              </div>
            )}
            {stop.trainDetails && !stop.customTransport && (
              <div className="text-xs text-center text-gray-500 mt-1 px-2">
                {stop.trainDetails.duration}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Transport Details Section - Show if available */}
      {stop.customTransport && (
        <div className="p-3 bg-gray-50 border-t">
          <div className="flex items-start">
            {isTrainTransport ? (
              <TrainIcon className="h-4 w-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
            ) : (
              <TruckIcon className="h-4 w-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
            )}
            <div>
              <p className="text-sm text-gray-900 font-medium">
                {isTrainTransport ? 'Train' : 'Bus'} Details
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                <p className="text-xs text-gray-600">
                  Departure: {formatTime(stop.customTransport.departureTime)}
                </p>
                <p className="text-xs text-gray-600">
                  Arrival: {formatTime(stop.customTransport.arrivalTime)}
                </p>
                {stop.customTransport.operator && (
                  <p className="text-xs text-gray-600 col-span-2">
                    Operator: {stop.customTransport.operator}
                  </p>
                )}
                {stop.customTransport.link && (
                  <a 
                    href={stop.customTransport.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 col-span-2 inline-flex items-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <LinkIcon className="h-3 w-3 mr-1" />
                    View booking
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
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