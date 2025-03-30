"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trip } from "@/types";
import Layout from "@/components/Layout";
import { 
  CalendarIcon, 
  TrashIcon, 
  PencilIcon, 
  PlusIcon,
  MapPinIcon,
  UsersIcon,
  ClockIcon
} from "@heroicons/react/24/outline";
import { formatDate } from "@/lib/utils";

export default function TripsPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Load trips from localStorage
  useEffect(() => {
    setIsClient(true);
    const savedTrips = localStorage.getItem('trips');
    if (savedTrips) {
      try {
        const parsedTrips = JSON.parse(savedTrips);
        setTrips(parsedTrips);
      } catch (error) {
        console.error("Error parsing trips:", error);
      }
    }
  }, []);

  // Handle trip deletion
  const handleDeleteTrip = (id: string) => {
    if (confirm("Are you sure you want to delete this trip? This action cannot be undone.")) {
      setIsDeleting(id);
      
      const updatedTrips = trips.filter(trip => trip.id !== id);
      setTrips(updatedTrips);
      
      // Update localStorage
      localStorage.setItem('trips', JSON.stringify(updatedTrips));
      setIsDeleting(null);
    }
  };

  // Calculate trip statistics
  const getTripStats = (trip: Trip) => {
    const cities = trip.stops.length;
    const days = trip.stops.reduce((total, stop) => total + (stop.nights || 0), 0);
    const countries = [...new Set(trip.stops.map(stop => stop.city.country))].length;
    
    return { cities, days, countries };
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#264653]">My Trips</h1>
          <Link 
            href="/trips/new" 
            className="flex items-center py-2 px-4 bg-[#FFD166] text-[#264653] rounded hover:bg-[#FFC233]"
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            <span>New Trip</span>
          </Link>
        </div>
        
        {isClient && (
          <div>
            {trips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trips.map(trip => {
                  const { cities, days, countries } = getTripStats(trip);
                  return (
                    <div 
                      key={trip.id} 
                      className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      {/* Trip header with thumbnail (or placeholder) */}
                      <div 
                        className="h-36 bg-[#264653] relative flex items-center justify-center bg-opacity-80" 
                      >
                        <div className="absolute inset-0 opacity-30 bg-center bg-cover" 
                             style={{ backgroundImage: trip.stops.length > 0 ? 
                               `url(https://source.unsplash.com/featured/600x400?${trip.stops[0].city.name},landmark)` : 
                               'url(https://source.unsplash.com/featured/600x400?europe,train)' 
                             }} 
                        />
                        <div className="relative z-10 text-center px-4">
                          <h2 className="text-xl font-bold text-white mb-2">{trip.name}</h2>
                          <div className="flex items-center justify-center text-xs text-white/90">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            <span>
                              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Trip statistics */}
                      <div className="p-4 border-b border-gray-100">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="flex flex-col items-center">
                            <div className="text-lg font-semibold text-[#06D6A0]">{cities}</div>
                            <div className="text-xs text-gray-500">Cities</div>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="text-lg font-semibold text-[#FFD166]">{days}</div>
                            <div className="text-xs text-gray-500">Days</div>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="text-lg font-semibold text-[#F94144]">{countries}</div>
                            <div className="text-xs text-gray-500">Countries</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Trip stops preview */}
                      <div className="px-4 py-3 bg-[#FAF3E0]/50">
                        <div className="text-sm font-medium text-[#264653] mb-2">Itinerary:</div>
                        <div className="space-y-1">
                          {trip.stops.length > 0 ? (
                            <div>
                              {trip.stops.slice(0, 3).map((stop, index) => (
                                <div key={index} className="flex items-center text-sm">
                                  <MapPinIcon className="h-3 w-3 text-[#264653] mr-1 flex-shrink-0" />
                                  <span className="truncate">{stop.city.name}, {stop.city.country}</span>
                                </div>
                              ))}
                              {trip.stops.length > 3 && (
                                <div className="text-xs text-[#264653]/70 mt-1">
                                  +{trip.stops.length - 3} more stops
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-sm text-[#264653]/70 italic">
                              No stops added yet
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex justify-between p-3 bg-white">
                        <div className="flex space-x-1">
                          <button 
                            onClick={() => handleDeleteTrip(trip.id)}
                            disabled={isDeleting === trip.id}
                            className="p-1 text-[#264653] hover:text-[#F94144] rounded"
                            title="Delete trip"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                          <Link 
                            href={`/trips/${trip.id}/edit`}
                            className="p-1 text-[#264653] hover:text-[#06D6A0] rounded"
                            title="Edit trip"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </Link>
                        </div>
                        <Link
                          href={`/trips/${trip.id}`}
                          className="px-3 py-1 bg-[#FFD166] text-[#264653] text-sm rounded hover:bg-[#FFC233]"
                        >
                          View Trip
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
                <div className="mx-auto w-16 h-16 bg-[#FAF3E0] rounded-full flex items-center justify-center mb-4">
                  <MapPinIcon className="h-8 w-8 text-[#FFD166]" />
                </div>
                <h2 className="text-xl font-semibold text-[#264653] mb-2">No trips yet</h2>
                <p className="text-[#264653]/70 mb-6">
                  Create your first trip to start planning your European rail adventure
                </p>
                <Link 
                  href="/trips/new" 
                  className="inline-flex items-center py-2 px-4 bg-[#FFD166] text-[#264653] rounded hover:bg-[#FFC233]"
                >
                  <PlusIcon className="h-5 w-5 mr-1" />
                  <span>Create New Trip</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
} 