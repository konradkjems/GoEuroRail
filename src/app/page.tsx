"use client";

import { useState, useEffect } from "react";
import { loadTrips, saveTrips } from "@/lib/utils";
import { Trip, TripStop, City } from "@/types";
import Layout from "@/components/Layout";
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
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
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
  }, [selectedTrip]); // Re-add the event listener when selectedTrip changes
  
  // Function to add a city to the selected trip
  const addCityToTrip = (cityId: string) => {
    if (!selectedTrip) return;
    
    // Find the city from our cities list
    const cityToAdd = cities.find(city => city.id === cityId);
    if (!cityToAdd) return;
    
    // Check if city is already in the trip
    const isAlreadyInTrip = selectedTrip.stops.some(stop => stop.city.id === cityId);
    if (isAlreadyInTrip) {
      alert(`${cityToAdd.name} is already in your trip.`);
      return;
    }
    
    // Estimate the arrival and departure dates based on the last stop or trip start date
    let arrivalDate: string;
    if (selectedTrip.stops.length > 0) {
      // Get the last stop's departure date or add 1 day to arrival if no departure
      const lastStop = selectedTrip.stops[selectedTrip.stops.length - 1];
      arrivalDate = lastStop.departureDate || selectedTrip.startDate;
    } else {
      arrivalDate = selectedTrip.startDate;
    }
    
    // Create a departure date 1 day after arrival
    const arrivalDateObj = new Date(arrivalDate);
    const departureDateObj = new Date(arrivalDateObj);
    departureDateObj.setDate(arrivalDateObj.getDate() + 1);
    
    // Create the new stop
    const newStop: TripStop = {
      city: cityToAdd,
      arrivalDate: arrivalDateObj.toISOString().split('T')[0],
      departureDate: departureDateObj.toISOString().split('T')[0],
      nights: 1
    };
    
    // Add the stop to the trip
    const updatedTrip = {
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
    
    const newTrip: Trip = {
      id: Date.now().toString(),
      name: newTripName,
      startDate: newTripStartDate,
      endDate: newTripEndDate,
      notes: "",
      travelers: 1,
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
    const updatedTrips = trips.filter(trip => trip.id !== id);
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
  const handleUpdateTrip = (updatedTrip: Trip) => {
    const updatedTrips = trips.map(trip => 
      trip.id === updatedTrip.id ? updatedTrip : trip
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
    const stopIndex = selectedTrip.stops.findIndex(stop => stop.city.id === cityId);
    
    if (stopIndex !== -1) {
      setSelectedStopIndex(stopIndex);
    }
  };

  // Map section with overlay for new trip form when needed
  const mapSection = (
    <div className="h-full relative">
      <InterrailMap
        selectedTrip={selectedTrip}
        onCityClick={handleCityClick}
      />
      {/* New Trip Form Overlay */}
      {showNewTripForm && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#264653] mb-4">Create New Trip</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#264653] mb-1">
                  Trip Name
                </label>
                <input
                  type="text"
                  value={newTripName}
                  onChange={(e) => setNewTripName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Summer in Europe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#264653] mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={newTripStartDate}
                  onChange={(e) => setNewTripStartDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#264653] mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={newTripEndDate}
                  onChange={(e) => setNewTripEndDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  onClick={handleCreateTrip}
                  disabled={!newTripName}
                  className="flex-1 bg-[#FFD166] text-[#264653] py-2 rounded hover:bg-[#FFC233] disabled:opacity-50"
                >
                  Create Trip
                </button>
                <button
                  onClick={() => setShowNewTripForm(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Create New Trip Button when no trip selected */}
      {!selectedTrip && !showNewTripForm && (
        <div className="absolute top-4 right-4">
          <Link
            href="/trips/new"
            className="bg-[#FFD166] text-[#264653] px-4 py-2 rounded-md shadow hover:bg-[#FFC233] flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            Create New Trip
          </Link>
        </div>
      )}
    </div>
  );

  // Content section component
  const contentSection = (
    <div className="h-full flex flex-col">
      <TripItinerary 
        trip={selectedTrip}
        onDeleteTrip={handleDeleteTrip}
        selectedStopIndex={selectedStopIndex}
        onSelectStop={setSelectedStopIndex}
        onUpdateTrip={handleUpdateTrip}
      />
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
