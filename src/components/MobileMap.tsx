'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, ZoomControl, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cities } from '@/lib/cities';
import { FormTrip, FormTripStop, City } from '@/types';
import { TrainConnection } from '@/lib/api/trainSchedule';
import TrainSchedule from '@/components/TrainSchedule';
import { 
  ChevronLeftIcon,
  PlusIcon,
  MinusIcon,
  PencilIcon,
  InformationCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';
import { getRailSpeedColor, getRailSpeedDash, getConnectionsForTrip, RailConnection } from '@/lib/railConnections';
import { formatDate } from '@/lib/utils';

// Fix for default marker icons with webpack
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Create a custom marker icon for trip stops
const createStopIcon = (number: number) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="background-color: #3B82F6; color: white; width: 30px; height: 30px; 
                  border-radius: 50%; display: flex; align-items: center; justify-content: center; 
                  font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
        ${number}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

const MapboxMap = dynamic(() => import('@/components/MapboxMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 flex items-center justify-center">Loading map...</div>
});

interface MobileMapProps {
  stops: FormTripStop[];
  onStopClick: (cityId: string) => void;
  onShowTrainSchedule: (data: { fromCityId: string; toCityId: string; date: string }) => void;
  onShowCityInfo: (cityId: string) => void;
  className?: string;
}

// This component will handle map interactions after the map is ready
function MapController({ trip }: { trip: FormTrip }) {
  const map = useMap();
  const hasSetInitialBounds = useRef(false);

  useEffect(() => {
    if (trip.stops.length > 0 && !hasSetInitialBounds.current) {
      const bounds = L.latLngBounds(
        trip.stops.map(stop => {
          const city = cities.find(c => c.id === stop.cityId);
          return city ? [city.coordinates.lat, city.coordinates.lng] : [0, 0];
        })
      );
      
      // Add padding to the bounds to ensure we can see the full context
      const padding: [number, number] = window.innerWidth >= 768 ? [100, 100] : [50, 50];
      map.fitBounds(bounds, { padding });
      
      // If there's only one stop, set a default zoom level
      if (trip.stops.length === 1) {
        map.setZoom(5);
      }
      
      hasSetInitialBounds.current = true;
    }
  }, [map, trip.stops]);

  return null;
}

// Get circle style based on city properties
function getCircleStyle(city: City, isSelected: boolean, isInTrip: boolean, isConnected = false) {
  let baseRadius = city.size === 'large' ? 14 : city.size === 'medium' ? 10 : 7;
  
  const colors = {
    default: { fill: '#10B981', stroke: '#FFFFFF' },
    selected: { fill: '#EF4444', stroke: '#FFFFFF' },
    inTrip: { fill: '#F59E0B', stroke: '#FFFFFF' },
    majorCity: { fill: '#6366F1', stroke: '#FFFFFF' },
    transportHub: { fill: '#8B5CF6', stroke: '#FFFFFF' },
    connectedCity: { fill: '#94A3B8', stroke: '#FFFFFF' }
  };

  let style = colors.default;
  if (isSelected) {
    style = colors.selected;
  } else if (isInTrip) {
    style = colors.inTrip;
  } else if (city.isTransportHub) {
    style = colors.transportHub;
  } else if (city.population >= 1000000) {
    style = colors.majorCity;
  } else if (isConnected) {
    style = colors.connectedCity;
  }

  return {
    radius: baseRadius,
    fillColor: style.fill,
    color: style.stroke,
    weight: 2,
    opacity: 1,
    fillOpacity: 0.8
  };
}

export default function MobileMap({ 
  stops, 
  onStopClick,
  onShowTrainSchedule,
  onShowCityInfo,
  className
}: MobileMapProps) {
  const [localStops, setLocalStops] = useState<FormTripStop[]>(stops);
  const [showTrainSchedule, setShowTrainSchedule] = useState(false);
  const [trainScheduleData, setTrainScheduleData] = useState<{
    fromCityId: string;
    toCityId: string;
    date: string;
  } | null>(null);
  
  // Update local stops when prop changes
  useEffect(() => {
    setLocalStops(stops);
  }, [stops]);

  // Handle train schedule show/hide
  useEffect(() => {
    if (onShowTrainSchedule) {
      const handleTrainScheduleShow = (data: { fromCityId: string; toCityId: string; date: string }) => {
        onShowTrainSchedule(data);
      };
      (window as any).handleShowTrainSchedule = handleTrainScheduleShow;
    }
  }, [onShowTrainSchedule]);

  const handleLocalNightsUpdate = (stopId: string, nights: number) => {
    // Update local state first for immediate feedback
    setLocalStops(prevStops => {
      return prevStops.map(stop => {
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
    });

    // Then trigger the parent update
    onStopClick(stopId);
  };

  const getRouteCoordinates = () => {
    return localStops
      .map(stop => {
        const city = cities.find(c => c.id === stop.cityId);
        return city ? [city.coordinates.lat, city.coordinates.lng] : null;
      })
      .filter(Boolean) as [number, number][];
  };

  const calculateTotalNights = () => {
    return localStops.reduce((total, stop) => {
      const arrival = new Date(stop.arrivalDate);
      const departure = new Date(stop.departureDate);
      const nights = Math.ceil((departure.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24));
      return total + nights;
    }, 0);
  };

  const totalNights = calculateTotalNights();
  const plannedNights = totalNights;
  const totalCost = 0; // This will need to be calculated based on your requirements

  // Get initial map center - prioritize stops, otherwise center on Frankfurt (central Europe)
  const initialCenter = localStops.length > 0
    ? (() => {
        const firstCity = cities.find(c => c.id === localStops[0].cityId);
        return firstCity 
          ? [firstCity.coordinates.lat, firstCity.coordinates.lng]
          : [50.1109, 8.6821]; // Frankfurt coordinates as central Europe default
      })()
    : [50.1109, 8.6821];

  // Get rail connections for the trip
  const tripConnections = getConnectionsForTrip(localStops.map(stop => stop.cityId));

  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  // Update scroll position when the container is scrolled
  const handleScroll = () => {
    if (scrollRef.current) {
      setScrollPosition(scrollRef.current.scrollTop);
    }
  };

  // Restore scroll position after any updates
  useEffect(() => {
    if (scrollRef.current && scrollPosition > 0) {
      scrollRef.current.scrollTop = scrollPosition;
    }
  }, [localStops, scrollPosition]);

  const handleTrainSelect = (train: TrainConnection) => {
    setShowTrainSchedule(false);
    setTrainScheduleData(null);
  };

  const firstCity = cities.find(c => c.id === stops[0]?.cityId);
  const lastStop = stops[stops.length - 1];

  return (
    <div className="md:hidden h-screen flex flex-col relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-white/80 backdrop-blur-sm p-4 flex items-center">
        <button onClick={() => onStopClick(stops[0].cityId)} className="p-2">
          <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
        </button>
        <div className="ml-2">
          <h1 className="text-lg font-semibold text-gray-900">{firstCity?.name || 'Trip'}</h1>
          <p className="text-sm text-gray-600">
            {new Date(stops[0]?.arrivalDate).toLocaleDateString()} - {new Date(lastStop?.departureDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Map Section */}
      <div className="absolute inset-0 z-0">
        <MapboxMap
          trip={{
            _id: 'mobile-trip',
            name: firstCity?.name || 'Trip',
            startDate: stops[0]?.arrivalDate || new Date().toISOString(),
            endDate: lastStop?.departureDate || new Date().toISOString(),
            stops: stops,
            budget: totalCost
          }}
          selectedStop={stops[0] || null}
          onStopSelect={(stop) => onStopClick(stop.cityId)}
          onShowTrainSchedule={onShowTrainSchedule}
          onTrainSelect={handleTrainSelect}
          className={className}
        />
      </div>

      {/* Trip Details Card */}
      <div className={`
        fixed bottom-0 left-0 right-0 z-10 
        bg-white rounded-t-3xl shadow-lg 
        transition-transform duration-300 ease-in-out
        ${isExpanded ? 'h-[75vh]' : 'h-auto'}
      `}>
        <div 
          className="p-4 flex items-center justify-between cursor-pointer border-b"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
                <div 
                  className="absolute inset-0 rounded-full border-4 border-emerald-500"
                  style={{
                    clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)`,
                    transform: 'rotate(-90deg)',
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium">{plannedNights}/16</span>
                </div>
              </div>
              <div className="ml-2">
                <p className="text-sm text-gray-600">Nights planned</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total: €{totalCost.toLocaleString()}</p>
            </div>
          </div>
          <ChevronLeftIcon 
            className={`h-5 w-5 text-gray-500 transform transition-transform duration-300 ${
              isExpanded ? '-rotate-90' : 'rotate-90'
            }`}
          />
        </div>
        
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? 'h-[calc(75vh-4rem)]' : 'h-0'
          }`}
        >
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="p-4 space-y-4 overflow-y-auto h-full"
          >
            {/* Stops List */}
            {stops.map((stop, index) => {
              const city = cities.find(c => c.id === stop.cityId);
              if (!city) return null;

              const arrival = new Date(stop.arrivalDate);
              const departure = new Date(stop.departureDate);
              const nights = Math.ceil((departure.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24));

              // Calculate distance to next stop (if any)
              const nextStop = stops[index + 1];
              let distance = null;
              if (nextStop) {
                const nextCity = cities.find(c => c.id === nextStop.cityId);
                if (nextCity) {
                  const connection = tripConnections.find(
                    conn => 
                      (conn.fromCityId === stop.cityId && conn.toCityId === nextStop.cityId) ||
                      (conn.toCityId === stop.cityId && conn.fromCityId === nextStop.cityId)
                  );
                  distance = connection?.distance;
                }
              }

              return (
                <div 
                  key={stop.cityId}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                >
                  <div 
                    className={`relative bg-white rounded-lg shadow-md border ${
                      stops.find(s => s.cityId === stop.cityId)
                        ? 'border-[#06D6A0] ring-2 ring-[#06D6A0]/20'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onStopClick(stop.cityId);
                    }}
                  >
                    {/* Stop number indicator */}
                    <div className="absolute -left-2 -top-2 w-6 h-6 bg-[#06D6A0] rounded-full flex items-center justify-center text-white text-sm font-medium shadow-sm">
                      {index + 1}
                    </div>

                    <div className="p-4">
                      {/* City name and nights section */}
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="text-base font-semibold text-[#264653]">{city.name}</h3>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onShowCityInfo(stop.cityId);
                              }}
                              className="ml-2 text-[#264653] hover:text-[#06D6A0] p-1 rounded-full hover:bg-gray-50"
                              title="City information"
                            >
                              <InformationCircleIcon className="h-5 w-5" />
                            </button>
                            <span className="mx-2 text-gray-400">•</span>
                            <span className={`text-sm ${stop.isStopover ? 'text-[#FFD166]' : 'text-[#06D6A0]'}`}>
                              {stop.isStopover ? 'Stopover' : `${nights} ${nights === 1 ? 'night' : 'nights'}`}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">{city.country}</p>
                        </div>
                        
                        {/* Nights adjustment buttons */}
                        <div 
                          className="flex items-center space-x-1 ml-4" 
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                          }}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              if (nights > 1) {
                                handleLocalNightsUpdate(stop.cityId, nights - 1);
                              }
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                          >
                            <MinusIcon className="h-4 w-4 text-gray-500" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleLocalNightsUpdate(stop.cityId, nights + 1);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                          >
                            <PlusIcon className="h-4 w-4 text-gray-500" />
                          </button>
                        </div>
                      </div>

                      {/* Dates section */}
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span>{arrival.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        <span className="mx-2">→</span>
                        <span>{departure.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                      </div>

                      {/* Notes section */}
                      <div className="mt-2 flex justify-between items-center">
                        {stop.notes ? (
                          <div className="p-2 bg-gray-50 rounded text-xs text-gray-600 w-full">
                            {stop.notes}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-400 italic">No notes added</div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Implement notes editing
                          }}
                          className="ml-2 text-[#2A9D8F] hover:text-[#05C090] p-1 rounded-full flex-shrink-0"
                          title="Edit notes"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Bottom section with transport hub and distance */}
                      <div className="mt-2 flex items-center justify-between">
                        {city.isTransportHub && (
                          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#06D6A0]/10 text-[#06D6A0]">
                            Major Transport Hub
                          </div>
                        )}
                        {distance && (
                          <div className="flex items-center text-sm text-[#06D6A0]">
                            <span className="mr-1">+</span>
                            <span>{distance} km</span>
                          </div>
                        )}
                      </div>

                      {/* Train connection section */}
                      {nextStop && (() => {
                        const nextCity = cities.find(c => c.id === nextStop.cityId);
                        return (
                          <div 
                            className="mt-2 flex items-center bg-[#FFD166]/30 p-3 rounded cursor-pointer hover:bg-[#FFD166]/40"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              if (nextStop) {
                                onShowTrainSchedule({
                                  fromCityId: stop.cityId,
                                  toCityId: nextStop.cityId,
                                  date: formatDate(departure)
                                });
                              }
                            }}
                          >
                            <ArrowPathIcon className="h-6 w-6 text-[#FFD166] mr-3" />
                            <div className="flex-1">
                              {stop.trainDetails ? (
                                <>
                                  <div className="font-medium text-[#264653]">{stop.trainDetails.duration}</div>
                                  <div className="text-sm text-[#264653]">
                                    {stop.trainDetails.trainNumber} • {stop.trainDetails.changes === 0 ? 'Direct' : `${stop.trainDetails.changes} changes`}
                                    {stop.trainDetails.price && ` • ${stop.trainDetails.price.amount} ${stop.trainDetails.price.currency}`}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="font-medium text-[#264653] flex items-center">
                                    Select train connection
                                    <span className="ml-1 text-xs bg-[#FFD166] text-white px-2 py-0.5 rounded-full">Click to choose</span>
                                  </div>
                                  <div className="text-sm text-[#264653]">
                                    {city.name} → {nextCity?.name}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Prevent click propagation on the expanded section */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-0"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(false);
          }}
        />
      )}

      {/* Train Schedule Modal */}
      {showTrainSchedule && trainScheduleData && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 w-full max-w-md max-h-[80vh] overflow-y-auto">
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
          </div>
        </div>
      )}
    </div>
  );
} 