"use client";

import { useState, useEffect } from "react";
import { loadTrips, saveTrips } from "@/lib/utils";
import { Trip, TripStop, FormTrip, FormTripStop, City } from "@/types";
import SplitView from "@/components/SplitView";
import dynamic from "next/dynamic";
import TripItinerary from "@/components/TripItinerary";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@heroicons/react/24/outline";
import { cities } from "@/lib/cities";
import Link from "next/link";

// Dynamically import the map component to avoid server-side rendering issues
const InterrailMap = dynamic(() => import("@/components/InterrailMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 flex items-center justify-center">Loading map...</div>
});

export default function Home() {
  const [trips, setTrips] = useState<FormTrip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<FormTrip | null>(null);
  const [selectedStopIndex, setSelectedStopIndex] = useState(-1);
  const [isClient, setIsClient] = useState(false);
  const [showNewTripForm, setShowNewTripForm] = useState(false);
  const router = useRouter();

  // New trip state
  const [newTripName, setNewTripName] = useState("");
  const [newTripStartDate, setNewTripStartDate] = useState("");
  const [newTripEndDate, setNewTripEndDate] = useState("");

  useEffect(() => {
    // This will only run on the client
    setIsClient(true);
    
    // Set default dates for new trip
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    setNewTripStartDate(today.toISOString().split('T')[0]);
    setNewTripEndDate(nextWeek.toISOString().split('T')[0]);
    
    // Load trips from localStorage on component mount
    const savedTrips = localStorage.getItem('trips');
    if (savedTrips) {
      const parsedTrips = JSON.parse(savedTrips);
      setTrips(parsedTrips);
      
      // Select the first trip if available
      if (parsedTrips.length > 0) {
        setSelectedTrip(parsedTrips[0]);
      }
    }
    
    // Listen for addCityToTrip event
    const handleAddCityToTrip = (event: any) => {
      const { cityId } = event.detail;
      if (selectedTrip && cityId) {
        addCityToTrip(cityId);
      }
    };
    
    window.addEventListener('addCityToTrip', handleAddCityToTrip);
    
    return () => {
      window.removeEventListener('addCityToTrip', handleAddCityToTrip);
    };
  }, [selectedTrip]);

  // Function to add a city to the selected trip
  const addCityToTrip = (cityId: string) => {
    if (!selectedTrip) return;
    
    // Find the city from our cities list
    const cityToAdd = cities.find(city => city.id === cityId);
    if (!cityToAdd) return;
    
    // Check if city is already in the trip
    const isAlreadyInTrip = selectedTrip.stops.some(stop => stop.cityId === cityId);
    if (isAlreadyInTrip) {
      alert(`${cityToAdd.name} is already in your trip.`);
      return;
    }
    
    // Estimate the arrival date based on the last stop or trip start date
    let arrivalDateStr: string;
    if (selectedTrip.stops.length > 0) {
      // Get the last stop's departure date or add 1 day to arrival if no departure
      const lastStop = selectedTrip.stops[selectedTrip.stops.length - 1];
      arrivalDateStr = lastStop.departureDate || selectedTrip.startDate;
    } else {
      arrivalDateStr = selectedTrip.startDate;
    }
    
    // Create a departure date 1 day after arrival
    const arrivalDate = new Date(arrivalDateStr);
    const departureDate = new Date(arrivalDate);
    departureDate.setDate(arrivalDate.getDate() + 1);
    
    // Create the new stop
    const newStop: FormTripStop = {
      cityId: cityToAdd.id,
      arrivalDate: arrivalDate.toISOString().split('T')[0],
      departureDate: departureDate.toISOString().split('T')[0],
      accommodation: '',
      notes: '',
      nights: 1,  // Add default value for nights
      isStopover: false  // Initialize as not a stopover
    };
    
    // Add the stop to the trip
    const updatedTrip: FormTrip = {
      ...selectedTrip,
      stops: [...selectedTrip.stops, newStop]
    };
    
    // Update the trip
    handleUpdateTrip(updatedTrip);
    
    // Select the new stop
    setSelectedStopIndex(updatedTrip.stops.length - 1);
  };

  // Create a new trip
  const handleCreateTrip = () => {
    if (!newTripName) return;
    
    const newTrip: FormTrip = {
      _id: Date.now().toString(),
      name: newTripName,
      startDate: newTripStartDate,
      endDate: newTripEndDate,
      notes: "",
      stops: []
    };
    
    const updatedTrips = [...trips, newTrip];
    setTrips(updatedTrips);
    setSelectedTrip(newTrip);
    setShowNewTripForm(false);
    
    // Save to localStorage
    localStorage.setItem('trips', JSON.stringify(updatedTrips));
  };

  // Handle trip deletion
  const handleDeleteTrip = (id: string) => {
    const updatedTrips = trips.filter(trip => trip._id !== id);
    setTrips(updatedTrips);
    
    // Update localStorage
    localStorage.setItem('trips', JSON.stringify(updatedTrips));
    
    // Update selected trip
    if (updatedTrips.length > 0) {
      setSelectedTrip(updatedTrips[0]);
    } else {
      setSelectedTrip(null);
    }
  };

  // Handle trip update
  const handleUpdateTrip = (updatedTrip: FormTrip) => {
    const updatedTrips = trips.map(trip => 
      trip._id === updatedTrip._id ? updatedTrip : trip
    );
    
    setTrips(updatedTrips);
    setSelectedTrip(updatedTrip);
    
    // Update localStorage
    localStorage.setItem('trips', JSON.stringify(updatedTrips));
  };

  // Handle city clicks from the map
  const handleCityClick = (cityId: string) => {
    if (!selectedTrip) return;
    
    // Find the stop index for this city
    const stopIndex = selectedTrip.stops.findIndex(stop => stop.cityId === cityId);
    
    if (stopIndex !== -1) {
      setSelectedStopIndex(stopIndex);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)]">
      {isClient && (
        <SplitView
          mapSection={
            <div className="h-full relative">
              <InterrailMap
                selectedTrip={selectedTrip}
                onCityClick={handleCityClick}
              />
              {showNewTripForm && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <h2 className="text-xl font-bold text-[#264653] mb-4">Create New Trip</h2>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="tripName" className="block text-sm font-medium text-gray-700">Trip Name</label>
                        <input
                          type="text"
                          id="tripName"
                          value={newTripName}
                          onChange={(e) => setNewTripName(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#06D6A0] focus:ring-[#06D6A0] sm:text-sm"
                          placeholder="Enter trip name"
                        />
                      </div>
                      <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                        <input
                          type="date"
                          id="startDate"
                          value={newTripStartDate}
                          onChange={(e) => setNewTripStartDate(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#06D6A0] focus:ring-[#06D6A0] sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                        <input
                          type="date"
                          id="endDate"
                          value={newTripEndDate}
                          onChange={(e) => setNewTripEndDate(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#06D6A0] focus:ring-[#06D6A0] sm:text-sm"
                        />
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => setShowNewTripForm(false)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleCreateTrip}
                          className="px-4 py-2 text-sm font-medium bg-[#06D6A0] text-white rounded-md hover:bg-[#05C090]"
                        >
                          Create Trip
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {!selectedTrip && !showNewTripForm && (
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => setShowNewTripForm(true)}
                    className="bg-[#FFD166] text-[#264653] px-4 py-2 rounded-md shadow hover:bg-[#FFC233] flex items-center"
                  >
                    <PlusIcon className="h-5 w-5 mr-1" />
                    Create New Trip
                  </button>
                </div>
              )}
            </div>
          }
          contentSection={
            <div className="h-full flex flex-col">
              <TripItinerary
                trip={selectedTrip}
                onDeleteTrip={handleDeleteTrip}
                selectedStopIndex={selectedStopIndex}
                onSelectStop={setSelectedStopIndex}
                onUpdateTrip={handleUpdateTrip}
              />
            </div>
          }
          mapWidth="60%"
        />
      )}
    </div>
  );
}
