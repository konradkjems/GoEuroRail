'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { FormTripStop } from '@/types';
import { getAccommodations, Accommodation } from '@/lib/api/accommodationService';
import AccommodationList from './AccommodationList';
import ExternalSearchButtons from './ExternalSearchButtons';
import { XMarkIcon } from '@heroicons/react/24/outline';

// Dynamically import the AccommodationMap component to avoid SSR issues
const AccommodationMap = dynamic(() => import('@/components/AccommodationMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 flex items-center justify-center">Loading map...</div>
});

// Interface for the accommodation data structure used in the map
interface MapAccommodation {
  id: string;
  name: string;
  price: {
    amount: number;
    currency: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  rating?: number;
  imageUrl?: string;
  type: string;
}

interface AccommodationScreenProps {
  city: string;
  checkInDate: string; // Format: YYYY-MM-DD
  checkOutDate: string; // Format: YYYY-MM-DD
  accommodations?: Accommodation[]; // Optional - for when we have real data
  currentTripStop?: FormTripStop; // Current trip stop if this is called from trip itinerary
  onSelectAccommodation?: (accommodation: Accommodation) => void; // Callback when user selects an accommodation
  travelers?: number; // Number of travelers from the trip
  onClose?: () => void; // Callback when the modal is closed
}

export default function AccommodationScreen({ 
  city, 
  checkInDate, 
  checkOutDate,
  accommodations: propAccommodations,
  currentTripStop,
  onSelectAccommodation,
  travelers = 2, // Default to 2 if not provided
  onClose
}: AccommodationScreenProps) {
  const [selectedAccommodation, setSelectedAccommodation] = useState<string | null>(null);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Format dates for display
  const formatDisplayDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const formattedCheckIn = formatDisplayDate(checkInDate);
  const formattedCheckOut = formatDisplayDate(checkOutDate);
  
  // Calculate nights
  const calculateNights = (): number => {
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  const nights = calculateNights();
  
  // Create URLs for external search
  const formatExternalDate = (dateStr: string): string => {
    // Convert YYYY-MM-DD to format expected by booking sites
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  
  const bookingUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(city)}&checkin=${formatExternalDate(checkInDate)}&checkout=${formatExternalDate(checkOutDate)}&group_adults=${travelers}&no_rooms=1`;
  const hostelworldUrl = `https://www.hostelworld.com/search?q=${encodeURIComponent(city)}&from=${formatExternalDate(checkInDate)}&to=${formatExternalDate(checkOutDate)}&guests=${travelers}`;

  // Handle selecting an accommodation
  const handleSelectAccommodation = (accommodation: Accommodation) => {
    setSelectedAccommodation(accommodation.id);
    if (onSelectAccommodation) {
      onSelectAccommodation(accommodation);
    }
  };

  // Calculate map center based on accommodations
  const getMapCenter = () => {
    // If we have accommodations, use their average position
    if (accommodations.length > 0) {
      // If there's a selected accommodation, center on it
      if (selectedAccommodation) {
        const selected = accommodations.find(acc => acc.id === selectedAccommodation);
        if (selected) return { lat: selected.latitude, lng: selected.longitude };
      }
      
      // Otherwise calculate the average center of all accommodations
      const sumLat = accommodations.reduce((sum, acc) => sum + acc.latitude, 0);
      const sumLng = accommodations.reduce((sum, acc) => sum + acc.longitude, 0);
      return {
        lat: sumLat / accommodations.length,
        lng: sumLng / accommodations.length
      };
    }
    
    // For popular cities, use predefined coordinates
    const cityCoordinates: {[key: string]: {lat: number, lng: number}} = {
      'vienna': { lat: 48.2082, lng: 16.3738 },
      'paris': { lat: 48.8566, lng: 2.3522 },
      'amsterdam': { lat: 52.3676, lng: 4.9041 },
      'berlin': { lat: 52.5200, lng: 13.4050 },
      'rome': { lat: 41.9028, lng: 12.4964 },
      'barcelona': { lat: 41.3851, lng: 2.1734 },
      'london': { lat: 51.5074, lng: -0.1278 },
      'prague': { lat: 50.0755, lng: 14.4378 },
      'budapest': { lat: 47.4979, lng: 19.0402 }
    };
    
    // Check if city name contains any of our predefined cities (case insensitive)
    const cityLower = city.toLowerCase();
    for (const [knownCity, coords] of Object.entries(cityCoordinates)) {
      if (cityLower.includes(knownCity)) {
        return coords;
      }
    }
    
    // Default to Europe center if city not recognized
    return { lat: 48.8566, lng: 9.0 };
  };

  // Convert accommodations to map format
  const mapAccommodations: MapAccommodation[] = accommodations.map(acc => ({
    id: acc.id,
    name: acc.name,
    price: acc.price,
    location: {
      lat: acc.latitude,
      lng: acc.longitude
    },
    type: acc.type
  }));

  // Fetch accommodations for this city and date range
  useEffect(() => {
    if (propAccommodations) {
      setAccommodations(propAccommodations);
    } else {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          // Call the accommodation service to get real or mock data
          const data = await getAccommodations({
            cityName: city,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            adults: travelers, // Use the travelers prop
            rooms: 1
          });
          setAccommodations(data);
          
          // Set map center - average position of all accommodations
          if (data.length > 0) {
            const latTotal = data.reduce((sum, item) => sum + item.latitude, 0);
            const lngTotal = data.reduce((sum, item) => sum + item.longitude, 0);
            
            setMapCenter({
              lat: latTotal / data.length,
              lng: lngTotal / data.length
            });
          } else {
            // If no accommodations found, use the default city center
            const defaultCenter = getMapCenter();
            setMapCenter(defaultCenter);
          }
        } catch (error) {
          console.error('Error fetching accommodations:', error);
          // Set default center on error
          const defaultCenter = getMapCenter();
          setMapCenter(defaultCenter);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchData();
    }
  }, [city, checkInDate, checkOutDate, propAccommodations, travelers]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="w-[95%] h-[90%] bg-white rounded-xl overflow-hidden shadow-xl flex flex-col">
        {/* Header with close button */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-[#264653]">
              Find Accommodation in {city}
            </h2>
            <p className="text-sm text-[#264653] opacity-80">
              {formattedCheckIn} - {formattedCheckOut} · {nights} {nights === 1 ? 'night' : 'nights'} · {travelers} {travelers === 1 ? 'adult' : 'adults'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow h-full overflow-hidden">
          {/* External search buttons */}
          <ExternalSearchButtons 
            bookingUrl={bookingUrl} 
            hostelworldUrl={hostelworldUrl} 
          />

          <div className="flex flex-col md:flex-row flex-grow overflow-hidden">
            {/* Accommodations list */}
            <AccommodationList
              accommodations={accommodations}
              isLoading={isLoading}
              selectedAccommodationId={selectedAccommodation}
              onSelectAccommodation={handleSelectAccommodation}
              city={city}
              bookingUrl={bookingUrl}
              hostelworldUrl={hostelworldUrl}
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              travelers={travelers}
            />

            {/* Map section */}
            <div className="w-full md:w-3/5 h-1/2 md:h-full relative">
              <div className="absolute inset-0 md:border-l border-t md:border-t-0 border-gray-200">
                {!isLoading && accommodations.length > 0 && (
                  <React.Suspense fallback={<div className="h-full w-full bg-gray-100 flex items-center justify-center">Loading map...</div>}>
                    <ErrorBoundary fallback={<div className="p-4 text-red-500">Error loading map. Please try refreshing.</div>}>
                      <AccommodationMap
                        accommodations={mapAccommodations}
                        center={mapCenter}
                        selectedId={selectedAccommodation}
                        onMarkerClick={(id) => {
                          const selected = accommodations.find(a => a.id === id);
                          if (selected) {
                            setSelectedAccommodation(id);
                            handleSelectAccommodation(selected);
                            
                            // Scroll to the selected accommodation in the list
                            if (containerRef.current) {
                              const element = containerRef.current.querySelector(`[data-id="${id}"]`);
                              element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                          }
                        }}
                      />
                    </ErrorBoundary>
                  </React.Suspense>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple Error Boundary component
class ErrorBoundary extends React.Component<{children: React.ReactNode, fallback: React.ReactNode}> {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  componentDidCatch(error: any, info: any) {
    console.error("Map error:", error, info);
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    
    return this.props.children;
  }
} 