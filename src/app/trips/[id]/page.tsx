"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormTrip, FormTripStop } from "@/types";
import { loadTrips, saveTrips } from "@/lib/utils";
import Layout from "@/components/Layout";
import ModernTripPlanner from "@/components/ModernTripPlanner";
import { useAuth } from "@/context/AuthContext";

export default function TripDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [trip, setTrip] = useState<FormTrip | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // Show loading state
  if (isLoading || !trip) {
    return (
      <Layout>
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500">Loading trip details...</p>
        </div>
      </Layout>
    );
  }

  // Render the modern trip planner UI
  return (
    <Layout>
      <ModernTripPlanner
        trip={trip}
        onUpdateTrip={handleUpdateTrip}
      />
    </Layout>
  );
} 