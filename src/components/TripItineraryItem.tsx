import React, { useState } from 'react';
import { 
  PlusCircleIcon, 
  MinusCircleIcon,
  MapPinIcon,
  MoonIcon,
  SparklesIcon,
  PaperAirplaneIcon,
  TruckIcon,
  RocketLaunchIcon,
  ArrowRightIcon,
  TrashIcon,
  PencilIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";
import { FormTripStop, City } from "@/types";
import { cities } from "@/lib/cities";

export interface TripItineraryItemProps {
  stop: FormTripStop;
  index: number;
  isLastStop: boolean;
  onUpdate: (index: number, updatedStop: Partial<FormTripStop>) => void;
  onOpenTransportModal: (index: number) => void;
  onToggleSleeping: (index: number) => void;
  onToggleDiscover: (index: number) => void;
  onDelete: (index: number) => void;
}

export default function TripItineraryItem({
  stop,
  index,
  isLastStop,
  onUpdate,
  onOpenTransportModal,
  onToggleSleeping,
  onToggleDiscover,
  onDelete
}: TripItineraryItemProps) {
  // State for handling UI interactions
  const [isHovering, setIsHovering] = useState(false);
  
  // Find the current city data
  const city = cities.find(c => c.id === stop.cityId);
  if (!city) return null;
  
  // Handle nights adjustment
  const handleAdjustNights = (delta: number) => {
    let newNights = Math.max(0, stop.nights + delta);
    
    // If this is a stopover and we're increasing nights, convert it to a regular stop
    const isStopover = newNights === 0;
    
    onUpdate(index, { 
      nights: newNights,
      isStopover: isStopover 
    });
  };
  
  // Get transport icon based on type
  const getTransportIcon = () => {
    // Default to train
    if (stop.isStopover) {
      return (
        <div className="flex flex-col items-center">
          <div className="bg-[#FFF0E5] text-[#E56E26] p-2 rounded-full">
            <TruckIcon className="h-5 w-5" />
          </div>
          <span className="text-xs mt-1 whitespace-nowrap">Bus</span>
        </div>
      );
    }
    
    return (
      <div className="flex flex-col items-center">
        <div className="bg-[#E9F8F6] text-[#06D6A0] p-2 rounded-full">
          <RocketLaunchIcon className="h-5 w-5" />
        </div>
        <span className="text-xs mt-1 whitespace-nowrap">Train</span>
      </div>
    );
  };
  
  // Format date safely
  const formatDate = (dateString: string): Date | null => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return null;
      }
      return date;
    } catch (error) {
      return null;
    }
  };
  
  // Format date range
  const formatDateRange = () => {
    const arrivalDate = formatDate(stop.arrivalDate);
    const departureDate = formatDate(stop.departureDate);
    
    if (!arrivalDate) {
      return "Invalid Date";
    }
    
    // Get month and day for arrival date
    const arrivalMonth = arrivalDate.toLocaleDateString('en-US', { month: 'short' });
    const arrivalDay = arrivalDate.getDate();
    
    if (stop.isStopover) {
      return `${arrivalMonth} ${arrivalDay}`;
    }
    
    if (!departureDate) {
      return `${arrivalMonth} ${arrivalDay} - Invalid Date`;
    }
    
    // Get month and day for departure date
    const departureMonth = departureDate.toLocaleDateString('en-US', { month: 'short' });
    const departureDay = departureDate.getDate();
    
    return `${arrivalMonth} ${arrivalDay} - ${departureMonth} ${departureDay}`;
  };

  // Create the notes label text
  const notesLabel = stop.notes ? 'Notes' : 'No notes added';
  
  return (
    <div 
      className="py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="grid grid-cols-12 items-center px-4">
        {/* Index circle - column 1 */}
        <div className="col-span-1">
          <div className="w-10 h-10 rounded-full bg-[#E9F8F6] text-[#06D6A0] flex items-center justify-center font-medium">
            {index + 1}
          </div>
        </div>
        
        {/* Destination info - column 2-5 */}
        <div className="col-span-5">
          <div className="flex flex-col">
            <h3 className="text-[#333333] font-medium text-lg flex items-center">
              {city.name} 
              {stop.isStopover && <span className="ml-1 text-xs font-normal text-gray-500 whitespace-nowrap">(Stopover)</span>}
            </h3>
            <div className="flex items-center text-sm text-gray-500 mt-0.5">
              <span>{formatDateRange()}</span>
              {stop.isStopover && <span className="ml-2 text-xs text-gray-500 whitespace-nowrap">(Stopover)</span>}
            </div>
            <div className="text-xs text-gray-500 mt-0.5 flex items-center">
              <span className="text-[#5F6368]">{city.country}</span>
            </div>
            <div className="text-xs text-gray-500 mt-0.5 flex items-center">
              <span className="text-gray-400">{notesLabel}</span>
              {stop.notes && 
                <button className="ml-2 text-[#06D6A0] hover:text-[#05b487]">
                  <PencilIcon className="h-3 w-3" />
                </button>
              }
            </div>
          </div>
        </div>
        
        {/* Nights adjustment - column 6-7 */}
        <div className="col-span-2 flex items-center justify-center space-x-2">
          <button 
            onClick={() => handleAdjustNights(-1)}
            className="p-1 text-[#5F6368] hover:text-[#333333] focus:outline-none"
            disabled={stop.nights <= 0}
          >
            <MinusCircleIcon className={`h-6 w-6 ${stop.nights <= 0 ? 'opacity-30' : ''}`} />
          </button>
          
          <span className="w-8 text-center font-medium text-[#333333]">
            {stop.nights}
          </span>
          
          <button 
            onClick={() => handleAdjustNights(1)}
            className="p-1 text-[#5F6368] hover:text-[#333333] focus:outline-none"
          >
            <PlusCircleIcon className="h-6 w-6" />
          </button>
        </div>
        
        {/* Sleeping button - column 8 */}
        <div className="col-span-1 flex justify-center">
          <button 
            onClick={() => onToggleSleeping(index)}
            className={`p-2 rounded-full ${stop.accommodation ? 'bg-[#E9F8F6] text-[#06D6A0]' : 'bg-gray-100 text-gray-400'}`}
            disabled={stop.isStopover}
            title="Add accommodation details"
          >
            <PlusCircleIcon className="h-5 w-5" />
          </button>
        </div>
        
        {/* Discover button - column 9 */}
        <div className="col-span-1 flex justify-center">
          <button 
            onClick={() => onToggleDiscover(index)}
            className="p-2 rounded-full bg-[#FFF0E5] text-[#E56E26]"
            title="Add activities and points of interest"
          >
            <PlusCircleIcon className="h-5 w-5" />
          </button>
        </div>
        
        {/* Transport - column 10-11 */}
        <div className="col-span-1 flex justify-center">
          <button 
            onClick={() => onOpenTransportModal(index)}
            className="text-center cursor-pointer hover:opacity-80 transition-opacity"
            aria-label="Edit transport details"
            title="Edit transport details"
          >
            {getTransportIcon()}
          </button>
        </div>
        
        {/* Delete button - column 12 */}
        <div className="col-span-1 flex justify-center">
          <button
            onClick={() => onDelete(index)}
            className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-red-500"
            title="Remove this destination"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Connect line to indicate travel path (not visible for the last stop) */}
      {!isLastStop && (
        <div className="ml-5 mt-1 w-px h-5 bg-gray-300"></div>
      )}
    </div>
  );
} 