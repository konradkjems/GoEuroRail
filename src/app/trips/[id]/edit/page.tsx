"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import TripForm from "@/components/TripForm";
import { FormTrip } from "@/types";
import { loadTrips, saveTrips } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/Layout";

export default function EditTrip({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [trip, setTrip] = useState<FormTrip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check authentication and redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/login?redirect=/trips/${params.id}/edit`);
    }
  }, [isAuthenticated, authLoading, router, params.id]);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Load trip data
    const trips = loadTrips();
    const foundTrip = trips.find((t: FormTrip) => t._id === params.id);
    
    if (foundTrip) {
      // Check if user owns this trip
      if (!foundTrip.userId || foundTrip.userId === user?.id) {
        setTrip(foundTrip);
      } else {
        // Trip belongs to another user, redirect to trips page
        router.push('/trips');
      }
    } else {
      // Trip not found, redirect to trips page
      router.push("/trips");
    }
    
    setIsLoading(false);
  }, [params.id, router, isAuthenticated, user]);

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
            })),
          userId: user?.id // Ensure the user ID is set
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

  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#06D6A0] mx-auto"></div>
            <p className="mt-4 text-[#264653]">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!trip) {
    return (
      <Layout>
        <div className="text-center py-12">Trip not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center mb-6">
          <Link 
            href={`/trips/${trip._id}`}
            className="flex items-center text-[#264653] hover:text-[#06D6A0]"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Trip Details
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-[#264653] mb-6">Edit Trip</h1>
          <TripForm 
            initialData={trip} 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </Layout>
  );
} 