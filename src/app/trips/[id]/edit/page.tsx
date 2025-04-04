"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import TripForm from "@/components/TripForm";
import { FormTrip } from "@/types";
import { loadTrips, saveTrips } from "@/lib/utils";

export default function EditTrip({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [trip, setTrip] = useState<FormTrip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load trip data
    const trips = loadTrips();
    const foundTrip = trips.find((t: FormTrip) => t._id === params.id);
    
    if (foundTrip) {
      setTrip(foundTrip);
    } else {
      // Trip not found, redirect to home
      router.push("/");
    }
    
    setIsLoading(false);
  }, [params.id, router]);

  const handleSubmit = (formData: FormTrip) => {
    if (!trip) return;
    
    setIsSubmitting(true);
    
    try {
      // Load all trips
      const trips = loadTrips();
      
      // Find the index of the trip to update
      const tripIndex = trips.findIndex((t: FormTrip) => t._id === trip._id);
      
      if (tripIndex !== -1) {
        // Create updated trip object
        const updatedTrip: FormTrip = {
          ...trip,
          name: formData.name,
          startDate: formData.startDate,
          endDate: formData.endDate,
          notes: formData.notes,
          stops: formData.stops
            .filter(stop => stop.cityId) // Filter out empty stops
            .map(stop => ({
              cityId: stop.cityId,
              arrivalDate: stop.arrivalDate,
              departureDate: stop.departureDate,
              nights: stop.nights || 1,
              accommodation: stop.accommodation || '',
              notes: stop.notes || ''
            }))
        };
        
        // Update the trip in the array
        trips[tripIndex] = updatedTrip;
        
        // Save all trips
        saveTrips(trips);
        
        // Redirect to trip details
        router.push(`/trips/${trip._id}`);
      }
    } catch (error) {
      console.error("Error updating trip:", error);
      alert("There was an error updating your trip. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!trip) {
    return <div className="text-center py-12">Trip not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Link 
          href={`/trips/${trip._id}`}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Trip Details
        </Link>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Trip</h1>
        <TripForm 
          initialData={trip} 
          onSubmit={handleSubmit} 
        />
      </div>
    </div>
  );
} 