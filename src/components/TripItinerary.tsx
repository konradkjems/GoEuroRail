import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  BuildingOfficeIcon,
  UserGroupIcon,
  TruckIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import TrainSchedule from "@/components/TrainSchedule";
import SmartTripAssistant from "@/components/SmartTripAssistant";
import dynamic from 'next/dynamic';
// Import the new TransportScreen component
import TransportScreen from "@/components/TransportScreen";
import { CustomTransportDetails } from "@/components/CustomTransportModal";

// Dynamically import the AccommodationScreen component
const AccommodationScreen = dynamic(() => import('@/components/AccommodationScreen'), {
  ssr: false
});

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
    // If date is already a string in YYYY-MM-DD format, return it
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    
    // Convert to Date object
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date:', date);
      return new Date().toISOString().split('T')[0];
    }
    
    return dateObj.toISOString().split('T')[0];
  } catch (error) {
    console.error("Error creating ISO date string:", error);
    return new Date().toISOString().split('T')[0];
  }
};

// Helper function to calculate nights between dates
const calculateNights = (arrivalDate: string, departureDate: string): number => {
  if (!arrivalDate || !departureDate) return 1;
  
  const arrival = new Date(arrivalDate);
  const departure = new Date(departureDate);
  
  if (isNaN(arrival.getTime()) || isNaN(departure.getTime())) {
    return 1;
  }
  
  const diffTime = departure.getTime() - arrival.getTime();
  return Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));
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

// Calculate departure date based on arrival date and nights
const calculateDepartureDate = (stop: FormTripStop): string => {
  if (!stop.arrivalDate) return ''; // Handle missing arrival date
  
  if (stop.isStopover) {
    return stop.arrivalDate; // Same day departure for stopovers
  }
  
  // Calculate departure date based on nights
  const arrivalDate = new Date(stop.arrivalDate);
  if (isNaN(arrivalDate.getTime())) return ''; // Handle invalid date
  
  const departureDate = new Date(arrivalDate);
  departureDate.setDate(arrivalDate.getDate() + (stop.nights || 1));
  return departureDate.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
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

  // New state for accommodation screen
  const [showAccommodationScreen, setShowAccommodationScreen] = useState(false);
  const [accommodationStopIndex, setAccommodationStopIndex] = useState(-1);

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
        // For the first stop, set arrival to the trip start date
        if (index === 0) {
          const arrivalDate = currentDate.toISOString().split('T')[0];
          
          // Calculate departure date based on nights or stopover
          let departureDate;
          if (stop.isStopover) {
            departureDate = arrivalDate; // Same day for stopovers
          } else {
            const nights = stop.nights || 1;
            const depDate = new Date(currentDate);
            depDate.setDate(currentDate.getDate() + nights);
            departureDate = depDate.toISOString().split('T')[0];
            // Update current date for next stop
            currentDate = new Date(depDate);
          }
          
          return {
            ...stop,
            arrivalDate,
            departureDate
          };
        } else {
          // For subsequent stops, use the prior stop's departure date as arrival
          const prevStop = updatedTrip.stops[index - 1];
          const arrivalDate = prevStop.departureDate;
          const arrivalDateObj = new Date(arrivalDate);
          
          // Calculate departure date based on nights or stopover
          let departureDate;
          if (stop.isStopover) {
            departureDate = arrivalDate; // Same day for stopovers
          } else {
            const nights = stop.nights || 1;
            const depDate = new Date(arrivalDateObj);
            depDate.setDate(arrivalDateObj.getDate() + nights);
            departureDate = depDate.toISOString().split('T')[0];
            // Update current date for next stop
            currentDate = new Date(depDate);
          }
          
          return {
            ...stop,
            arrivalDate,
            departureDate
          };
        }
      });
      
      // Update the trip end date to the last stop's departure date
      const lastStop = updatedTrip.stops[updatedTrip.stops.length - 1];
      updatedTrip.endDate = lastStop.departureDate;
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
      
      // Use the departure date from the last stop for arrival
      // For stopovers, this is the same as arrival date
      const lastStopDeparture = lastStop.isStopover 
        ? new Date(lastStop.arrivalDate)  // For stopovers, use arrival date (same as departure)
        : new Date(lastStop.departureDate); // For normal stops, use departure date

      const newArrivalDate = lastStopDeparture.toISOString().split('T')[0];
      const newDepartureDate = new Date(lastStopDeparture);
      newDepartureDate.setDate(lastStopDeparture.getDate() + 1); // Default to 1 night
      
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
    
    // Calculate arrival date for the new stop based on previous stop's departure date
    // For stopovers, departure is same as arrival
    const arrivalDate = previousStop.isStopover
      ? previousStop.arrivalDate
      : previousStop.departureDate;
    
    // Calculate departure date (default 1 night)
    const arrivalDateObj = new Date(arrivalDate);
    const departureDate = new Date(arrivalDateObj);
    departureDate.setDate(arrivalDateObj.getDate() + 1); // Add 1 night
    const departureDateStr = departureDate.toISOString().split('T')[0];
    
    // Create the new stop
    const newStop: FormTripStop = {
      cityId: cityToAdd.id,
      arrivalDate: arrivalDate,
      departureDate: departureDateStr,
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
      
      // Current stop's arrival is previous stop's departure
      currentStop.arrivalDate = previousStop.departureDate;
      
      // Set departure date based on current stop type
      if (currentStop.isStopover) {
        currentStop.departureDate = currentStop.arrivalDate; // Same day for stopovers
      } else {
        const currNights = currentStop.nights || 1;
        const newArrival = new Date(currentStop.arrivalDate);
        const newDeparture = new Date(newArrival);
        newDeparture.setDate(newArrival.getDate() + currNights);
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
    const oldStop = stops[index];
    
    // Update the specific stop with new values
    stops[index] = {
      ...oldStop,
      ...updatedStop
    };
    
    // Special handling for stopovers - make arrival and departure the same day
    if (updatedStop.isStopover === true) {
      stops[index].departureDate = stops[index].arrivalDate;
      stops[index].nights = 0;
    }
    
    // If nights were updated or isStopover changed, recalculate departure date
    if ((updatedStop.nights !== undefined && updatedStop.nights !== oldStop.nights) || 
        (updatedStop.isStopover !== undefined && updatedStop.isStopover !== oldStop.isStopover)) {
      
      // Recalculate departure date based on nights
      if (!stops[index].isStopover) {
        const arrivalDate = new Date(stops[index].arrivalDate);
        const nights = stops[index].nights || 1;
        const departureDate = new Date(arrivalDate);
        departureDate.setDate(arrivalDate.getDate() + nights);
        stops[index].departureDate = departureDate.toISOString().split('T')[0];
      }
    }
    
    // If departure date changed, we need to update all subsequent stops
    const departureChanged = stops[index].departureDate !== oldStop.departureDate;
    
    if (departureChanged) {
      // Update all subsequent stops
      for (let i = index + 1; i < stops.length; i++) {
        // Use previous stop's departure date as this stop's arrival
        stops[i].arrivalDate = stops[i-1].departureDate;
        
        // Update departure date based on whether it's a stopover
        if (stops[i].isStopover) {
          stops[i].departureDate = stops[i].arrivalDate; // Same day for stopovers
        } else {
          const nights = stops[i].nights || 1;
          const newArrival = new Date(stops[i].arrivalDate);
          const newDeparture = new Date(newArrival);
          newDeparture.setDate(newArrival.getDate() + nights);
          stops[i].departureDate = newDeparture.toISOString().split('T')[0];
        }
      }
    }
    
    // Update the trip's end date if the last stop was affected
    let endDate = editedTrip.endDate;
    if (stops.length > 0) {
      endDate = stops[stops.length - 1].departureDate;
    }
    
    const updatedTrip = { 
      ...editedTrip, 
      stops,
      endDate
    };
    
    setEditedTrip(updatedTrip);
    if (onUpdateTrip) {
      onUpdateTrip(updatedTrip);
    }
  };

  // Handle removing a stop
  const handleRemoveStop = (index: number) => {
    if (!editedTrip) return;
    
    const updatedStops = editedTrip.stops.filter((_, i) => i !== index);

    // If no stops left, just update the trip
    if (updatedStops.length === 0) {
      const updatedTrip = {
        ...editedTrip,
        stops: [],
        endDate: editedTrip.startDate // If no stops, end date is same as start date
      };
      
      setEditedTrip(updatedTrip);
      if (onUpdateTrip) {
        onUpdateTrip(updatedTrip);
      }
      return;
    }

    // Update dates for remaining stops
    // If first stop is removed, set first remaining stop to trip start date
    if (index === 0) {
      updatedStops[0].arrivalDate = editedTrip.startDate;
      
      if (updatedStops[0].isStopover) {
        updatedStops[0].departureDate = editedTrip.startDate;
      } else {
        const firstStopNights = updatedStops[0].nights || 1;
        const departureDate = new Date(editedTrip.startDate);
        departureDate.setDate(departureDate.getDate() + firstStopNights);
        updatedStops[0].departureDate = departureDate.toISOString().split('T')[0];
      }
    }
    
    // Recalculate dates for all subsequent stops after the first one
    for (let i = 1; i < updatedStops.length; i++) {
      const previousStop = updatedStops[i - 1];
      const currentStop = updatedStops[i];
      
      // Current stop's arrival is previous stop's departure
      currentStop.arrivalDate = previousStop.departureDate;
      
      // Calculate departure based on nights or stopover
      if (currentStop.isStopover) {
        currentStop.departureDate = currentStop.arrivalDate;
      } else {
        const currNights = currentStop.nights || 1;
        const arrivalDate = new Date(currentStop.arrivalDate);
        const departureDate = new Date(arrivalDate);
        departureDate.setDate(arrivalDate.getDate() + currNights);
        currentStop.departureDate = departureDate.toISOString().split('T')[0];
      }
    }

    // Update end date from last stop
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

  // Handle moving a stop up or down
  const handleMoveStop = (index: number, direction: 'up' | 'down') => {
    if (!editedTrip) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= editedTrip.stops.length) return;
    
    const updatedStops = [...editedTrip.stops];
    const temp = updatedStops[index];
    updatedStops[index] = updatedStops[newIndex];
    updatedStops[newIndex] = temp;

    // Update dates for all stops starting from the earlier of the two moved indices
    const startRecalcFromIndex = Math.min(index, newIndex);
    
    // For the first stop, use the trip start date
    if (startRecalcFromIndex === 0) {
      const tripStartDate = new Date(editedTrip.startDate);
      updatedStops[0].arrivalDate = editedTrip.startDate;
      
      if (updatedStops[0].isStopover) {
        updatedStops[0].departureDate = editedTrip.startDate;
      } else {
        const nights = updatedStops[0].nights || 1;
        const depDate = new Date(tripStartDate);
        depDate.setDate(tripStartDate.getDate() + nights);
        updatedStops[0].departureDate = depDate.toISOString().split('T')[0];
      }
    }
    
    // Recalculate dates for all subsequent stops
    for (let i = Math.max(1, startRecalcFromIndex); i < updatedStops.length; i++) {
      const previousStop = updatedStops[i - 1];
      const currentStop = updatedStops[i];
      
      // Current stop's arrival date is previous stop's departure date
      const prevDepDate = new Date(previousStop.departureDate);
      currentStop.arrivalDate = previousStop.departureDate;
      
      // Calculate departure date based on current stop type
      if (currentStop.isStopover) {
        currentStop.departureDate = currentStop.arrivalDate;
      } else {
        const currNights = currentStop.nights || 1;
        const depDate = new Date(prevDepDate);
        depDate.setDate(prevDepDate.getDate() + currNights);
        currentStop.departureDate = depDate.toISOString().split('T')[0];
      }
    }

    // Update end date to the last stop's departure date
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

  // Memoize trip statistics calculations
  const tripStats = useMemo(() => getTripStats(), [editedTrip]);

  // Memoize expensive operations
  const mapCenter = useMemo(() => {
    // Only recalculate when relevant stops change
    if (!editedTrip || !editedTrip.stops.length) return null;
    return editedTrip.stops.map(stop => {
      const city = cities.find(c => c.id === stop.cityId);
      // Use the correct properties that exist on the City type
      return city ? { name: city.name, id: city.id, country: city.country } : null;
    }).filter(Boolean);
  }, [editedTrip?.stops]);

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

  // Handle selecting accommodation for a stop
  const handleSelectAccommodation = (accommodation: any) => {
    if (accommodationStopIndex === -1 || !editedTrip) return;
    
    const updatedStops = [...editedTrip.stops];
    updatedStops[accommodationStopIndex] = {
      ...updatedStops[accommodationStopIndex],
      accommodation: accommodation.name
    };
    
    const updatedTrip = { ...editedTrip, stops: updatedStops };
    setEditedTrip(updatedTrip);
    
    if (onUpdateTrip) {
      onUpdateTrip(updatedTrip);
    }
    
    // Close accommodation screen
    setShowAccommodationScreen(false);
  };
  
  // Handle removing accommodation from a stop
  const handleRemoveAccommodation = (index: number) => {
    if (!editedTrip) return;
    
    const updatedStops = [...editedTrip.stops];
    updatedStops[index] = {
      ...updatedStops[index],
      accommodation: undefined
    };
    
    const updatedTrip = { ...editedTrip, stops: updatedStops };
    setEditedTrip(updatedTrip);
    
    if (onUpdateTrip) {
      onUpdateTrip(updatedTrip);
    }
  };
  
  // Show accommodation screen for a specific stop
  const handleShowAccommodationScreen = (index: number) => {
    setAccommodationStopIndex(index);
    setShowAccommodationScreen(true);
  };

  // Add a useEffect to log city information when accommodationStopIndex changes
  useEffect(() => {
    if (showAccommodationScreen && editedTrip && accommodationStopIndex >= 0 && accommodationStopIndex < editedTrip.stops.length) {
      const cityData = cities.find(c => c.id === editedTrip.stops[accommodationStopIndex].cityId);
      console.log("Opening accommodation screen for city:", cityData);
    }
  }, [showAccommodationScreen, accommodationStopIndex, editedTrip]);

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

  return (
    <div className="h-full flex">
      {/* Left sidebar with trip stats and smart assistant - fixed width */}
      <div className="w-[350px] min-w-[350px] max-w-[350px] h-full bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar header with tabs */}
        <div className="border-b border-gray-200 flex flex-shrink-0 sticky top-0 bg-white z-10">
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
        
        {/* Sidebar content - independently scrollable */}
        <div className="flex-1 overflow-hidden">
          {activeSidebarTab === 'summary' ? (
            <div className="h-full flex flex-col">
              {/* Trip header - fixed */}
              <div className="p-4 border-b border-gray-200 flex-shrink-0 bg-white sticky top-0 z-10">
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
              
              {/* Trip Statistics - independently scrollable */}
              <div className="flex-1 overflow-y-auto p-4">
                {editedTrip && editedTrip.stops.length > 0 && tripStats && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-[#264653] mb-3">Trip Statistics</h3>
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
                )}
              </div>
            </div>
          ) : (
            // Smart Trip Assistant - independently scrollable
            <div className="h-full overflow-y-auto">
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
            <div className="p-4 pb-24 space-y-4 max-w-5xl mx-auto">
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
                    onShowAccommodation={handleShowAccommodationScreen}
                    onRemoveAccommodation={handleRemoveAccommodation}
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

      {/* City Info Modal - displayed when a city is selected for viewing */}
      {selectedCityInfo && (
        <CityInfoModal 
          city={selectedCityInfo} 
          onClose={() => setSelectedCityInfo(null)} 
        />
      )}
      
      {/* Accommodation Screen - displayed when adding/editing accommodations */}
      {showAccommodationScreen && editedTrip && accommodationStopIndex >= 0 && accommodationStopIndex < editedTrip.stops.length && (
        <AccommodationScreen
          city={cities.find(c => c.id === editedTrip.stops[accommodationStopIndex].cityId)?.name || "Unknown City"}
          checkInDate={editedTrip.stops[accommodationStopIndex].arrivalDate}
          checkOutDate={editedTrip.stops[accommodationStopIndex].departureDate}
          onSelectAccommodation={handleSelectAccommodation}
          currentTripStop={editedTrip.stops[accommodationStopIndex]}
          travelers={editedTrip.travelers || 2}
          onClose={() => setShowAccommodationScreen(false)}
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
  onShowAccommodation: (index: number) => void;
  onRemoveAccommodation: (index: number) => void;
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
  onShowCityInfo,
  onShowAccommodation,
  onRemoveAccommodation
}: StopCardProps) => {
  const cityData = cities.find(city => city.id === stop.cityId);
  const nextStop = editedTrip && editedTrip.stops[index + 1];
  const nextCityData = nextStop ? cities.find(city => city.id === nextStop.cityId) : null;
  
  // State variables for UI interactions
  const [showReplaceCity, setShowReplaceCity] = useState(false);
  const [replacementCityId, setReplacementCityId] = useState("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState(stop.notes || "");
  const [showHostels, setShowHostels] = useState(false);
  
  // Transport modal state
  const [showTrainSchedule, setShowTrainSchedule] = useState(false);
  const [showTransportScreen, setShowTransportScreen] = useState(false);

  // Handler for custom transport selection
  const handleTransportSave = (transportDetails: CustomTransportDetails) => {
    if (!nextStop) return;
    
    onUpdate({
      ...stop,
      customTransport: transportDetails
    });
    
    setShowTransportScreen(false);
  };
  
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

  // Ensure when nights change, the departure date is automatically updated
  const handleNightsChange = (delta: number) => {
    const currentNights = stop.nights || 1;
    
    // Special case: Converting to a stopover (when reducing from 1 night to 0)
    if (delta < 0 && currentNights === 1) {
      // When converting to a stopover, arrival and departure are the same day
      onUpdate({ 
        ...stop, 
        nights: 0,
        isStopover: true,
        departureDate: stop.arrivalDate // Same day departure
      });
    } 
    // Special case: Converting from a stopover to a regular stop (when increasing from 0 to 1 night)
    else if (delta > 0 && currentNights === 0 && stop.isStopover) {
      // Calculate the new departure date based on arrival date + 1 night
      const arrivalDate = new Date(stop.arrivalDate);
      const departureDate = new Date(arrivalDate);
      departureDate.setDate(arrivalDate.getDate() + 1);
      const newDepartureDate = departureDate.toISOString().split('T')[0];
      
      // Update the current stop
      onUpdate({
        ...stop,
        nights: 1,
        isStopover: false,
        departureDate: newDepartureDate
      });
    }
    // Normal case: Just adjusting the number of nights (not crossing the stopover boundary)
    else {
      // Adjust nights normally (minimum 0 for stopovers)
      const newNights = Math.max(0, currentNights + delta);
      
      // Calculate the new departure date based on arrival date and new nights
      const arrivalD = new Date(stop.arrivalDate);
      const departureD = new Date(arrivalD);
      departureD.setDate(arrivalD.getDate() + (newNights || 0));
      const newDepartureDate = departureD.toISOString().split('T')[0];
      
      // Update the current stop
      onUpdate({
        ...stop,
        nights: newNights,
        isStopover: newNights === 0,
        departureDate: newDepartureDate // Update the departure date with the correct calculation
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

  // Handle train selection from TrainSchedule component
  const handleTrainSelect = (train: TrainConnection) => {
    if (!nextStop) return;
    
    // Update the current stop with both train details and custom transport details
    onUpdate({
      ...stop,
      // Legacy format
      trainDetails: {
        trainNumber: train.trains.map(t => `${t.type} ${t.number}`).join(', '),
        duration: train.duration,
        changes: train.changes,
        price: train.price
      },
      // New format
      customTransport: {
        transportType: "train" as const,
        departureTime: train.departureTime,
        arrivalTime: train.arrivalTime,
        departureDate: stop.departureDate, 
        arrivalDate: nextStop.arrivalDate,
        departureStation: train.trains[0]?.departureStation,
        arrivalStation: train.trains[train.trains.length - 1]?.arrivalStation,
        operator: train.trains.map(t => t.operator).join(', '),
        overnightTransport: false,
        vehicleNumber: train.trains.map(t => `${t.type} ${t.number}`).join(', '),
      }
    });
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
                    value={replacementCityId}
                    onChange={(e) => setReplacementCityId(e.target.value)}
                    className="w-full rounded border border-gray-200 p-1.5 text-xs pr-6"
                  />
                  {replacementCityId && (
                    <button 
                      className="absolute right-1.5 top-1.5 text-gray-400 hover:text-gray-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setReplacementCityId("");
                      }}
                    >
                      <XMarkIcon className="h-3.5 w-3.5" />
                </button>
                  )}
            </div>
            
                <div className="mb-2 max-h-36 overflow-y-auto rounded border border-gray-200">
                  {cities
                    .filter(city => 
                      (!editedTrip?.stops.some(s => s.cityId === city.id) || city.id === stop.cityId) &&
                      (replacementCityId === "" || 
                       city.name.toLowerCase().includes(replacementCityId.toLowerCase()) ||
                       city.country.toLowerCase().includes(replacementCityId.toLowerCase()))
                    )
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .slice(0, 8) // Limit to 8 results for better UX
                    .map(city => (
                      <div 
                        key={city.id} 
                        className={`text-xs p-1.5 cursor-pointer hover:bg-gray-50 flex justify-between ${city.id === replacementCityId ? 'bg-[#06D6A0]/10' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setReplacementCityId(city.id);
                        }}
                      >
                        <span>{city.name}, {city.country}</span>
                        {city.id === replacementCityId && <CheckIcon className="h-3.5 w-3.5 text-[#06D6A0]" />}
              </div>
                    ))}
                  {cities.filter(city => 
                    (!editedTrip?.stops.some(s => s.cityId === city.id) || city.id === stop.cityId) &&
                    (replacementCityId !== "" && 
                     (city.name.toLowerCase().includes(replacementCityId.toLowerCase()) ||
                      city.country.toLowerCase().includes(replacementCityId.toLowerCase())))
                  ).length === 0 && (
                    <div className="text-xs p-2 text-gray-500 text-center">No cities found</div>
            )}
          </div>
          
                <div className="flex space-x-2">
                  <button
                    onClick={handleReplaceCity}
                    disabled={!replacementCityId}
                    className="px-2 py-1 bg-[#06D6A0] text-white rounded text-xs disabled:bg-gray-200 disabled:text-gray-400 hover:bg-[#05C090] flex-1"
                  >
                    Replace
                  </button>
                  <button
                    onClick={() => {
                      setShowReplaceCity(false);
                      setReplacementCityId("");
                    }}
                    className="px-2 py-1 border border-gray-200 rounded text-xs text-gray-600 hover:bg-gray-50"
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
                    {new Date(stop.arrivalDate).toLocaleDateString('en-US', { 
                      weekday: 'short',
                      day: 'numeric', 
                      month: 'short'
                    })} 
                    {!stop.isStopover && (
                      <>
                        <span className="mx-1">-</span>
                        {new Date(stop.departureDate).toLocaleDateString('en-US', { 
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
                
                {/* Accommodation if present or button to add */}
                {stop.accommodation ? (
                  <div className="flex items-center text-xs text-gray-500 mt-1 group">
                    <HomeIcon className="h-3 w-3 mr-1 text-[#06D6A0]" />
                    <span>{stop.accommodation}</span>
                    <div className="ml-auto flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onShowAccommodation(index);
                        }}
                        className="ml-1 text-gray-400 hover:text-[#06D6A0]"
                        title="Change accommodation"
                      >
                        <PencilIcon className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveAccommodation(index);
                        }}
                        className="ml-1 text-gray-400 hover:text-red-500"
                        title="Remove accommodation"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onShowAccommodation(index);
                    }}
                    className="flex items-center text-xs text-[#06D6A0] mt-1 hover:text-[#05C090]"
                  >
                    <HomeIcon className="h-3 w-3 mr-1" />
                    <span>Add accommodation</span>
                  </button>
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
            onClick={() => setShowTransportScreen(true)}
          >
            {/* Show appropriate icon based on transport type */}
            {stop.customTransport ? (
              stop.customTransport.transportType === "train" ? (
                <TrainIcon className="h-6 w-6 text-[#FFD166] mr-3" />
              ) : (
                <TruckIcon className="h-6 w-6 text-[#FFD166] mr-3" />
              )
            ) : (
              <TrainIcon className="h-6 w-6 text-[#FFD166] mr-3" />
            )}
            
            <div className="flex-1">
              {stop.customTransport ? (
                <>
                  <div className="font-medium text-[#264653] flex items-center">
                    {stop.customTransport.departureTime} → {stop.customTransport.arrivalTime}
                    {stop.customTransport.overnightTransport && (
                      <span className="ml-2 text-xs bg-[#264653] text-white px-2 py-0.5 rounded-full">
                        Overnight
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-[#264653] flex flex-col">
                    <div className="flex items-center">
                      <span className="font-medium">{stop.customTransport.transportType === "train" ? "Train" : "Bus"}</span>
                      {stop.customTransport.operator && <span className="mx-1">•</span>}
                      {stop.customTransport.operator && <span>{stop.customTransport.operator}</span>}
                      {stop.customTransport.vehicleNumber && <span className="mx-1">•</span>}
                      {stop.customTransport.vehicleNumber && <span>{stop.customTransport.vehicleNumber}</span>}
                    </div>
                    {(stop.customTransport.departureStation || stop.customTransport.arrivalStation) && (
                      <div className="text-xs text-gray-500 mt-1">
                        {stop.customTransport.departureStation && `From: ${stop.customTransport.departureStation}`}
                        {stop.customTransport.departureStation && stop.customTransport.arrivalStation && " • "}
                        {stop.customTransport.arrivalStation && `To: ${stop.customTransport.arrivalStation}`}
                      </div>
                    )}
                  </div>
                </>
              ) : stop.trainDetails ? (
                <>
                  <div className="font-medium text-[#264653]">{stop.trainDetails.duration}</div>
                  <div className="text-sm text-[#264653]">
                    <span className="font-medium">Train</span>
                    <span className="mx-1">•</span>
                    <span>{stop.trainDetails.trainNumber}</span>
                    <span className="mx-1">•</span>
                    <span>{stop.trainDetails.changes === 0 ? 'Direct' : `${stop.trainDetails.changes} changes`}</span>
                    {stop.trainDetails.price && (
                      <>
                        <span className="mx-1">•</span>
                        <span>{stop.trainDetails.price.amount} {stop.trainDetails.price.currency}</span>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="font-medium text-[#264653] flex items-center">
                    Add transport details
                    <span className="ml-2 text-xs bg-[#FFD166] text-white px-2 py-0.5 rounded-full">Click to choose</span>
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

      {/* Transport modals - placed inside the component return */}
      {showTransportScreen && nextStop && (
        <TransportScreen
          isOpen={showTransportScreen}
          onClose={() => setShowTransportScreen(false)}
          onSave={handleTransportSave}
          fromCity={cityData || null}
          toCity={nextCityData || null}
          date={stop.departureDate}
          initialData={stop.customTransport}
        />
      )}

      {showTrainSchedule && nextStop && (
        <TrainSchedule
          fromCity={cityData?.name || ""}
          toCity={nextCityData?.name || ""}
          date={stop.departureDate}
          onSelectTrain={handleTrainSelect}
          onClose={() => setShowTrainSchedule(false)}
        />
      )}
    </div>
  );
}; 