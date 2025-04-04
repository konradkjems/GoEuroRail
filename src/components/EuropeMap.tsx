import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { cities } from "@/lib/cities";
import { City } from "@/types";
import dynamic from "next/dynamic";
import { useState, useMemo, useCallback } from "react";

const MapWithNoSSR = dynamic(() => Promise.resolve(MapDisplay), {
  ssr: false,
});

// Get circle style based on city properties
function getCircleStyle(city: City) {
  const baseRadius = city.size === 'large' ? 12 : city.size === 'medium' ? 8 : 6;
  
  const color = city.isTransportHub ? '#4361EE' : '#2B9348';

  return {
    radius: baseRadius,
    fillColor: color,
    color: color,
    weight: 2,
    opacity: 1,
    fillOpacity: 0.6
  };
}

function MapDisplay() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  // Filter cities to only show major ones and transport hubs
  const visibleCities = useMemo(() => {
    return cities.filter(city => 
      city.isTransportHub || 
      city.population >= 1000000 ||
      city.id === selectedCity?.id
    );
  }, [selectedCity]);

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
                onClick={() => {
                  setSelectedCity(city);
                  setSearchQuery("");
                  setSearchResults([]);
                }}
              >
                <span className="font-medium">{city.name}</span>
                <span className="text-sm text-gray-600 ml-2">{city.country}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <MapContainer
        center={[48.8566, 2.3522]}
        zoom={4}
        style={{ height: "400px", width: "100%" }}
        className="rounded-lg shadow-lg z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {visibleCities.map((city) => (
          <CircleMarker
            key={city.id}
            center={[city.coordinates.lat, city.coordinates.lng]}
            {...getCircleStyle(city)}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-gray-900">{city.name}</h3>
                <p className="text-gray-700">{city.country}</p>
                <p className="text-sm text-gray-600">Population: {city.population.toLocaleString()}</p>
                {city.isTransportHub && (
                  <p className="text-sm text-blue-600">Major Transport Hub</p>
                )}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

export default function EuropeMap() {
  return <MapWithNoSSR />;
} 