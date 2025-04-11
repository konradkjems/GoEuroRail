"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormTrip, City, FormTripStop } from "@/types";
import Layout from "@/components/Layout";
import SplitView from "@/components/SplitView";
import { cities } from "@/lib/cities";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useAuth } from "@/context/AuthContext";
import { 
  PlusIcon, 
  TrashIcon, 
  CalendarIcon, 
  UsersIcon,
  MapPinIcon,
  ArrowRightIcon,
  PencilSquareIcon,
  DocumentTextIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

// Dynamically import the map component to avoid server-side rendering issues
const InterrailMap = dynamic(() => import("@/components/InterrailMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 flex items-center justify-center">Loading map...</div>
});

export default function NewTrip() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [selectedCities, setSelectedCities] = useState<City[]>([]);
  
  // Form state
  const [tripName, setTripName] = useState("My European Adventure");
  const [startDate, setStartDate] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Check authentication and redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/trips/new');
    }
  }, [isAuthenticated, authLoading, router]);

  // Initialize dates
  useEffect(() => {
    setIsClient(true);
    
    // Set default start date to today
    const today = new Date();
    setStartDate(today.toISOString().split('T')[0]);

    // Add event listener for addCityToTrip
    const handleAddCityToTrip = (event: CustomEvent) => {
      const cityId = event.detail.cityId;
      const city = cities.find(c => c.id === cityId);
      if (!city) return;
      
      setSelectedCities(prev => {
        // Don't add if already selected
        if (prev.some(c => c.id === cityId)) return prev;
        return [...prev, city];
      });
    };

    window.addEventListener('addCityToTrip', handleAddCityToTrip as EventListener);
    
    return () => {
      window.removeEventListener('addCityToTrip', handleAddCityToTrip as EventListener);
    };
  }, []);

  // Calculate end date based on stays
  const calculateEndDate = (stops: FormTripStop[]): string => {
    if (stops.length === 0) return startDate;
    
    let currentDate = new Date(startDate);
    stops.forEach(stop => {
      currentDate.setDate(currentDate.getDate() + (stop.nights || 1));
    });
    
    return currentDate.toISOString().split('T')[0];
  };

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
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Create trip
  const handleCreateTrip = () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Create stops from selected cities with default 1 night stay
    const stops: FormTripStop[] = selectedCities.map((city, index) => {
      let currentDate = new Date(startDate);
      if (index > 0) {
        // Add the nights from previous stops to get the arrival date
        for (let i = 0; i < index; i++) {
          currentDate.setDate(currentDate.getDate() + 1); // Default 1 night per stop
        }
      }
      
      const arrivalDate = new Date(currentDate);
      const departureDate = new Date(currentDate);
      departureDate.setDate(departureDate.getDate() + 1);
      
      return {
        cityId: city.id,
        arrivalDate: arrivalDate.toISOString().split('T')[0],
        departureDate: departureDate.toISOString().split('T')[0],
        nights: 1,
        notes: "",
        accommodation: ""
      };
    });
    
    // Calculate end date based on stays
    const endDate = calculateEndDate(stops);
    
    // Create new trip
    const newTrip: FormTrip = {
      _id: Date.now().toString(),
      name: tripName,
      startDate,
      endDate,
      travelers,
      notes,
      stops,
      userId: user?.id, // Associate trip with the current user
    };
    
    // Save to localStorage
    try {
      const savedTrips = localStorage.getItem('trips');
      let existingTrips: FormTrip[] = [];
      
      if (savedTrips) {
        existingTrips = JSON.parse(savedTrips);
      }
      
      localStorage.setItem('trips', JSON.stringify([...existingTrips, newTrip]));
      
      // Redirect to the trip detail page
      router.push(`/trips/${newTrip._id}`);
    } catch (error) {
      console.error("Error saving trip:", error);
      setIsSubmitting(false);
      alert("There was an error creating your trip. Please try again.");
    }
  };

  // Map section with city selection
  const mapSection = (
    <div className="h-full relative">
      <InterrailMap
        selectedTrip={{
          _id: "temp",
          name: tripName,
          startDate,
          endDate: calculateEndDate([]),
          notes: "",
          travelers: 1,
          stops: selectedCities.map(city => ({
            cityId: city.id,
            arrivalDate: startDate,
            departureDate: calculateEndDate([]),
            nights: 1,
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
          
          {/* Start Date */}
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
            <label className="block text-sm font-medium text-[#264653] mb-2">
              Selected Cities
            </label>
            {selectedCities.length > 0 ? (
              <div className="space-y-2">
                {selectedCities.map((city, index) => (
                  <div key={city.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <div className="flex items-center">
                      <MapPinIcon className="h-4 w-4 text-[#264653] mr-2" />
                      <span className="text-sm text-[#264653]">{city.name}, {city.country}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveCity(city.id)}
                      className="text-[#F94144] hover:text-[#E53E41]"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#264653]/70">Click cities on the map to add them to your trip</p>
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
          mapWidth="60%"
        />
      )}
    </Layout>
  );
} 