'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { FormTripStop } from '@/types';
import { getAccommodations, Accommodation } from '@/lib/api/accommodationService';
import AccommodationList from './AccommodationList';
import ExternalSearchButtons from './ExternalSearchButtons';
import { XMarkIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

// Custom error handler for dynamic imports
const withErrorBoundary = (importFn: () => Promise<any>) => {
  return async () => {
    try {
      const component = await importFn();
      return component;
    } catch (error) {
      console.error('Error loading dynamic component:', error);
      // Return a fallback component
      return {
        default: (props: Record<string, any>) => (
          <div className="h-full w-full bg-gray-100 flex items-center justify-center p-4">
            <div className="text-red-500 text-center">
              <p className="mb-2 font-semibold">Failed to load map component</p>
              <p>Please try refreshing the page</p>
            </div>
          </div>
        )
      };
    }
  };
};

// Dynamically import the AccommodationMap component to avoid SSR issues
const AccommodationMap = dynamic(
  withErrorBoundary(() => import('@/components/AccommodationMap')), 
  {
    ssr: false,
    loading: () => <div className="h-full w-full bg-gray-100 flex items-center justify-center">Loading map...</div>
  }
);

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
  console.log("AccommodationScreen received city:", city);
  
  const [selectedAccommodation, setSelectedAccommodation] = useState<string | null>(null);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });
  const [mapLoaded, setMapLoaded] = useState<boolean | null>(null);
  
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
    // Convert YYYY-MM-DD to format expected by booking sites - no change needed, the API already uses YYYY-MM-DD
    try {
      const date = new Date(dateStr);
      // Validate the date is valid
      if (isNaN(date.getTime())) {
        console.error(`Invalid date: ${dateStr}`);
        return dateStr; // Return original if invalid
      }
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    } catch (e) {
      console.error(`Error formatting date: ${dateStr}`, e);
      return dateStr;
    }
  };
  
  // Ensure city is properly encoded for URLs
  const sanitizedCity = city.trim();
  
  // Create properly formatted URLs with correct encoding
  const bookingUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(sanitizedCity)}&checkin=${formatExternalDate(checkInDate)}&checkout=${formatExternalDate(checkOutDate)}&group_adults=${travelers}&no_rooms=1`;
  
  // Use correct Hostelworld URL format with search_key and city parameters
  const hostelworldUrl = `https://www.hostelworld.com/search?search_key=${encodeURIComponent(sanitizedCity)}&city=${encodeURIComponent(sanitizedCity)}&from=${formatExternalDate(checkInDate)}&to=${formatExternalDate(checkOutDate)}&guests=${travelers}`;

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
      'budapest': { lat: 47.4979, lng: 19.0402 },
      'munich': { lat: 48.1351, lng: 11.5820 },
      'zurich': { lat: 47.3769, lng: 8.5417 },
      'copenhagen': { lat: 55.6761, lng: 12.5683 },
      'stockholm': { lat: 59.3293, lng: 18.0686 },
      'oslo': { lat: 59.9139, lng: 10.7522 },
      'helsinki': { lat: 60.1699, lng: 24.9384 },
      'madrid': { lat: 40.4168, lng: -3.7038 },
      'lisbon': { lat: 38.7223, lng: -9.1393 },
      'athens': { lat: 37.9838, lng: 23.7275 },
      'istanbul': { lat: 41.0082, lng: 28.9784 },
      'warsaw': { lat: 52.2297, lng: 21.0122 },
      'milan': { lat: 45.4642, lng: 9.1900 },
      'naples': { lat: 40.8518, lng: 14.2681 },
      'venice': { lat: 45.4408, lng: 12.3155 },
      'florence': { lat: 43.7696, lng: 11.2558 }
    };
    
    // Check if city name contains any of our predefined cities (case insensitive)
    const cityLower = city.toLowerCase().trim();
    
    // First try exact match
    if (cityCoordinates[cityLower]) {
      return cityCoordinates[cityLower];
    }
    
    // Then try partial match
    for (const [knownCity, coords] of Object.entries(cityCoordinates)) {
      if (cityLower.includes(knownCity) || knownCity.includes(cityLower)) {
        return coords;
      }
    }
    
    // Try to extract city from string like "Vienna, Austria" or "Hotels in Vienna"
    const cityParts = cityLower.split(/[,\s]+/);
    for (const part of cityParts) {
      if (part.length > 3) { // Only check parts with meaningful length
        for (const [knownCity, coords] of Object.entries(cityCoordinates)) {
          if (part === knownCity || knownCity.includes(part) || part.includes(knownCity)) {
            return coords;
          }
        }
      }
    }
    
    // Default to Europe center if city not recognized
    console.log(`City not recognized in map center calculation: "${city}"`);
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

  // Determine appropriate zoom level based on city size or accommodation density
  const getZoomLevel = (): number => {
    // If no accommodations, use default zoom
    if (accommodations.length === 0) return 12;
    
    // For major cities use a wider view
    const majorCities = ['london', 'paris', 'berlin', 'rome', 'madrid'];
    if (majorCities.some(c => city.toLowerCase().includes(c))) {
      return 11; // Zoom out a bit for major cities
    }
    
    // For smaller cities or dense areas
    const smallerCities = ['venice', 'bruges', 'salzburg', 'oxford'];
    if (smallerCities.some(c => city.toLowerCase().includes(c))) {
      return 13; // Zoom in more for smaller cities
    }
    
    // If we have accommodations, determine zoom based on their spread
    if (accommodations.length > 5) {
      const lats = accommodations.map(a => a.latitude);
      const lngs = accommodations.map(a => a.longitude);
      
      const latSpread = Math.max(...lats) - Math.min(...lats);
      const lngSpread = Math.max(...lngs) - Math.min(...lngs);
      
      // If accommodations are spread out over a large area
      if (latSpread > 0.05 || lngSpread > 0.05) {
        return 11;
      }
      // If accommodations are in a medium area
      else if (latSpread > 0.02 || lngSpread > 0.02) {
        return 12;
      }
      // If accommodations are very close together
      else {
        return 13;
      }
    }
    
    // Default zoom level
    return 12;
  };

  // Fetch accommodations for this city and date range
  useEffect(() => {
    if (propAccommodations) {
      setAccommodations(propAccommodations);
      
      // Calculate map center if provided accommodations
      if (propAccommodations.length > 0) {
        const latTotal = propAccommodations.reduce((sum, item) => sum + item.latitude, 0);
        const lngTotal = propAccommodations.reduce((sum, item) => sum + item.longitude, 0);
        
        setMapCenter({
          lat: latTotal / propAccommodations.length,
          lng: lngTotal / propAccommodations.length
        });
      } else {
        // If no accommodations found, use the default city center
        const defaultCenter = getMapCenter();
        setMapCenter(defaultCenter);
      }
    } else {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          console.log("Fetching accommodations for city:", city, "dates:", checkInDate, "-", checkOutDate, "travelers:", travelers);
          
          // Call the accommodation service to get real or mock data
          const data = await getAccommodations({
            cityName: city,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            adults: travelers, // Use the travelers prop
            rooms: 1
          });
          console.log("Received accommodations:", data.length, "items");
          
          setAccommodations(data);
          
          // Set map center - average position of all accommodations
          if (data.length > 0) {
            const latTotal = data.reduce((sum, item) => sum + item.latitude, 0);
            const lngTotal = data.reduce((sum, item) => sum + item.longitude, 0);
            
            console.log("Setting map center to average of accommodations:", 
              { lat: latTotal / data.length, lng: lngTotal / data.length });
            
            setMapCenter({
              lat: latTotal / data.length,
              lng: lngTotal / data.length
            });
          } else {
            // If no accommodations found, use the default city center
            const defaultCenter = getMapCenter();
            console.log("No accommodations found, using default map center:", defaultCenter);
            setMapCenter(defaultCenter);
          }
        } catch (error) {
          console.error('Error fetching accommodations:', error);
          // Set default center on error
          const defaultCenter = getMapCenter();
          console.log("Error occurred, using default map center:", defaultCenter);
          setMapCenter(defaultCenter);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchData();
    }
  }, [city, checkInDate, checkOutDate, propAccommodations, travelers]);

  // Handle close button click
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // Animation variants for Framer Motion
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } }
  };

  const panelVariants = {
    hidden: { x: "100%" },
    visible: { 
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      } 
    },
    exit: { 
      x: "100%", 
      transition: { 
        duration: 0.2, 
        ease: "easeInOut" 
      } 
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-[2000] overflow-hidden"
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        {/* Backdrop with blur effect */}
        <motion.div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          variants={overlayVariants}
          onClick={handleClose}
        />

        {/* Slide-in panel */}
        <motion.div 
          className="absolute inset-y-0 right-0 max-w-full flex outline-none"
          variants={panelVariants}
        >
          <div className="relative w-screen max-w-6xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
              <div className="flex items-center">
                <button 
                  onClick={handleClose}
                  className="mr-3 p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <div>
                  <h2 className="text-xl font-semibold text-[#264653]">
                    Accommodations in {city}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {formattedCheckIn} - {formattedCheckOut} • {nights} {nights === 1 ? 'night' : 'nights'} • {travelers} {travelers === 1 ? 'traveler' : 'travelers'}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="h-[calc(100vh-64px)] flex flex-col bg-white overflow-hidden">
              {/* External search buttons */}
              <div className="p-3 bg-gray-50 border-b border-gray-200">
                <ExternalSearchButtons 
                  bookingUrl={bookingUrl} 
                  hostelworldUrl={hostelworldUrl} 
                  city={city}
                />
              </div>

              <div className="flex flex-1 overflow-hidden">
                {/* Accommodations list */}
                <div className="w-2/5 h-full overflow-y-auto" ref={containerRef}>
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
                </div>
                
                {/* Map view */}
                <div className="w-3/5 h-full relative">
                  <div className="absolute inset-0 border-l border-gray-200">
                    {!isLoading && accommodations.length > 0 && (
                      <React.Suspense fallback={<div className="h-full w-full bg-gray-100 flex items-center justify-center">Loading map...</div>}>
                        <ErrorBoundary fallback={<div className="p-4 text-red-500">Error loading map. Please try refreshing.</div>}>
                          {mapLoaded !== false && (
                            <AccommodationMap
                              accommodations={mapAccommodations}
                              center={mapCenter}
                              selectedId={selectedAccommodation}
                              initialZoom={getZoomLevel()}
                              onMarkerClick={(id) => {
                                const selected = accommodations.find(a => a.id === id);
                                if (selected) {
                                  setSelectedAccommodation(id);
                                  if (onSelectAccommodation) {
                                    onSelectAccommodation(selected);
                                  }
                                  
                                  // Scroll to the selected accommodation in the list
                                  if (containerRef.current) {
                                    const element = containerRef.current.querySelector(`[data-id="${id}"]`);
                                    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                  }
                                }
                              }}
                            />
                          )}
                        </ErrorBoundary>
                      </React.Suspense>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Error boundary for the accommodation screen
class ErrorBoundary extends React.Component<{children: React.ReactNode, fallback: React.ReactNode}> {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  componentDidCatch(error: any, info: any) {
    console.error("Error in AccommodationScreen:", error, info);
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    
    return this.props.children;
  }
} 