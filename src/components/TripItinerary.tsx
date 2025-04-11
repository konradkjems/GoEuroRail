import React, { useState, useEffect, useCallback } from "react";
import { TrainConnection } from "@/lib/api/trainSchedule";
import { cities } from "@/lib/cities";
import { FormTrip, FormTripStop, City } from "@/types";
import { 
  CalendarIcon, 
  MapPinIcon, 
  ArrowRightIcon, 
  PencilIcon, 
  TrashIcon, 
  ClockIcon,
  HomeIcon,
  UsersIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SunIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
  MinusIcon,
  ArrowsUpDownIcon,
  RocketLaunchIcon as TrainIcon,
  InformationCircleIcon,
  BuildingOfficeIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import TrainSchedule from "@/components/TrainSchedule";
import SmartTripAssistant from "@/components/SmartTripAssistant";

interface TripItineraryProps {
  trip: FormTrip | null;
  onDeleteTrip?: (id: string) => void;
  selectedStopIndex?: number;
  onSelectStop?: (index: number) => void;
  onUpdateTrip?: (updatedTrip: FormTrip) => void;
}

// Helper function to safely create ISO date strings
const safeISODateString = (date: Date | string): string => {
  try {
    // If date is already a string, convert to Date object
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      // Return today's date as fallback
      return new Date().toISOString().split('T')[0];
    }
    
    return dateObj.toISOString().split('T')[0];
  } catch (error) {
    console.error("Error creating ISO date string:", error);
    // Fallback to today's date
    return new Date().toISOString().split('T')[0];
  }
};

// Helper function to calculate nights between dates
const calculateNights = (arrivalDate: string, departureDate: string): number => {
  const arrival = new Date(arrivalDate);
  const departure = new Date(departureDate);
  return Math.ceil((departure.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24));
};

// Add this interface for the CityInfoModal
interface CityInfoModalProps {
  city: City | null;
  onClose: () => void;
}

// Add this component for the CityInfoModal
const CityInfoModal: React.FC<CityInfoModalProps> = ({ city, onClose }) => {
  if (!city) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#264653]">{city.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-[#264653]">
            <MapPinIcon className="h-5 w-5 text-[#06D6A0]" />
            <span>{city.country}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-[#264653]">
            <BuildingOfficeIcon className="h-5 w-5 text-[#06D6A0]" />
            <span>Population: {city.population.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-[#264653]">
            <InformationCircleIcon className="h-5 w-5 text-[#06D6A0]" />
            <span>Region: {city.region}</span>
          </div>
          
          {city.isTransportHub && (
            <div className="p-2 bg-[#06D6A0]/10 rounded-lg">
              <div className="flex items-center text-[#264653]">
                <TrainIcon className="h-5 w-5 mr-2 text-[#06D6A0]" />
                <span className="font-medium">Major Transport Hub</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                This city is a major transport hub with excellent train connections across Europe.
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded text-[#264653] hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Add a function to determine the color and style of connection lines based on journey time
const getConnectionLineClass = (trainDetails?: { duration: string }) => {
  if (!trainDetails) return "bg-gray-300"; // Default
  
  // Parse the duration (expected format: "3h 45m")
  const durationMatch = trainDetails.duration.match(/(\d+)h(?:\s+(\d+)m)?/);
  if (!durationMatch) return "bg-gray-300";
  
  const hours = parseInt(durationMatch[1], 10);
  const minutes = durationMatch[2] ? parseInt(durationMatch[2], 10) : 0;
  const totalMinutes = hours * 60 + minutes;
  
  if (totalMinutes < 180) return "bg-[#06D6A0]"; // < 3h - Short
  if (totalMinutes < 330) return "bg-[#FFD166]"; // 3h-5h30 - Medium
  return "bg-[#F94144]"; // > 5h30 - Long
};

export default function TripItinerary({ 
  trip, 
  onDeleteTrip, 
  selectedStopIndex = -1,
  onSelectStop,
  onUpdateTrip
}: TripItineraryProps) {
  const [editedTrip, setEditedTrip] = useState<FormTrip | null>(trip);
  const [showAddDestination, setShowAddDestination] = useState(false);
  const [newDestination, setNewDestination] = useState("");
  const [newDestinationInput, setNewDestinationInput] = useState("");
  const [activeSidebarTab, setActiveSidebarTab] = useState<'summary' | 'assistant'>('summary');
  const [isLegendOpen, setIsLegendOpen] = useState(true);
  
  // New state variables for editing trip details
  const [isEditingTripName, setIsEditingTripName] = useState(false);
  const [isEditingTravelers, setIsEditingTravelers] = useState(false);
  const [tempTripName, setTempTripName] = useState("");
  const [tempTravelers, setTempTravelers] = useState<number>(1);

  // New state for city info modal
  const [selectedCityInfo, setSelectedCityInfo] = useState<City | null>(null);

  // Update editedTrip when trip changes
  useEffect(() => {
    setEditedTrip(trip);
    if (trip) {
      setTempTripName(trip.name);
      setTempTravelers(trip.travelers || 1);
    }
  }, [trip]);
  
  // Handle start date change
  const handleStartDateChange = (newStartDate: string) => {
    if (!editedTrip) return;

    const updatedTrip = { ...editedTrip, startDate: newStartDate };
    
    // Update all stops' dates based on the new start date
    if (updatedTrip.stops.length > 0) {
      let currentDate = new Date(newStartDate);
      
      updatedTrip.stops = updatedTrip.stops.map((stop, index) => {
        const arrivalDate = currentDate.toISOString().split('T')[0];
        
        // For stopovers, departure is same day, otherwise add nights
        if (stop.isStopover) {
          return {
            ...stop,
            arrivalDate,
            departureDate: arrivalDate
          };
        } else {
          const nights = stop.nights || 1;
          currentDate = new Date(currentDate.getTime() + (nights * 24 * 60 * 60 * 1000));
          const departureDate = currentDate.toISOString().split('T')[0];
          
          return {
            ...stop,
            arrivalDate,
            departureDate
          };
        }
      });
    }

    setEditedTrip(updatedTrip);
    if (onUpdateTrip) {
      onUpdateTrip(updatedTrip);
    }
  };

  // Add this function to handle showing city info
  const handleShowCityInfo = (cityId: string) => {
    const city = cities.find(c => c.id === cityId);
    setSelectedCityInfo(city || null);
  };

  // Handle adding a new destination
  const handleAddDestination = () => {
    if (!editedTrip || !newDestination) return;
    
    const cityToAdd = cities.find(city => city.id === newDestination);
    if (!cityToAdd) return;
    
    let newStop: FormTripStop = {
      cityId: cityToAdd.id,
      arrivalDate: '',
      departureDate: '',
      nights: 1,
      isStopover: false
    };
    
    // If there are existing stops, calculate the dates based on the last stop
    if (editedTrip.stops.length > 0) {
      const lastStop = editedTrip.stops[editedTrip.stops.length - 1];
      
      // Get the departure date from the last stop (considering stopovers)
      let lastStopDeparture;
      if (lastStop.isStopover) {
        lastStopDeparture = new Date(lastStop.arrivalDate); // Same day departure for stopovers
      } else {
        const lastStopNights = lastStop.nights || 1;
        lastStopDeparture = new Date(lastStop.arrivalDate);
        lastStopDeparture.setDate(lastStopDeparture.getDate() + lastStopNights);
      }
      
      const newArrivalDate = lastStopDeparture.toISOString().split('T')[0];
      const newDepartureDate = new Date(newArrivalDate);
      newDepartureDate.setDate(newDepartureDate.getDate() + 1); // Default to 1 night
      
      newStop = {
        ...newStop,
        arrivalDate: newArrivalDate,
        departureDate: newDepartureDate.toISOString().split('T')[0]
      };
    } else {
      // First stop in the trip, use the trip's start date
      const startDate = new Date(editedTrip.startDate);
      const nextDay = new Date(startDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      newStop = {
        ...newStop,
        arrivalDate: startDate.toISOString().split('T')[0],
        departureDate: nextDay.toISOString().split('T')[0]
      };
    }
    
    // Add the stop to the trip
    const updatedTrip = {
      ...editedTrip,
      stops: [...editedTrip.stops, newStop],
      endDate: newStop.departureDate // Update the end date to the new stop's departure
    };
    
    setEditedTrip(updatedTrip);
    if (onUpdateTrip) {
      onUpdateTrip(updatedTrip);
    }
    
    setNewDestination("");
    setNewDestinationInput("");
    setShowAddDestination(false);
  };

  // Handle adding a destination after a specific stop
  const handleAddDestinationAfter = (index: number, cityId: string) => {
    if (!editedTrip) return;
    
    // Find the city we're adding
    const cityToAdd = cities.find(city => city.id === cityId);
    if (!cityToAdd) return;
    
    // Find the stop we're adding after
    const previousStop = editedTrip.stops[index];
    
    // Calculate arrival date for the new stop
    let arrivalDate;
    if (previousStop.isStopover) {
      // If adding after a stopover, arrive on the same day
      arrivalDate = previousStop.arrivalDate;
    } else {
      // Otherwise, arrive after the previous stop's nights
      const prevArrival = new Date(previousStop.arrivalDate);
      const prevNights = previousStop.nights || 1;
      arrivalDate = new Date(prevArrival.getTime() + (prevNights * 24 * 60 * 60 * 1000))
        .toISOString().split('T')[0];
    }
    
    // Calculate departure date (default 1 night)
    const arrivalDateObj = new Date(arrivalDate);
    const departureDate = new Date(arrivalDateObj.getTime() + (24 * 60 * 60 * 1000))
      .toISOString().split('T')[0];
    
    // Create the new stop
    const newStop: FormTripStop = {
      cityId: cityToAdd.id,
      arrivalDate: arrivalDate,
      departureDate: departureDate,
      nights: 1,
      isStopover: false
    };

    // Insert the new stop
    const updatedStops = [...editedTrip.stops];
    updatedStops.splice(index + 1, 0, newStop);

    // Recalculate dates for all subsequent stops
    for (let i = index + 2; i < updatedStops.length; i++) {
      const previousStop = updatedStops[i - 1];
      const currentStop = updatedStops[i];
      
      // Calculate new arrival based on previous stop type
      let newArrival;
      if (previousStop.isStopover) {
        // If previous is a stopover, arrive on the same day
        newArrival = new Date(previousStop.arrivalDate);
      } else {
        // Otherwise, add nights to previous arrival
        const prevDate = new Date(previousStop.arrivalDate);
        const prevNights = previousStop.nights || 1;
        newArrival = new Date(prevDate.getTime() + (prevNights * 24 * 60 * 60 * 1000));
      }
      
      // Set arrival date
      currentStop.arrivalDate = newArrival.toISOString().split('T')[0];
      
      // Set departure date based on current stop type
      if (currentStop.isStopover) {
        currentStop.departureDate = currentStop.arrivalDate;
      } else {
        const currNights = currentStop.nights || 1;
        const newDeparture = new Date(newArrival.getTime() + (currNights * 24 * 60 * 60 * 1000));
        currentStop.departureDate = newDeparture.toISOString().split('T')[0];
      }
    }

    // Get the new end date from the last stop
    const lastStop = updatedStops[updatedStops.length - 1];
    const endDate = lastStop.departureDate;
    
    const updatedTrip = {
      ...editedTrip,
      stops: updatedStops,
      endDate: endDate
    };
    
    setEditedTrip(updatedTrip);
    if (onUpdateTrip) {
      onUpdateTrip(updatedTrip);
    }
  };

  // Handle updating a stop
  const handleUpdateStop = (index: number, updatedStop: Partial<FormTripStop>) => {
    if (!editedTrip) return;
    
    const stops = [...editedTrip.stops];
    stops[index] = {
      ...stops[index],
      ...updatedStop
    };
    
    const updatedTrip = { ...editedTrip, stops };
    setEditedTrip(updatedTrip);
    
    if (onUpdateTrip) {
      onUpdateTrip(updatedTrip);
    }
  };

  // Handle removing a stop
  const handleRemoveStop = (index: number) => {
    if (!editedTrip) return;
    
    const updatedStops = editedTrip.stops.filter((_, i) => i !== index);

    // Update dates for remaining stops
    for (let i = index; i < updatedStops.length; i++) {
      if (i === 0) {
        // First stop after removing
        const tripStartDate = editedTrip.startDate;
        updatedStops[i].arrivalDate = tripStartDate;
        
        if (updatedStops[i].isStopover) {
          updatedStops[i].departureDate = tripStartDate;
        } else {
          const firstStopNights = updatedStops[i].nights || 1;
          const departureDate = new Date(tripStartDate);
          departureDate.setDate(departureDate.getDate() + firstStopNights);
          updatedStops[i].departureDate = safeISODateString(departureDate);
        }
      } else {
      const previousStop = updatedStops[i - 1];
      const currentStop = updatedStops[i];
      
        // Calculate arrival based on previous stop type
        let newArrival;
        if (previousStop.isStopover) {
          // If previous is a stopover, arrive on the same day
          newArrival = new Date(previousStop.arrivalDate);
        } else {
          // Otherwise, add nights to previous arrival
          const prevDate = new Date(previousStop.arrivalDate);
          const prevNights = previousStop.nights || 1;
          newArrival = new Date(prevDate.getTime() + (prevNights * 24 * 60 * 60 * 1000));
        }
        
        // Set arrival date
        currentStop.arrivalDate = safeISODateString(newArrival);
        
        // Set departure date based on current stop type
        if (currentStop.isStopover) {
          currentStop.departureDate = currentStop.arrivalDate;
        } else {
          const currNights = currentStop.nights || 1;
          const newDeparture = new Date(newArrival.getTime() + (currNights * 24 * 60 * 60 * 1000));
          currentStop.departureDate = safeISODateString(newDeparture);
        }
      }
    }

    // Update end date based on last stop
    let endDate = editedTrip.startDate;
    if (updatedStops.length > 0) {
    const lastStop = updatedStops[updatedStops.length - 1];
      endDate = lastStop.departureDate;
    }
    
    const updatedTrip = {
      ...editedTrip,
      stops: updatedStops,
      endDate: endDate
    };
    
    setEditedTrip(updatedTrip);
    if (onUpdateTrip) {
      onUpdateTrip(updatedTrip);
    }
  };

  // Handle moving a stop up or down
  const handleMoveStop = (index: number, direction: 'up' | 'down') => {
    if (!editedTrip) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= editedTrip.stops.length) return;
    
    const updatedStops = [...editedTrip.stops];
    const temp = updatedStops[index];
    updatedStops[index] = updatedStops[newIndex];
    updatedStops[newIndex] = temp;

    // Update dates for all stops after the moved ones
    for (let i = Math.min(index, newIndex); i < updatedStops.length; i++) {
      if (i === 0) {
        // First stop should start on trip start date
        updatedStops[i].arrivalDate = editedTrip.startDate;
        
        if (updatedStops[i].isStopover) {
          updatedStops[i].departureDate = editedTrip.startDate;
        } else {
          const currNights = updatedStops[i].nights || 1;
          const startDate = new Date(updatedStops[i].arrivalDate);
          updatedStops[i].departureDate = safeISODateString(new Date(startDate.getTime() + (currNights * 24 * 60 * 60 * 1000)));
        }
      } else {
      const previousStop = updatedStops[i - 1];
      const currentStop = updatedStops[i];
      
        // Calculate arrival based on previous stop type
        let newArrival;
        if (previousStop.isStopover) {
          // If previous is a stopover, arrive on the same day
          newArrival = new Date(previousStop.arrivalDate);
      } else {
          // Normal calculation - add nights to previous arrival
          const prevDate = new Date(previousStop.arrivalDate);
          const prevNights = previousStop.nights || 1;
          newArrival = new Date(prevDate.getTime() + (prevNights * 24 * 60 * 60 * 1000));
        }
        
        // Set arrival date
        currentStop.arrivalDate = safeISODateString(newArrival);
        
        // Set departure date based on current stop type
        if (currentStop.isStopover) {
          currentStop.departureDate = currentStop.arrivalDate;
        } else {
          const currNights = currentStop.nights || 1;
          const newDeparture = new Date(newArrival.getTime() + (currNights * 24 * 60 * 60 * 1000));
          currentStop.departureDate = safeISODateString(newDeparture);
        }
      }
    }

    // Update end date
    const lastStop = updatedStops[updatedStops.length - 1];
    const endDate = lastStop.departureDate;
    
    const updatedTrip = {
      ...editedTrip,
      stops: updatedStops,
      endDate: endDate
    };
    
    setEditedTrip(updatedTrip);
    if (onUpdateTrip) {
      onUpdateTrip(updatedTrip);
    }
  };

  // Calculate total trip statistics
  const getTripStats = () => {
    if (!editedTrip || editedTrip.stops.length === 0) return null;
    
    // Calculate nights from all stops
    const totalNights = editedTrip.stops.reduce((sum, stop) => sum + (stop.isStopover ? 0 : (stop.nights || 1)), 0);
    
    // Calculate travel days - each transition between cities is a travel day
    const travelDays = Math.max(1, editedTrip.stops.length - 1);
    
    // Total days is nights + 1 (for checkout day)
    // This is the simplest and most reliable calculation
    const totalDays = totalNights + 1;
    
    const citiesCount = editedTrip.stops.length;
    const stopoversCount = editedTrip.stops.filter(stop => stop.isStopover).length;
    
    return {
      totalDays,
      totalNights,
      citiesCount,
      stopoversCount,
      travelDays
    };
  };

  // New functions for editing trip name and travelers
  const handleEditTripName = () => {
    setIsEditingTripName(true);
    setTempTripName(editedTrip?.name || "");
  };

  const handleSaveTripName = () => {
    if (!editedTrip || !tempTripName.trim()) return;
    
    const updatedTrip = { ...editedTrip, name: tempTripName.trim() };
    setEditedTrip(updatedTrip);
    setIsEditingTripName(false);
    
    if (onUpdateTrip) {
      onUpdateTrip(updatedTrip);
    }
  };

  const handleCancelTripNameEdit = () => {
    setIsEditingTripName(false);
    setTempTripName(editedTrip?.name || "");
  };

  const handleEditTravelers = () => {
    setIsEditingTravelers(true);
    setTempTravelers(editedTrip?.travelers || 1);
  };

  const handleSaveTravelers = () => {
    if (!editedTrip) return;
    
    const updatedTrip = { ...editedTrip, travelers: tempTravelers };
    setEditedTrip(updatedTrip);
    setIsEditingTravelers(false);
    
    if (onUpdateTrip) {
      onUpdateTrip(updatedTrip);
    }
  };

  const handleCancelTravelersEdit = () => {
    setIsEditingTravelers(false);
    setTempTravelers(editedTrip?.travelers || 1);
  };

  // If no trip is selected
  if (!trip) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white p-8">
        <div className="text-center">
          <MapPinIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Trip Selected</h2>
          <p className="text-gray-500 mb-6">Select an existing trip or create a new one</p>
          <Link
            href="/trips/new"
            className="inline-flex items-center px-4 py-2 bg-[#FFD166] text-[#264653] rounded-md hover:bg-[#FFC233] font-medium"
          >
            Create New Trip
          </Link>
        </div>
      </div>
    );
  }

  const tripStats = getTripStats();

  return (
    <div className="h-full flex">
      {/* Left sidebar with trip stats and smart assistant - fixed width */}
      <div className="w-[350px] min-w-[350px] max-w-[350px] h-full bg-white border-r border-gray-200 flex flex-col overflow-hidden">
        {/* Sidebar header with tabs */}
        <div className="border-b border-gray-200 flex">
                <button 
            className={`flex-1 py-3 px-4 font-medium text-sm ${activeSidebarTab === 'summary' ? 'text-[#264653] border-b-2 border-[#06D6A0]' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveSidebarTab('summary')}
                >
            Trip Summary
                </button>
                <button 
            className={`flex-1 py-3 px-4 font-medium text-sm ${activeSidebarTab === 'assistant' ? 'text-[#264653] border-b-2 border-[#06D6A0]' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveSidebarTab('assistant')}
                >
            Trip Assistant
                </button>
        </div>
        
        {/* Sidebar content */}
        <div className="flex-1 overflow-auto">
          {activeSidebarTab === 'summary' ? (
            <>
              {/* Trip header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    {isEditingTripName ? (
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={tempTripName}
                          onChange={(e) => setTempTripName(e.target.value)}
                          className="bg-white text-black px-2 py-1 rounded text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-[#06D6A0]"
                          autoFocus
                        />
                        <button
                          onClick={handleSaveTripName}
                          className="text-[#06D6A0] hover:text-[#05C090]"
                        >
                          <CheckIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={handleCancelTripNameEdit}
                          className="text-[#F94144] hover:text-[#E53E41]"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ) : (
                      <h1 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
                        {editedTrip?.name}
                        <button
                          onClick={handleEditTripName}
                          className="text-gray-400 hover:text-[#06D6A0]"
                          title="Edit trip name"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </h1>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {onDeleteTrip && editedTrip && (
                <button 
                        onClick={() => onDeleteTrip(editedTrip._id)}
                        className="text-[#F94144] hover:text-[#E53E41] p-2 rounded-full hover:bg-red-50"
                        title="Delete trip"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
            )}
          </div>
        </div>
        
        <div className="flex items-center text-sm text-[#264653] mt-2">
          <CalendarIcon className="h-4 w-4 mr-1 flex-shrink-0" />
                  <input
                    type="date"
                    value={editedTrip?.startDate || ""}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    className="border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-[#06D6A0] rounded px-1"
                  />
                  <span className="mx-2">to</span>
                  <span>{formatDate(editedTrip?.endDate || "")}</span>
        </div>

        {/* Travelers section with edit capability */}
        <div className="flex items-center text-sm text-[#264653] mt-2">
          <UsersIcon className="h-4 w-4 mr-1 flex-shrink-0" />
          {isEditingTravelers ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={tempTravelers}
                min={1}
                max={20}
                onChange={(e) => setTempTravelers(parseInt(e.target.value) || 1)}
                className="w-16 border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-[#06D6A0] rounded px-1"
              />
              <span>traveler{tempTravelers !== 1 ? 's' : ''}</span>
              <button
                onClick={handleSaveTravelers}
                className="text-[#06D6A0] hover:text-[#05C090]"
              >
                <CheckIcon className="h-4 w-4" />
              </button>
              <button
                onClick={handleCancelTravelersEdit}
                className="text-[#F94144] hover:text-[#E53E41]"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center">
              <span>{editedTrip?.travelers || 1} traveler{(editedTrip?.travelers || 1) > 1 ? 's' : ''}</span>
              <button
                onClick={handleEditTravelers}
                className="text-gray-400 hover:text-[#06D6A0] ml-2"
                title="Edit number of travelers"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        
          <textarea
            value={editedTrip?.notes || ""}
            onChange={(e) => editedTrip && setEditedTrip({...editedTrip, notes: e.target.value})}
            placeholder="Add notes about your trip..."
            className="mt-2 text-sm text-[#264653] w-full border border-gray-200 rounded p-2"
            rows={2}
          />
              </div>
              
              {/* Trip Statistics */}
              {editedTrip && editedTrip.stops.length > 0 && tripStats && (
                <div className="p-4">
                  <h3 className="text-sm font-medium text-[#264653] mb-3">Trip Statistics</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#F8F9FA] p-3 rounded-lg">
                        <div className="text-2xl font-bold text-[#06D6A0]">{tripStats.totalDays}</div>
                        <div className="text-xs text-gray-500">Days Total</div>
                      </div>
                      <div className="bg-[#F8F9FA] p-3 rounded-lg">
                        <div className="text-2xl font-bold text-[#06D6A0]">{tripStats.totalNights}</div>
                        <div className="text-xs text-gray-500">Nights</div>
                      </div>
                      <div className="bg-[#F8F9FA] p-3 rounded-lg">
                        <div className="text-2xl font-bold text-[#FFD166]">{tripStats.travelDays}</div>
                        <div className="text-xs text-gray-500">Travel Days</div>
                      </div>
                      <div className="bg-[#F8F9FA] p-3 rounded-lg">
                        <div className="text-2xl font-bold text-[#06D6A0]">{tripStats.citiesCount}</div>
                        <div className="text-xs text-gray-500">Cities</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center bg-[#F8F9FA] p-3 rounded-lg">
                      <div>
                        <div className="text-sm text-gray-500">Avg. Nights per City</div>
                        <div className="text-xl font-bold text-[#264653]">
                          {Math.round((tripStats.totalNights / tripStats.citiesCount) * 10) / 10}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Stopovers</div>
                        <div className="text-xl font-bold text-[#264653]">{tripStats.stopoversCount}</div>
                      </div>
                    </div>
                    
                    {/* Visual trip timeline */}
                    <div className="pt-4">
                      <h3 className="text-sm font-medium text-[#264653] mb-3">Trip Timeline</h3>
                      <div className="relative">
                        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                        
                        {editedTrip.stops.map((stop, idx) => {
                          const city = cities.find(c => c.id === stop.cityId);
                          return (
                            <div key={idx} className="flex mb-3 relative z-10">
                              <div className={`h-6 w-6 rounded-full flex-shrink-0 flex items-center justify-center ${
                                stop.isStopover ? 'bg-[#FFD166]' : 'bg-[#06D6A0]'
                              }`}>
                                {stop.isStopover ? 
                                  <ClockIcon className="h-3 w-3 text-white" /> : 
                                  <HomeIcon className="h-3 w-3 text-white" />
                                }
                              </div>
                              <div className="ml-3 bg-white p-2 rounded-lg shadow-sm flex-1 text-sm">
                                <div className="font-medium text-[#264653]">{city?.name}</div>
                                <div className="text-xs text-gray-500">
                                  {formatDate(stop.arrivalDate)} {!stop.isStopover && `(${stop.nights || 1} night${(stop.nights || 1) > 1 ? 's' : ''})`}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            // Smart Trip Assistant
            <div className="overflow-auto h-full">
              {editedTrip && (
                <SmartTripAssistant trip={editedTrip} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main content area with itinerary - wider */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Itinerary header */}
        <div className="p-4 bg-[#FAF3E0] flex justify-between items-center">
          <h2 className="text-lg font-medium text-[#264653]">Trip Itinerary</h2>
          {editedTrip && (
            <button
              onClick={() => setShowAddDestination(true)}
              className="flex items-center text-[#06D6A0] hover:text-[#05C090] text-sm"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              <span>Add Destination</span>
            </button>
          )}
      </div>

        {/* Trip stops - improved card width */}
        <div className="flex-1 overflow-auto bg-gray-50 relative">
          {editedTrip && editedTrip.stops.length > 0 ? (
            <div className="p-4 space-y-4 max-w-5xl mx-auto">
              {editedTrip.stops.map((stop, index) => (
                <div key={`${stop.cityId}-${index}`} className="flex flex-col">
              <StopCard 
                stop={stop}
                index={index}
                isSelected={index === selectedStopIndex}
                onClick={() => onSelectStop && onSelectStop(index)}
                    isLastStop={index === editedTrip.stops.length - 1}
                onRemove={() => handleRemoveStop(index)}
                onUpdate={(updatedStop) => handleUpdateStop(index, updatedStop)}
                onAddDestinationAfter={handleAddDestinationAfter}
                onMove={handleMoveStop}
                editedTrip={editedTrip}
                    onShowCityInfo={handleShowCityInfo}
                  />
                  
                  {/* Connection to next stop with appropriate styling */}
                  {index < editedTrip.stops.length - 1 && (
                    <div className="h-8 flex items-center justify-center">
                      <div 
                        className={`w-0.5 h-full ${getConnectionLineClass(stop.trainDetails)}`}
                      ></div>
                    </div>
                  )}
                </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-[#264653]">No stops added to this trip yet</p>
            <button
              onClick={() => setShowAddDestination(true)}
                className="inline-flex items-center mt-4 px-4 py-2 text-sm bg-[#06D6A0] text-white rounded hover:bg-[#05C090]"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
                Add First Stop
            </button>
          </div>
        )}
        </div>
        
        {/* Add Destination Section - with improved text search */}
        {showAddDestination && (
          <div className="absolute bottom-4 right-4 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-[#264653]">Add New Destination</h3>
                <button onClick={() => setShowAddDestination(false)} className="text-gray-500 hover:text-gray-700">
                  <XMarkIcon className="h-5 w-5" />
              </button>
              </div>
              
              <div className="space-y-4">
                {/* Text input field for searching cities */}
                <div className="relative">
                <input
                  type="text"
                  value={newDestinationInput}
                    onChange={(e) => {
                      setNewDestinationInput(e.target.value);
                      setNewDestination(""); // Clear selection when typing
                    }}
                    placeholder="Search for a city..."
                    className="w-full rounded border border-gray-200 p-2 pr-8"
                    autoFocus
                  />
                  {newDestinationInput && (
                <button
                      className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                      onClick={() => setNewDestinationInput("")}
                >
                      <XMarkIcon className="h-4 w-4" />
                </button>
                  )}
              </div>
                
                {/* City search results */}
                {newDestinationInput && (
                  <div className="max-h-48 overflow-y-auto rounded border border-gray-200">
                    {cities
                      .filter(city => 
                        !editedTrip?.stops.some(stop => stop.cityId === city.id) && 
                        (city.name.toLowerCase().includes(newDestinationInput.toLowerCase()) ||
                         city.country.toLowerCase().includes(newDestinationInput.toLowerCase()))
                      )
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .slice(0, 10) // Limit to 10 results for better performance
                      .map(city => (
                        <div 
                          key={city.id} 
                          className={`p-2 cursor-pointer hover:bg-gray-50 flex justify-between items-center ${city.id === newDestination ? 'bg-[#06D6A0]/10' : ''}`}
                          onClick={() => setNewDestination(city.id)}
                        >
                          <div>
                            <div className="font-medium text-black">{city.name}</div>
                            <div className="text-xs text-gray-500">{city.country}</div>
            </div>
                          {city.id === newDestination && <CheckIcon className="h-4 w-4 text-[#06D6A0]" />}
                        </div>
                      ))}
                    {cities.filter(city => 
                      !editedTrip?.stops.some(stop => stop.cityId === city.id) && 
                      (city.name.toLowerCase().includes(newDestinationInput.toLowerCase()) ||
                       city.country.toLowerCase().includes(newDestinationInput.toLowerCase()))
                    ).length === 0 && (
                      <div className="p-3 text-gray-500 text-center">No cities found</div>
                    )}
          </div>
        )}
        
                <div className="flex justify-between space-x-2">
                  {newDestination && (
            <button
                      onClick={() => handleShowCityInfo(newDestination)}
                      className="px-3 py-2 bg-[#264653] text-white rounded hover:bg-[#264653]/90 flex items-center"
                      title="View city information"
            >
                      <InformationCircleIcon className="h-5 w-5 mr-1" />
                      <span>City Info</span>
            </button>
        )}

          <button 
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddDestination();
                    }}
                    disabled={!newDestination}
                    className="flex-1 bg-[#06D6A0] text-white px-4 py-2 rounded disabled:opacity-50"
                  >
                    Add to Itinerary
          </button>
        </div>
          </div>
        </div>
      </div>
        )}
      </div>
      
      {/* City Info Modal */}
      {selectedCityInfo && (
        <CityInfoModal 
          city={selectedCityInfo} 
          onClose={() => setSelectedCityInfo(null)} 
        />
      )}
    </div>
  );
}

// Individual stop card component
interface StopCardProps {
  stop: FormTripStop;
  index: number;
  isSelected: boolean;
  onClick?: () => void;
  isLastStop: boolean;
  onRemove: () => void;
  onUpdate: (stop: FormTripStop) => void;
  onAddDestinationAfter: (index: number, cityId: string) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
  editedTrip: FormTrip | null;
  onShowCityInfo: (cityId: string) => void;
}

const StopCard = ({
  stop, 
  index, 
  isSelected,
  onClick, 
  isLastStop,
  onRemove,
  onUpdate,
  onAddDestinationAfter,
  onMove,
  editedTrip,
  onShowCityInfo
}: StopCardProps) => {
  const cityData = cities.find(c => c.id === stop.cityId);
  const nextStop = editedTrip?.stops[index + 1];
  const nextCityData = nextStop ? cities.find(c => c.id === nextStop.cityId) : null;
  
  const [showHostels, setShowHostels] = useState(false);
  const [showReplaceCity, setShowReplaceCity] = useState(false);
  const [showTrainSchedule, setShowTrainSchedule] = useState(false);
  const [replacementCityId, setReplacementCityId] = useState("");
  const [newDestinationInput, setNewDestinationInput] = useState("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState(stop.notes || "");

  // Calculate dates based on nights
  const arrivalDate = stop.arrivalDate;
  const departureDate = stop.isStopover 
    ? stop.arrivalDate // Same day for stopovers
    : new Date(new Date(stop.arrivalDate).getTime() + ((stop.nights || 0) * 24 * 60 * 60 * 1000));

  // Handle notes editing
  const handleEditNotes = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingNotes(true);
    setTempNotes(stop.notes || "");
  };

  const handleSaveNotes = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({
      ...stop,
      notes: tempNotes
    });
    setIsEditingNotes(false);
  };

  const handleCancelNotesEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingNotes(false);
    setTempNotes(stop.notes || "");
  };

  const handleNightsChange = (delta: number) => {
    const currentNights = stop.nights || 1;
    
    // If reducing nights below 1, convert to stopover
    if (delta < 0 && currentNights === 1) {
      onUpdate({ 
        ...stop, 
        nights: 0,
        isStopover: true
      });
    } else {
      // Otherwise, adjust nights normally (minimum 0 for stopovers)
      const newNights = Math.max(0, currentNights + delta);
      onUpdate({
        ...stop,
        nights: newNights,
        isStopover: newNights === 0
      });
    }
  };
  
  const handleReplaceCity = () => {
    if (!replacementCityId) return;
    onUpdate({
      ...stop,
      cityId: replacementCityId
    });
    setShowReplaceCity(false);
    setReplacementCityId("");
  };

  const handleTrainSelect = (train: TrainConnection) => {
    if (!nextStop) return;
    
    // Update the current stop with train details but don't modify departure date
    // as that would affect the itinerary calculation
    onUpdate({
      ...stop,
      trainDetails: {
        trainNumber: train.trains.map(t => `${t.type} ${t.number}`).join(', '),
        duration: train.duration,
        changes: train.changes,
        price: train.price
      }
    });
    
    // Modal will close itself via the onClose handler
    setShowTrainSchedule(false);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:border-gray-300 transition-colors">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center">
              <div className="flex items-center cursor-pointer" onClick={() => setShowReplaceCity(!showReplaceCity)}>
                <h3 className="font-medium text-lg text-[#264653] hover:text-[#06D6A0]">{cityData?.name}</h3>
                <PencilIcon className="h-4 w-4 ml-1 text-gray-400" />
              </div>
              <div className="ml-auto flex items-center">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onShowCityInfo(stop.cityId);
                  }}
                  className="ml-2 text-[#264653] hover:text-[#06D6A0] p-1 rounded-full hover:bg-gray-50"
                  title="City information"
                >
                  <InformationCircleIcon className="h-5 w-5" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                  }} 
                  className="ml-2 text-[#F94144] hover:text-[#E53E41] p-1 rounded-full hover:bg-red-50"
                  title="Remove stop"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {showReplaceCity && (
              <div className="mt-2">
                <div className="relative mb-2">
                  <input
                    type="text"
                    placeholder="Search for a city..."
                    value={newDestinationInput}
                    onChange={(e) => {
                      setNewDestinationInput(e.target.value);
                      setReplacementCityId("");
                    }}
                    className="w-full rounded border border-gray-200 p-1.5 text-xs pr-6"
                  />
                  {newDestinationInput && (
                    <button 
                      className="absolute right-1.5 top-1.5 text-gray-400 hover:text-gray-600"
                      onClick={() => setNewDestinationInput("")}
                    >
                      <XMarkIcon className="h-3.5 w-3.5" />
              </button>
                  )}
            </div>
            
                <div className="mb-2 max-h-36 overflow-y-auto rounded border border-gray-200">
                  {cities
                    .filter(city => 
                      (!editedTrip?.stops.some(s => s.cityId === city.id) || city.id === stop.cityId) &&
                      (newDestinationInput === "" || 
                       city.name.toLowerCase().includes(newDestinationInput.toLowerCase()) ||
                       city.country.toLowerCase().includes(newDestinationInput.toLowerCase()))
                    )
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .slice(0, 8) // Limit to 8 results for better UX
                    .map(city => (
                      <div 
                        key={city.id} 
                        className={`text-xs p-1.5 cursor-pointer hover:bg-gray-50 flex justify-between ${city.id === replacementCityId ? 'bg-[#06D6A0]/10' : ''}`}
                        onClick={() => setReplacementCityId(city.id)}
                      >
                        <span>{city.name}, {city.country}</span>
                        {city.id === replacementCityId && <CheckIcon className="h-3.5 w-3.5 text-[#06D6A0]" />}
              </div>
                    ))}
                  {cities.filter(city => 
                    (!editedTrip?.stops.some(s => s.cityId === city.id) || city.id === stop.cityId) &&
                    (newDestinationInput !== "" && 
                     (city.name.toLowerCase().includes(newDestinationInput.toLowerCase()) ||
                      city.country.toLowerCase().includes(newDestinationInput.toLowerCase())))
                  ).length === 0 && (
                    <div className="text-xs p-2 text-gray-500 text-center">No cities found</div>
            )}
          </div>
          
                <div className="flex space-x-2">
            <button
                    onClick={handleReplaceCity}
                    disabled={!replacementCityId}
                    className="px-2 py-1 bg-[#06D6A0] text-white rounded text-xs disabled:opacity-50 flex-1"
                  >
                    Replace
            </button>
            <button
                    onClick={() => {
                      setShowReplaceCity(false);
                      setNewDestinationInput("");
                      setReplacementCityId("");
                    }}
                    className="px-2 py-1 border border-gray-200 rounded text-xs"
                  >
                    Cancel
            </button>
          </div>
        </div>
            )}
            
            <div className="flex items-center justify-between mt-1">
              {/* Left side: Date and country info */}
                  <div>
                {/* Compact night info and date */}
                <div className="flex items-center text-xs text-gray-500">
                  <span className="flex items-center">
                    <span className={`font-medium ${stop.isStopover ? 'text-[#FFD166]' : 'text-[#06D6A0]'}`}>
                      {stop.isStopover ? 'Stopover' : `${stop.nights || 1} night${(stop.nights || 1) > 1 ? 's' : ''}`}
                      </span>
                    <span className="mx-1">•</span>
                  </span>
                  <span>
                    {new Date(arrivalDate).toLocaleDateString('en-US', { 
                      weekday: 'short',
                      day: 'numeric', 
                      month: 'short'
                    })} 
                    {!stop.isStopover && (
                      <>
                        <span className="mx-1">-</span>
                        {new Date(departureDate).toLocaleDateString('en-US', { 
                          weekday: 'short',
                          day: 'numeric', 
                          month: 'short'
                        })}
                      </>
                    )}
                      </span>
                    </div>
                
                {/* Country */}
                <div className="text-xs text-gray-500 mt-1">
                  {cityData?.country}
                  </div>
                
                {/* Accommodation if present */}
                {stop.accommodation && (
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <HomeIcon className="h-3 w-3 mr-1 text-[#06D6A0]" />
                    <span>{stop.accommodation}</span>
                </div>
                )}
              </div>
              
              {/* Right side: Night adjustment controls */}
              <div className="flex items-center space-x-1 ml-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNightsChange(-1);
                  }}
                  className="text-[#264653] hover:text-[#06D6A0] p-1 rounded-full border border-gray-200 hover:border-[#06D6A0] hover:bg-white transition-colors"
                  title="Decrease nights"
                >
                  <MinusIcon className="h-3.5 w-3.5" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNightsChange(1);
                  }}
                  className="text-[#264653] hover:text-[#06D6A0] p-1 rounded-full border border-gray-200 hover:border-[#06D6A0] hover:bg-white transition-colors"
                  title="Increase nights"
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                </button>
            </div>
            </div>
            
            {/* Notes section if present */}
            {isEditingNotes ? (
              <div className="mt-2">
                <textarea
                  value={tempNotes}
                  onChange={(e) => setTempNotes(e.target.value)}
                  placeholder="Add notes about this destination..."
                  className="w-full border border-gray-200 rounded p-2 text-xs text-gray-600 focus:ring-2 focus:ring-[#06D6A0] focus:border-transparent"
                  rows={3}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex justify-end mt-1 space-x-2">
                  <button
                    onClick={handleCancelNotesEdit}
                    className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 border border-gray-200 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNotes}
                    className="px-2 py-1 text-xs bg-[#06D6A0] text-white hover:bg-[#05C090] rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-2 flex justify-between items-center">
                {stop.notes ? (
                  <div className="p-2 bg-gray-50 rounded text-xs text-gray-600 w-full">
                    {stop.notes}
                  </div>
                ) : (
                  <div className="text-xs text-gray-400 italic">No notes added</div>
                )}
                <button
                  onClick={handleEditNotes}
                  className="ml-2 text-[#2A9D8F] hover:text-[#05C090] p-1 rounded-full flex-shrink-0"
                  title="Edit notes"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Reorder and add buttons */}
      {!isLastStop && (
        <div className="border-t border-gray-200 flex items-stretch">
          <div className="flex-none p-2 flex items-center space-x-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onMove(index, 'up');
              }}
                disabled={index === 0}
              className={`w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center text-[#264653] transition-colors ${
                  index === 0 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-[#FAF3E0] hover:border-[#FFD166] hover:text-[#FFD166]'
                }`}
                title="Move stop up"
              >
                <ChevronUpIcon className="h-4 w-4" />
              </button>
              <button
              onClick={(e) => {
                e.stopPropagation();
                onMove(index, 'down');
              }}
                disabled={isLastStop}
              className={`w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center text-[#264653] transition-colors ${
                  isLastStop 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-[#FAF3E0] hover:border-[#FFD166] hover:text-[#FFD166]'
                }`}
                title="Move stop down"
              >
                <ChevronDownIcon className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddDestinationAfter(index, stop.cityId);
              }}
              className="w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center text-[#264653] hover:bg-[#FAF3E0] hover:border-[#06D6A0] hover:text-[#06D6A0] transition-colors"
              title="Add destination after this stop"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
          
          {/* Travel time section */}
          <div 
            className="grow flex items-center bg-[#FFD166]/30 p-3 cursor-pointer hover:bg-[#FFD166]/40 relative group"
            onClick={() => setShowTrainSchedule(true)}
          >
            <TrainIcon className="h-6 w-6 text-[#FFD166] mr-3" />
            <div className="flex-1">
              {stop.trainDetails ? (
                <>
                  <div className="font-medium text-[#264653]">{stop.trainDetails.duration}</div>
                  <div className="text-sm text-[#264653]">
                    {stop.trainDetails.trainNumber} • {stop.trainDetails.changes === 0 ? 'Direct' : `${stop.trainDetails.changes} changes`}
                    {stop.trainDetails.price && ` • ${stop.trainDetails.price.amount} ${stop.trainDetails.price.currency}`}
            </div>
                </>
              ) : (
                <>
                  <div className="font-medium text-[#264653] flex items-center">
                    Select train connection
                    <span className="ml-1 text-xs bg-[#FFD166] text-white px-2 py-0.5 rounded-full">Click to choose</span>
          </div>
                  <div className="text-sm text-[#264653]">
                    {cityData?.name} → {nextCityData?.name}
            </div>
                </>
              )}
            </div>
            <span className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <PencilIcon className="h-5 w-5 text-[#264653]" />
            </span>
          </div>
        </div>
      )}

      {/* Train Schedule Modal */}
      {showTrainSchedule && nextCityData && (
        <TrainSchedule
          fromCity={cityData?.name || ''}
          toCity={nextCityData?.name || ''}
          date={formatDate(departureDate)}
          onSelectTrain={handleTrainSelect}
          onClose={() => setShowTrainSchedule(false)}
        />
      )}
    </div>
  );
}; 