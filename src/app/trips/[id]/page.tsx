"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormTrip, FormTripStop } from "@/types";
import { loadTrips, saveTrips } from "@/lib/utils";
import Layout from "@/components/Layout";
import SplitView from "@/components/SplitView";
import TripItinerary from "@/components/TripItinerary";
import dynamic from "next/dynamic";
import { cities } from "@/lib/cities";
import { useAuth } from "@/context/AuthContext";

// Dynamically import the map component to avoid server-side rendering issues
const InterrailMap = dynamic(() => import("@/components/InterrailMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 flex items-center justify-center">Loading map...</div>
});

export default function TripDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [trip, setTrip] = useState<FormTrip | null>(null);
  const [selectedStopIndex, setSelectedStopIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication and redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/login?redirect=/trips/${params.id}`);
    }
  }, [isAuthenticated, authLoading, router, params.id]);

  useEffect(() => {
    if (!params.id || !isAuthenticated) return;
    
    // Special case for new trip
    if (params.id === 'new') {
      // Create a new empty trip
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      
      const newTrip: FormTrip = {
        _id: Date.now().toString(),
        name: "New Trip",
        startDate: today.toISOString().split('T')[0],
        endDate: nextWeek.toISOString().split('T')[0],
        notes: "",
        travelers: 1,
        stops: [],
        userId: user?.id
      };
      
      setTrip(newTrip);
      setIsLoading(false);
      
      // Get existing trips to add this one
      const savedTrips = localStorage.getItem('trips');
      let existingTrips: FormTrip[] = [];
      if (savedTrips) {
        existingTrips = JSON.parse(savedTrips);
      }
      
      // Add to localStorage
      const updatedTrips = [...existingTrips, newTrip];
      localStorage.setItem('trips', JSON.stringify(updatedTrips));
      
      // Update URL to use real ID without reloading
      router.replace(`/trips/${newTrip._id}`);
      return;
    }
    
    // Normal trip loading
    const savedTrips = localStorage.getItem('trips');
    if (savedTrips) {
      const parsedTrips = JSON.parse(savedTrips);
      const foundTrip = parsedTrips.find((t: FormTrip) => t._id === params.id);
      
      if (foundTrip) {
        // Check if user owns this trip or if it's a shared trip (no userId)
        if (!foundTrip.userId || foundTrip.userId === user?.id) {
          setTrip(foundTrip);
        } else {
          // Trip belongs to another user, redirect to trips page
          router.push('/trips');
        }
      } else {
        // Trip not found, redirect to trips page
        router.push('/trips');
      }
    }
    
    setIsLoading(false);
  }, [params.id, router, isAuthenticated, user]);

  useEffect(() => {
    // Listen for addCityToTrip event
    const handleAddCityToTrip = (event: any) => {
      const { cityId } = event.detail;
      if (trip && cityId) {
        addCityToTrip(cityId);
      }
    };
    
    window.addEventListener('addCityToTrip', handleAddCityToTrip);
    
    return () => {
      window.removeEventListener('addCityToTrip', handleAddCityToTrip);
    };
  }, [trip]);

  const handleDeleteTrip = (id: string) => {
    if (!id) return;
    
    const savedTrips = localStorage.getItem('trips');
    if (savedTrips) {
      const parsedTrips = JSON.parse(savedTrips);
      const updatedTrips = parsedTrips.filter((t: FormTrip) => t._id !== id);
      
      // Update localStorage
      localStorage.setItem('trips', JSON.stringify(updatedTrips));
      
      // Redirect to trips page instead of home
      router.push('/trips');
    }
  };

  const handleUpdateTrip = (updatedTrip: FormTrip) => {
    if (!updatedTrip) return;
    
    const savedTrips = localStorage.getItem('trips');
    if (savedTrips) {
      const parsedTrips = JSON.parse(savedTrips);
      const updatedTrips = parsedTrips.map((t: FormTrip) => 
        t._id === updatedTrip._id ? updatedTrip : t
      );
      
      // Update localStorage
      localStorage.setItem('trips', JSON.stringify(updatedTrips));
      
      // Update local state
      setTrip(updatedTrip);
    }
  };

  const handleCityClick = (cityId: string) => {
    if (!trip) return;
    
    // Find the stop index for this city
    const stopIndex = trip.stops.findIndex(stop => stop.cityId === cityId);
    
    if (stopIndex !== -1) {
      setSelectedStopIndex(stopIndex);
    }
  };

  // Function to add a city to the trip
  const addCityToTrip = (cityId: string) => {
    if (!trip) return;
    
    // Find the city from our cities list
    const cityToAdd = cities.find(city => city.id === cityId);
    if (!cityToAdd) return;
    
    // Check if city is already in the trip
    const isAlreadyInTrip = trip.stops.some(stop => stop.cityId === cityId);
    if (isAlreadyInTrip) {
      alert(`${cityToAdd.name} is already in your trip.`);
      return;
    }
    
    // Estimate the arrival and departure dates based on the last stop or trip start date
    let arrivalDate;
    if (trip.stops.length > 0) {
      // Get the last stop's departure date or add 1 day to arrival if no departure
      const lastStop = trip.stops[trip.stops.length - 1];
      const lastStopDate = lastStop.departureDate || 
                           (lastStop.arrivalDate ? new Date(new Date(lastStop.arrivalDate).getTime() + 86400000).toISOString() : null);
      arrivalDate = lastStopDate || trip.startDate;
    } else {
      arrivalDate = trip.startDate;
    }
    
    // Create a departure date 1 day after arrival
    const arrivalDateObj = new Date(arrivalDate);
    const departureDateObj = new Date(arrivalDateObj);
    departureDateObj.setDate(departureDateObj.getDate() + 1);
    
    // Create the new stop
    const newStop: FormTripStop = {
      cityId: cityToAdd.id,
      arrivalDate: arrivalDateObj.toISOString().split('T')[0],
      departureDate: departureDateObj.toISOString().split('T')[0],
      accommodation: '',
      notes: '',
      nights: 1
    };
    
    // Add the stop to the trip
    const updatedTrip = {
      ...trip,
      stops: [...trip.stops, newStop]
    };
    
    // Update the trip
    handleUpdateTrip(updatedTrip);
    
    // Select the new stop
    setSelectedStopIndex(updatedTrip.stops.length - 1);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!trip) {
    return (
      <Layout>
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500">Trip not found</p>
        </div>
      </Layout>
    );
  }

  // Map section
  const mapSection = (
    <div className="h-full">
      <InterrailMap
        selectedTrip={trip}
        onCityClick={handleCityClick}
      />
    </div>
  );

  // Content section
  const contentSection = (
    <div className="h-full flex flex-col">
      <TripItinerary
        trip={trip}
        onDeleteTrip={handleDeleteTrip}
        selectedStopIndex={selectedStopIndex}
        onSelectStop={setSelectedStopIndex}
        onUpdateTrip={handleUpdateTrip}
      />
    </div>
  );

  return (
    <Layout>
      <SplitView 
        mapSection={mapSection}
        contentSection={contentSection}
        mapWidth="50%"
      />
    </Layout>
  );
} 