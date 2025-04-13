import { MapContainer, TileLayer, Marker, Popup, Polyline, ZoomControl, CircleMarker, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { cities } from "@/lib/cities";
import { formatDate } from "@/lib/utils";
import { City, Trip, FormTrip } from "@/types";
import dynamic from "next/dynamic";
import L from "leaflet";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { railConnections, getRailSpeedColor, getRailSpeedDash, getConnectionsForTrip, RailSpeed } from "@/lib/railConnections";

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

interface MapControllerProps {
  trip: FormTrip | null;
}

// Add MapController component to handle map bounds
function MapController({ trip }: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (trip && trip.stops && trip.stops.length > 0) {
      const bounds = L.latLngBounds(
        trip.stops.map(stop => {
          const city = cities.find(c => c.id === stop.cityId);
          return city ? [city.coordinates.lat, city.coordinates.lng] : [0, 0];
        })
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, trip]);

  return null;
}

const MapWithNoSSR = dynamic(() => Promise.resolve(MapDisplay), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

interface InterrailMapProps {
  selectedTrip?: FormTrip | null;
  onCityClick?: (cityId: string) => void;
  className?: string;
}

// Add city info modal component
interface CityInfoModalProps {
  city: City | null;
  onClose: () => void;
  onAddToTrip?: () => void;
  isInTrip?: boolean;
}

const CityInfoModal: React.FC<CityInfoModalProps> = ({ city, onClose, onAddToTrip, isInTrip }) => {
  if (!city) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#264653]">{city.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-[#264653]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#06D6A0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{city.country}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-[#264653]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#06D6A0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>Population: {city.population.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-[#264653]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#06D6A0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Region: {city.region}</span>
          </div>
          
          {city.isTransportHub && (
            <div className="p-2 bg-[#06D6A0]/10 rounded-lg">
              <div className="flex items-center text-[#264653]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#06D6A0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="font-medium">Major Transport Hub</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                This city is a major transport hub with excellent train connections across Europe.
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-between">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
            Close
          </button>
          
          {!isInTrip && (
            <button 
              onClick={onAddToTrip}
              className="px-4 py-2 bg-[#06D6A0] text-white rounded hover:bg-[#05C090]"
            >
              Add to Trip
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Add CSS for pulsing animation to the top of the file
const pulsingCSS = `
  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.2); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
  }
  .pulse-marker {
    animation: pulse 2s infinite;
  }
`;

// Define props interface for RailNetworkLayer
interface RailNetworkLayerProps {
  showAllConnections: boolean;
  tripCityIds: string[];
}

// Helper function to format rail speed for tooltip
const formatRailSpeed = (speed: RailSpeed): string => {
  switch (speed) {
    case 'high-speed':
      return 'High-Speed Rail (310-320 km/h)';
    case 'very-fast':
      return 'Very Fast Rail (270-300 km/h)';
    case 'fast':
      return 'Fast Rail (240-260 km/h)';
    case 'medium':
      return 'Medium-Speed Rail (200-230 km/h)';
    case 'under-construction':
      return 'Under Construction';
    case 'normal':
    default:
      return 'Regular Rail (< 200 km/h)';
  }
};

// Add a Rail Network Layer to display the railway connections
function RailNetworkLayer({ showAllConnections = false, tripCityIds = [] }: RailNetworkLayerProps) {
  // Connections to render on the map
  const connections = showAllConnections 
    ? railConnections 
    : getConnectionsForTrip(tripCityIds);
  
  // Get coordinates for a city by its ID
  const getCoordinatesById = (cityId: string): [number, number] | null => {
    const city = cities.find(c => c.id === cityId);
    return city ? [city.coordinates.lat, city.coordinates.lng] : null;
  };

  // Get city names for tooltip
  const getCityNames = (fromCityId: string, toCityId: string): string => {
    const fromCity = cities.find(c => c.id === fromCityId);
    const toCity = cities.find(c => c.id === toCityId);
    return `${fromCity?.name} ↔ ${toCity?.name}`;
  };
  
  return (
    <>
      {connections.map((connection, index) => {
        const fromCoords = getCoordinatesById(connection.fromCityId);
        const toCoords = getCoordinatesById(connection.toCityId);
        
        if (!fromCoords || !toCoords) return null;
        
        return (
          <Polyline
            key={`${connection.fromCityId}-${connection.toCityId}-${index}`}
            positions={[fromCoords, toCoords]}
            pathOptions={{
              color: getRailSpeedColor(connection.speed),
              weight: 3,
              dashArray: getRailSpeedDash(connection.speed) || undefined,
              opacity: 0.8
            }}
          >
            <Tooltip sticky>
              <div className="text-sm font-medium">
                <div>{getCityNames(connection.fromCityId, connection.toCityId)}</div>
                <div className="text-xs mt-1 text-gray-600">{formatRailSpeed(connection.speed)}</div>
              </div>
            </Tooltip>
          </Polyline>
        );
      })}
    </>
  );
}

function MapDisplay({ selectedTrip, onCityClick, className }: InterrailMapProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [zoomLevel, setZoomLevel] = useState(5);
  const mapRef = useRef<L.Map | null>(null);
  
  // Get trip city IDs to highlight them on the map
  const tripCityIds = selectedTrip?.stops.map(stop => stop.cityId) || [];

  // Whether to show all rail connections or only the trip's
  const [showAllRailConnections, setShowAllRailConnections] = useState(true);

  // Get all cities connected by rail
  const connectedCityIds = useMemo(() => {
    if (!showAllRailConnections) return [];
    
    const cityIds = new Set<string>();
    railConnections.forEach(conn => {
      cityIds.add(conn.fromCityId);
      cityIds.add(conn.toCityId);
    });
    return Array.from(cityIds);
  }, [showAllRailConnections]);

  // Filter cities based on zoom level and importance
  const visibleCities = useMemo(() => {
    return cities.filter(city => {
      // Exclude cities from Russia, Belarus, and Ukraine
      if (['Russian Federation', 'Belarus', 'Ukraine'].includes(city.country)) return false;

      // Always show cities in the trip
      if (tripCityIds.includes(city.id)) return true;

      // Always show Nice and Monaco
      if (city.id === 'nice' || city.id === 'monaco') return true;

      // Show all cities when zoomed in close (zoom level >= 8)
      if (zoomLevel >= 8) {
        return city.population >= 5000;
      }

      // Show more cities when moderately zoomed (zoom level >= 6)
      if (zoomLevel >= 6) {
        return city.isTransportHub || city.population >= 15000;
      }

      // Show medium and major cities when slightly zoomed out (zoom level >= 5)
      if (zoomLevel >= 5) {
        return city.isTransportHub || city.population >= 100000;
      }

      // Show only major cities and transport hubs when fully zoomed out
      return (city.isTransportHub && city.population >= 200000) || city.population >= 500000;
    });
  }, [tripCityIds, zoomLevel]);

  // Add zoom event listener
  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      const handleZoom = () => {
        setZoomLevel(map.getZoom());
      };
      
      map.on('zoomend', handleZoom);
      return () => {
        map.off('zoomend', handleZoom);
      };
    }
  }, []);

  // Get circle style based on city properties and zoom level
  function getCircleStyle(city: City, isSelected: boolean, isInTrip: boolean) {
    // Base size determined by city importance and zoom level
    let baseRadius;
    
    if (city.population >= 2000000) {
      baseRadius = Math.max(8, 14 * (zoomLevel / 5)); // Scale with zoom for major cities
    } else if (city.isTransportHub) {
      baseRadius = Math.max(6, 12 * (zoomLevel / 5)); // Scale with zoom for transport hubs
    } else if (city.population >= 1000000) {
      baseRadius = Math.max(4, 8 * (zoomLevel / 5)); // Scale with zoom for large cities
    } else if (city.population >= 100000) {
      baseRadius = Math.max(2, 4 * (zoomLevel / 5)); // Scale with zoom for smaller cities
    } else {
      baseRadius = Math.max(1, 3 * (zoomLevel / 5)); // Scale with zoom for very small cities
    }
    
    // Modern color palette with white borders
    const colors = {
      default: { fill: '#10B981', stroke: '#FFFFFF' },         // Regular cities: Green
      selected: { fill: '#EF4444', stroke: '#FFFFFF' },        // Selected: Red
      inTrip: { fill: '#F59E0B', stroke: '#FFFFFF' },          // In trip: Amber
      majorCity: { fill: '#6366F1', stroke: '#FFFFFF' },       // Major cities: Indigo
      transportHub: { fill: '#8B5CF6', stroke: '#FFFFFF' },    // Transport hubs: Purple
      smallCity: { fill: '#94A3B8', stroke: '#FFFFFF' }        // Small cities: Grey
    };

    let style = colors.default;
    if (isSelected) {
      style = colors.selected;
    } else if (isInTrip) {
      style = colors.inTrip;
    } else if (city.isTransportHub) {
      style = colors.transportHub;
    } else if (city.population >= 2000000) {
      style = colors.majorCity;
    } else if (city.population >= 100000) {
      style = colors.smallCity;
    }

    return {
      radius: baseRadius,
      fillColor: style.fill,
      color: style.stroke,
      weight: 2,
      opacity: 1,
      fillOpacity: 0.9,
      className: isSelected ? 'pulse-marker' : ''
    };
  }

  // Search functionality
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    const results = cities
      .filter(city => 
        city.name.toLowerCase().includes(query.toLowerCase()) ||
        city.country.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 10); // Limit to 10 results
    setSearchResults(results);
  }, []);

  // Get trip route coordinates if a trip is selected
  const routeCoordinates = selectedTrip?.stops.map(stop => {
    const city = cities.find(c => c.id === stop.cityId);
    return city ? [
      city.coordinates.lat,
      city.coordinates.lng,
    ] as [number, number] : null;
  }).filter((coord): coord is [number, number] => coord !== null) || [];

  const handleMarkerClick = (cityId: string) => {
    if (onCityClick) {
      onCityClick(cityId);
    }
  };

  const handleCitySelect = (city: City) => {
    // Close the search UI
    setSearchQuery("");
    setSearchResults([]);
    
    // Show the city info modal
    setSelectedCity(city);
  };

  const handleAddToTrip = (cityId: string) => {
    if (onCityClick) {
      onCityClick(cityId);
      setSelectedCity(null);
    }
  };

  // Add style tag for pulsing animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = pulsingCSS;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const toggleRailConnections = useCallback(() => {
    setShowAllRailConnections(prev => !prev);
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Search input */}
      <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-2 w-64">
        <input
          type="text"
          placeholder="Search for a city..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map(city => (
              <button
                key={city.id}
                className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:outline-none text-gray-900"
                onClick={() => handleCitySelect(city)}
              >
                <div>
                  <span className="font-medium text-gray-900">{city.name}</span>
                  <span className="text-sm text-gray-600 ml-2">{city.country}</span>
                </div>
                <div className="text-xs space-x-2">
                  {city.isTransportHub && (
                    <span className="text-purple-600">🚆 Transport Hub</span>
                  )}
                  {city.population >= 1000000 && (
                    <span className="text-indigo-600">🌆 Major City</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Toggle rail connections - repositioned for better visibility */}
      <div className="absolute bottom-52 left-4 z-[1100] bg-white rounded-lg shadow-lg p-3">
        <button
          onClick={toggleRailConnections}
          className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none font-medium"
        >
          {showAllRailConnections ? "Show Trip Lines Only" : "Show All Rail Lines"}
        </button>
      </div>

      {/* Legend for rail speeds */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-3">
        <h3 className="text-sm font-semibold mb-2">High-speed railways</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center">
            <span className="block w-6 h-1 bg-[#8B5CF6] mr-2"></span>
            <span>310-320 km/h</span>
          </div>
          <div className="flex items-center">
            <span className="block w-6 h-1 bg-[#EF4444] mr-2"></span>
            <span>270-300 km/h</span>
          </div>
          <div className="flex items-center">
            <span className="block w-6 h-1 bg-[#F97316] mr-2"></span>
            <span>240-260 km/h</span>
          </div>
          <div className="flex items-center">
            <span className="block w-6 h-1 bg-[#FACC15] mr-2"></span>
            <span>200-230 km/h</span>
          </div>
          <div className="flex items-center">
            <span className="block w-6 h-1 bg-[#10B981] mr-2 border-b border-dashed"></span>
            <span>Under construction</span>
          </div>
          <div className="flex items-center">
            <span className="block w-6 h-1 bg-[#9CA3AF] mr-2"></span>
            <span>Other railways (&lt; 200 km/h)</span>
          </div>
        </div>
      </div>

      <MapContainer
        center={[50.1109, 8.6821]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        className={`${className || ""}`}
        zoomControl={false}
        ref={mapRef}
      >
        <MapController trip={selectedTrip || null} />
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://api.mapbox.com/styles/v1/omars/clgar7r6s000401pjx0hrkkeg/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoib21hcnMiLCJhIjoiOHdPYlhXZyJ9.PMJC2MhO3GBmahrSfZr8eA"
        />
        
        {/* Add the rail network layer */}
        <RailNetworkLayer 
          showAllConnections={showAllRailConnections} 
          tripCityIds={tripCityIds} 
        />
        
        {/* Draw trip route if a trip is selected */}
        {selectedTrip && routeCoordinates.length > 1 && (
          <Polyline
            positions={routeCoordinates}
            pathOptions={{
              color: '#3B82F6',
              weight: 4,
              opacity: 0.8
            }}
          />
        )}

        {/* Trip stop markers with numbers */}
        {selectedTrip?.stops.map((stop, index) => {
          const city = cities.find(c => c.id === stop.cityId);
          if (!city) return null;

          return (
            <Marker
              key={`${stop.cityId}-${index}`}
              position={[city.coordinates.lat, city.coordinates.lng]}
              icon={createStopIcon(index + 1)}
              eventHandlers={{
                click: () => onCityClick?.(stop.cityId)
              }}
            >
              <Tooltip permanent direction="top" offset={[0, -20]}>
                <span className="font-semibold">{city.name}</span>
              </Tooltip>
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-gray-900">{city.name}</h3>
                  <p className="text-gray-700">{city.country}</p>
                  <p className="text-sm text-gray-600 mt-1">Stop {index + 1} of {selectedTrip.stops.length}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(stop.arrivalDate).toLocaleDateString()} - {new Date(stop.departureDate).toLocaleDateString()}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
        
        {/* Other city markers */}
        {visibleCities.map((city) => {
          const isTripStop = tripCityIds.includes(city.id);
          if (isTripStop) return null; // Skip cities that are trip stops

          const isSelected = selectedTrip && selectedTrip.stops.length > 0 
            ? selectedTrip.stops[0]?.cityId === city.id
            : false;
          
          return (
            <CircleMarker
              key={city.id}
              center={[city.coordinates.lat, city.coordinates.lng]}
              {...getCircleStyle(city, isSelected, isTripStop)}
              eventHandlers={{
                click: () => handleMarkerClick(city.id)
              }}
            >
              <Tooltip>{city.name}</Tooltip>
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-gray-900">{city.name}</h3>
                  <p className="text-gray-700">{city.country}</p>
                  <p className="text-sm text-gray-600">Population: {city.population.toLocaleString()}</p>
                  <div className="mt-1 space-y-1">
                    {city.isTransportHub && (
                      <p className="text-sm text-purple-600 font-medium">🚆 Major Transport Hub</p>
                    )}
                    {city.population >= 2000000 && (
                      <p className="text-sm text-indigo-600 font-medium">🌆 Major City</p>
                    )}
                  </div>
                  {selectedTrip && !isTripStop && (
                    <button 
                      className="mt-2 px-3 py-1.5 bg-[#10B981] text-white text-sm rounded-md hover:bg-[#059669] transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToTrip(city.id);
                      }}
                    >
                      ➕ Add to Trip
                    </button>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
      
      {/* City Info Modal */}
      {selectedCity && (
        <CityInfoModal 
          city={selectedCity} 
          onClose={() => setSelectedCity(null)}
          onAddToTrip={() => {
            if (onCityClick) {
              onCityClick(selectedCity.id);
              setSelectedCity(null);
            }
          }}
          isInTrip={selectedTrip ? tripCityIds.includes(selectedCity.id) : false}
        />
      )}
    </div>
  );
}

export default function InterrailMap(props: InterrailMapProps) {
  return <MapWithNoSSR {...props} />;
} 