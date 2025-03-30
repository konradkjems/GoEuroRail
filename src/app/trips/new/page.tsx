"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trip, City } from "@/types";
import Layout from "@/components/Layout";
import SplitView from "@/components/SplitView";
import { cities } from "@/lib/cities";
import Link from "next/link";
import dynamic from "next/dynamic";
import { 
  PlusIcon, 
  TrashIcon, 
  CalendarIcon, 
  UsersIcon,
  MapPinIcon,
  ArrowRightIcon,
  PencilSquareIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";

// Dynamically import the map component to avoid server-side rendering issues
const InterrailMap = dynamic(() => import("@/components/InterrailMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 flex items-center justify-center">Loading map...</div>
});

export default function NewTrip() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [selectedCities, setSelectedCities] = useState<City[]>([]);
  
  // Form state
  const [tripName, setTripName] = useState("My European Adventure");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Initialize dates
  useEffect(() => {
    setIsClient(true);
    
    // Set default dates
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    setStartDate(today.toISOString().split('T')[0]);
    setEndDate(nextWeek.toISOString().split('T')[0]);
  }, []);

  // Handle city selection from the map
  const handleCityClick = (cityId: string) => {
    const city = cities.find(c => c.id === cityId);
    if (!city) return;
    
    if (selectedCities.some(c => c.id === cityId)) {
      // Remove city if already selected
      setSelectedCities(selectedCities.filter(c => c.id !== cityId));
    } else {
      // Add city if not selected
      setSelectedCities([...selectedCities, city]);
    }
  };

  // Remove a city from selection
  const handleRemoveCity = (cityId: string) => {
    setSelectedCities(selectedCities.filter(c => c.id !== cityId));
  };

  // Validate form
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!tripName.trim()) {
      errors.name = "Trip name is required";
    }
    
    if (!startDate) {
      errors.startDate = "Start date is required";
    }
    
    if (!endDate) {
      errors.endDate = "End date is required";
    }
    
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      errors.dates = "End date must be after start date";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Create trip
  const handleCreateTrip = () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Create stops from selected cities
    const stops = selectedCities.map((city, index) => {
      // Calculate dates based on trip length and number of cities
      const tripLengthMs = new Date(endDate).getTime() - new Date(startDate).getTime();
      const stayDurationMs = tripLengthMs / Math.max(1, selectedCities.length - 1);
      const stayDuration = Math.floor(stayDurationMs / (1000 * 60 * 60 * 24));
      
      let arrivalDate, departureDate;
      
      if (index === 0) {
        // First city
        arrivalDate = startDate;
        
        const firstDeparture = new Date(startDate);
        firstDeparture.setDate(firstDeparture.getDate() + stayDuration);
        departureDate = firstDeparture.toISOString().split('T')[0];
      } else if (index === selectedCities.length - 1) {
        // Last city
        const lastArrival = new Date(endDate);
        lastArrival.setDate(lastArrival.getDate() - stayDuration);
        arrivalDate = lastArrival.toISOString().split('T')[0];
        departureDate = endDate;
      } else {
        // Middle cities
        const arrivalMs = new Date(startDate).getTime() + (stayDurationMs * index);
        const departureMs = arrivalMs + stayDurationMs;
        
        arrivalDate = new Date(arrivalMs).toISOString().split('T')[0];
        departureDate = new Date(departureMs).toISOString().split('T')[0];
      }
      
      return {
        city,
        arrivalDate,
        departureDate,
        nights: calculateNights(arrivalDate, departureDate),
        notes: "",
        accommodation: ""
      };
    });
    
    // Create new trip
    const newTrip: Trip = {
      id: Date.now().toString(),
      name: tripName,
      startDate,
      endDate,
      travelers,
      notes,
      stops
    };
    
    // Save to localStorage
    try {
      const savedTrips = localStorage.getItem('trips');
      let existingTrips: Trip[] = [];
      
      if (savedTrips) {
        existingTrips = JSON.parse(savedTrips);
      }
      
      localStorage.setItem('trips', JSON.stringify([...existingTrips, newTrip]));
      
      // Redirect to the trip detail page
      router.push(`/trips/${newTrip.id}`);
    } catch (error) {
      console.error("Error saving trip:", error);
      setIsSubmitting(false);
      alert("There was an error creating your trip. Please try again.");
    }
  };
  
  // Calculate nights between two dates
  const calculateNights = (arrivalDate: string, departureDate: string) => {
    const start = new Date(arrivalDate);
    const end = new Date(departureDate);
    const diff = end.getTime() - start.getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  };

  // Map section with city selection
  const mapSection = (
    <div className="h-full relative">
      <InterrailMap
        selectedTrip={{
          id: "temp",
          name: tripName,
          startDate,
          endDate,
          notes: "",
          travelers: 1,
          stops: selectedCities.map(city => ({
            city,
            arrivalDate: startDate,
            departureDate: endDate,
            accommodation: "",
            notes: ""
          }))
        }}
        onCityClick={handleCityClick}
      />
      <div className="absolute top-4 left-4 bg-white p-2 rounded-md shadow-md">
        <p className="text-xs text-[#264653] font-medium">Click on cities to add them to your trip</p>
      </div>
    </div>
  );

  // Content section with trip form
  const contentSection = (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-[#264653]">Create New Trip</h1>
        <p className="text-sm text-[#264653]/70">Plan your European rail adventure</p>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-6">
          {/* Trip Name */}
          <div>
            <label className="block text-sm font-medium text-[#264653] mb-1">
              Trip Name
            </label>
            <input
              type="text"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:border-[#FFD166] focus:ring focus:ring-[#FFD166]/20 focus:outline-none"
              placeholder="My European Adventure"
            />
            {formErrors.name && (
              <p className="mt-1 text-xs text-[#F94144]">{formErrors.name}</p>
            )}
          </div>
          
          {/* Trip Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#264653] mb-1">
                Start Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 p-2 border border-gray-300 rounded focus:border-[#FFD166] focus:ring focus:ring-[#FFD166]/20 focus:outline-none"
                />
              </div>
              {formErrors.startDate && (
                <p className="mt-1 text-xs text-[#F94144]">{formErrors.startDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#264653] mb-1">
                End Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-10 p-2 border border-gray-300 rounded focus:border-[#FFD166] focus:ring focus:ring-[#FFD166]/20 focus:outline-none"
                />
              </div>
              {formErrors.endDate && (
                <p className="mt-1 text-xs text-[#F94144]">{formErrors.endDate}</p>
              )}
            </div>
          </div>
          {formErrors.dates && (
            <p className="mt-1 text-xs text-[#F94144]">{formErrors.dates}</p>
          )}
          
          {/* Number of Travelers */}
          <div>
            <label className="block text-sm font-medium text-[#264653] mb-1">
              Number of Travelers
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UsersIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="number"
                min="1"
                value={travelers}
                onChange={(e) => setTravelers(parseInt(e.target.value))}
                className="w-full pl-10 p-2 border border-gray-300 rounded focus:border-[#FFD166] focus:ring focus:ring-[#FFD166]/20 focus:outline-none"
              />
            </div>
          </div>
          
          {/* Trip Notes */}
          <div>
            <label className="block text-sm font-medium text-[#264653] mb-1">
              Trip Notes (Optional)
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                <DocumentTextIcon className="h-4 w-4 text-gray-400" />
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full pl-10 p-2 border border-gray-300 rounded focus:border-[#FFD166] focus:ring focus:ring-[#FFD166]/20 focus:outline-none"
                rows={3}
                placeholder="Add any notes about your trip here..."
              />
            </div>
          </div>
          
          {/* Selected Cities */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-[#264653]">Selected Cities</h3>
              <span className="text-xs text-[#264653]/70">{selectedCities.length} cities selected</span>
            </div>
            
            {selectedCities.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-auto border border-gray-200 rounded p-2">
                {selectedCities.map((city, index) => (
                  <div 
                    key={city.id} 
                    className="flex items-center justify-between p-2 bg-[#FAF3E0] rounded"
                  >
                    <div className="flex items-center">
                      <span className="w-5 h-5 rounded-full bg-[#FFD166] text-[#264653] flex items-center justify-center text-xs mr-2">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-[#264653]">{city.name}</p>
                        <p className="text-xs text-[#264653]/70">{city.country}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveCity(city.id)}
                      className="text-[#264653] hover:text-[#F94144]"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-gray-300 rounded">
                <MapPinIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Click on the map to select cities for your trip</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-[#FAF3E0] border-t border-gray-200">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleCreateTrip}
            disabled={isSubmitting || selectedCities.length === 0}
            className="flex justify-center items-center py-2 bg-[#FFD166] text-[#264653] rounded text-sm font-medium hover:bg-[#FFC233] disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Trip'}
          </button>
          <Link href="/" 
            className="flex justify-center items-center py-2 bg-white border border-gray-300 rounded text-sm font-medium text-[#264653] hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      {isClient && (
        <SplitView 
          mapSection={mapSection}
          contentSection={contentSection}
          mapWidth="70%"
        />
      )}
    </Layout>
  );
} 