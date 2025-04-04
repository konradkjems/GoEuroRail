import { MapContainer, TileLayer, Marker, Popup, Polyline, ZoomControl, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { cities } from "@/lib/cities";
import { formatDate } from "@/lib/utils";
import { City, Trip, FormTrip } from "@/types";
import dynamic from "next/dynamic";
import L from "leaflet";
import { useState, useMemo, useCallback, useEffect } from "react";

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
          
          {!isInTrip && onAddToTrip && (
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

// Get circle style based on city properties
function getCircleStyle(city: City, isSelected: boolean, isInTrip: boolean) {
  // Base size determined by city importance
  const baseRadius = city.size === 'large' ? 14 : city.size === 'medium' ? 10 : 7;
  
  // Modern color palette with white borders
  const colors = {
    default: { fill: '#10B981', stroke: '#FFFFFF' },         // Regular cities: Green
    selected: { fill: '#EF4444', stroke: '#FFFFFF' },        // Selected: Red
    inTrip: { fill: '#F59E0B', stroke: '#FFFFFF' },         // In trip: Amber
    majorCity: { fill: '#6366F1', stroke: '#FFFFFF' },      // Major cities: Indigo
    transportHub: { fill: '#8B5CF6', stroke: '#FFFFFF' }     // Transport hubs: Purple
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

function MapDisplay({ selectedTrip, onCityClick, className }: InterrailMapProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  
  // Get trip city IDs to highlight them on the map
  const tripCityIds = selectedTrip?.stops.map(stop => stop.cityId) || [];

  // Filter cities to only show major ones, transport hubs, and cities in the trip
  const visibleCities = useMemo(() => {
    return cities.filter(city => 
      city.isTransportHub || 
      city.population >= 1000000 || 
      tripCityIds.includes(city.id)
    );
  }, [tripCityIds]);

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

  const handleAddToTrip = (cityId: string) => {
    window.dispatchEvent(new CustomEvent('addCityToTrip', { detail: { cityId } }));
    setSelectedCity(null);
  };

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setSearchQuery("");
    setSearchResults([]);
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
                className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:outline-none"
                onClick={() => handleCitySelect(city)}
              >
                <div>
                  <span className="font-medium">{city.name}</span>
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

      <MapContainer
        center={[48.8566, 2.3522]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        className={`${className || ""}`}
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* City markers */}
        {visibleCities.map((city) => {
          const isTripStop = tripCityIds.includes(city.id);
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
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-gray-900">{city.name}</h3>
                  <p className="text-gray-700">{city.country}</p>
                  <p className="text-sm text-gray-600">Population: {city.population.toLocaleString()}</p>
                  <div className="mt-1 space-y-1">
                    {city.isTransportHub && (
                      <p className="text-sm text-purple-600 font-medium">🚆 Major Transport Hub</p>
                    )}
                    {city.population >= 1000000 && (
                      <p className="text-sm text-indigo-600 font-medium">🌆 Major City</p>
                    )}
                    {isTripStop && (
                      <p className="text-sm text-amber-600 font-medium">📍 Part of Trip</p>
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
        
        {/* Draw trip route if a trip is selected */}
        {selectedTrip && routeCoordinates.length > 1 && (
          <Polyline
            positions={routeCoordinates}
            color="#06D6A0"
            weight={4}
            opacity={0.7}
            dashArray="10,10"
          />
        )}
      </MapContainer>
      
      {/* City Info Modal */}
      {selectedCity && (
        <CityInfoModal 
          city={selectedCity} 
          onClose={() => setSelectedCity(null)}
          onAddToTrip={() => handleAddToTrip(selectedCity.id)}
          isInTrip={tripCityIds.includes(selectedCity.id)}
        />
      )}
    </div>
  );
}

export default function InterrailMap(props: InterrailMapProps) {
  return <MapWithNoSSR {...props} />;
} 