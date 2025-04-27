"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormTrip, FormTripStop } from "@/types";
import { loadTrips, saveTrips } from "@/lib/utils";
import Layout from "@/components/Layout";
import SplitView from "@/components/SplitView";
import TripItinerary from "@/components/TripItinerary";
import TrainSchedule from "@/components/TrainSchedule";
import { TrainConnection } from "@/lib/api/trainSchedule";
import dynamic from "next/dynamic";
import { cities } from "@/lib/cities";
import { useAuth } from "@/context/AuthContext";

// Dynamically import map components to avoid server-side rendering issues
const InterrailMap = dynamic(() => import("@/components/InterrailMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 flex items-center justify-center">Loading map...</div>
});

const MobileMap = dynamic(() => import("@/components/MobileMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 flex items-center justify-center">Loading map...</div>
});

export default function TripDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [trip, setTrip] = useState<FormTrip | null>(null);
  const [selectedStopIndex, setSelectedStopIndex] = useState(-1);
  const [selectedStop, setSelectedStop] = useState<FormTripStop | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTrainSchedule, setShowTrainSchedule] = useState(false);
  const [trainScheduleData, setTrainScheduleData] = useState<{
    fromCityId: string;
    toCityId: string;
    date: string;
  } | null>(null);

  // Check authentication and redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/login?redirect=/trips/${params.id}`);
    }
  }, [isAuthenticated, authLoading, router, params.id]);

  // Load trip data
  useEffect(() => {
    const loadTripData = async () => {
      setIsLoading(true);
      try {
        const trips = await loadTrips();
        const foundTrip = trips.find((t: FormTrip) => t._id === params.id);
        if (foundTrip) {
          setTrip(foundTrip);
        }
      } catch (error) {
        console.error('Error loading trip:', error);
      }
      setIsLoading(false);
    };

    if (isAuthenticated && !authLoading) {
      loadTripData();
    }
  }, [params.id, isAuthenticated, authLoading]);

  const handleCityClick = (cityId: string) => {
    if (!trip) return;

    const stopIndex = trip.stops.findIndex(stop => stop.cityId === cityId);
    if (stopIndex !== -1) {
      // If the city is already in the trip, select it
      setSelectedStopIndex(stopIndex);
      setSelectedStop(trip.stops[stopIndex]);
    } else {
      // If it's a new city, add it to the trip
      const newStop: FormTripStop = {
        cityId,
        arrivalDate: '',
        departureDate: '',
        nights: 1,
        isStopover: false
      };

      // If there are existing stops, calculate the dates based on the last stop
      if (trip.stops.length > 0) {
        const lastStop = trip.stops[trip.stops.length - 1];
        const lastStopDeparture = new Date(lastStop.departureDate);
        newStop.arrivalDate = lastStopDeparture.toISOString().split('T')[0];
        const newDepartureDate = new Date(lastStopDeparture);
        newDepartureDate.setDate(newDepartureDate.getDate() + 1);
        newStop.departureDate = newDepartureDate.toISOString().split('T')[0];
      } else {
        // First stop in the trip, use the trip's start date
        const startDate = new Date(trip.startDate);
        const nextDay = new Date(startDate);
        nextDay.setDate(nextDay.getDate() + 1);
        newStop.arrivalDate = startDate.toISOString().split('T')[0];
        newStop.departureDate = nextDay.toISOString().split('T')[0];
      }

      // Add the stop to the trip
      const updatedTrip = {
        ...trip,
        stops: [...trip.stops, newStop],
        endDate: newStop.departureDate
      };

      // Update the trip
      handleUpdateTrip(updatedTrip);
      
      // Select the new stop
      setSelectedStopIndex(updatedTrip.stops.length - 1);
      setSelectedStop(newStop);
    }
  };

  const handleUpdateTrip = async (updatedTrip: FormTrip) => {
    try {
      const trips = await loadTrips();
      const updatedTrips = trips.map((t: FormTrip) => 
        t._id === updatedTrip._id ? updatedTrip : t
      );
      await saveTrips(updatedTrips);
      setTrip(updatedTrip);
    } catch (error) {
      console.error('Error updating trip:', error);
    }
  };

  const handleDeleteTrip = async () => {
    if (!trip) return;

    try {
      const trips = await loadTrips();
      const updatedTrips = trips.filter((t: FormTrip) => t._id !== trip._id);
      await saveTrips(updatedTrips);
      router.push('/trips');
    } catch (error) {
      console.error('Error deleting trip:', error);
    }
  };

  const handleUpdateNights = (stopId: string, nights: number) => {
    if (!trip) return;
    
    // Create a new stops array with the updated stop
    const updatedStops = trip.stops.map(stop => {
      if (stop.cityId === stopId) {
        const arrival = new Date(stop.arrivalDate);
        const departure = new Date(arrival);
        departure.setDate(arrival.getDate() + nights);
        
        return {
          ...stop,
          departureDate: departure.toISOString().split('T')[0],
          nights,
          isStopover: nights === 0
        };
      }
      return stop;
    });

    // Update the trip with the new stops array
    const updatedTrip = {
      ...trip,
      stops: updatedStops
    };
    
    // Update the trip in the database
    handleUpdateTrip(updatedTrip);
  };

  const handleShowTrainSchedule = (fromCityId: string, toCityId: string, date: string) => {
    setTrainScheduleData({ fromCityId, toCityId, date });
    setShowTrainSchedule(true);
  };

  const handleTrainSelect = async (train: TrainConnection) => {
    if (!trip || !selectedStop) return;

    const updatedStops = trip.stops.map((stop) => {
      if (stop.cityId === selectedStop.cityId) {
        return {
          ...stop,
          trainDetails: {
            trainNumber: train.trains.map(t => `${t.type} ${t.number}`).join(', '),
            duration: train.duration,
            changes: train.changes,
            price: train.price
          },
        };
      }
      return stop;
    });

    const updatedTrip = { ...trip, stops: updatedStops };
    
    try {
      // Update the trip in the database
      await handleUpdateTrip(updatedTrip);
      // Update local state
      setTrip(updatedTrip);
      // Update selectedStop to reflect the changes
      const updatedSelectedStop = updatedStops.find(stop => stop.cityId === selectedStop.cityId);
      if (updatedSelectedStop) {
        setSelectedStop(updatedSelectedStop);
      }
      setShowTrainSchedule(false);
      setTrainScheduleData(null);
    } catch (error) {
      console.error('Error updating train details:', error);
    }
  };

  const handleShowCityInfo = (cityId: string) => {
    const city = cities.find((c) => c.id === cityId);
    if (city) {
      // You can implement a modal or other UI to show city information
      console.log("Showing city info:", city);
    }
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

  // Desktop view
  const DesktopView = () => (
    <SplitView 
      mapSection={
        <div className="h-full w-full overflow-hidden m-0 p-0">
          <InterrailMap
            selectedTrip={trip}
            onCityClick={handleCityClick}
          />
        </div>
      }
      contentSection={
        <div className="h-full w-full flex flex-col overflow-hidden m-0 p-0">
          <TripItinerary
            trip={trip}
            onDeleteTrip={handleDeleteTrip}
            selectedStopIndex={selectedStopIndex}
            onSelectStop={setSelectedStopIndex}
            onUpdateTrip={handleUpdateTrip}
          />
        </div>
      }
      mapWidth="50%"
    />
  );

  // Mobile view
  const MobileView = () => (
    <MobileMap
      stops={trip.stops}
      onStopClick={handleCityClick}
      onShowTrainSchedule={({ fromCityId, toCityId, date }) => {
        setSelectedStop(trip.stops.find(stop => stop.cityId === fromCityId) || null);
        setTrainScheduleData({ fromCityId, toCityId, date });
      }}
      onShowCityInfo={handleShowCityInfo}
    />
  );

  return (
    <Layout>
      <div className="hidden md:block h-full">
        <DesktopView />
      </div>
      <div className="md:hidden">
        <MobileView />
      </div>
      {showTrainSchedule && trainScheduleData && (
        <TrainSchedule
          fromCity={cities.find(c => c.id === trainScheduleData.fromCityId)?.name || ''}
          toCity={cities.find(c => c.id === trainScheduleData.toCityId)?.name || ''}
          date={trainScheduleData.date}
          onSelectTrain={handleTrainSelect}
          onClose={() => {
            setShowTrainSchedule(false);
            setTrainScheduleData(null);
          }}
        />
      )}
    </Layout>
  );
} 