'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@changey/react-leaflet-markercluster/dist/styles.css';
import RailLegend from './RailLegend';

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

interface City {
  _id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  region: string;
  station_codes: string[];
  population: number;
}

interface MapProps {
  onCitySelect?: (city: City) => void;
  selectedCity?: City | null;
}

const InteractiveMap: React.FC<MapProps> = ({ onCitySelect, selectedCity }) => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    country: '',
    region: '',
    minPopulation: 0
  });
  const [isLegendOpen, setIsLegendOpen] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          ...filters,
          minPopulation: filters.minPopulation.toString(),
          limit: '1000' // Increase limit to show more cities
        });
        
        console.log('Fetching cities with params:', queryParams.toString());
        const response = await fetch(`/api/cities?${queryParams}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch cities');
        }
        
        const data = await response.json();
        console.log('Received cities data:', {
          total: data.cities.length,
          sample: data.cities[0],
          pagination: data.pagination
        });
        
        if (!data.cities || !Array.isArray(data.cities)) {
          throw new Error('Invalid cities data received');
        }
        
        // Filter out cities without valid coordinates
        const validCities = data.cities.filter((city: City) => 
          typeof city.latitude === 'number' && 
          typeof city.longitude === 'number' &&
          !isNaN(city.latitude) && 
          !isNaN(city.longitude)
        );
        
        console.log(`Filtered ${data.cities.length - validCities.length} cities with invalid coordinates`);
        setCities(validCities);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load cities';
        setError(errorMessage);
        console.error('Error fetching cities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [filters]);

  const handleMarkerClick = (city: City) => {
    if (onCitySelect) {
      onCitySelect(city);
    }
  };

  // Custom marker icon for selected city
  const selectedIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: iconShadow.src,
    shadowSize: [41, 41]
  });

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (loading) {
    return <div className="flex items-center justify-center h-[600px]">Loading map...</div>;
  }

  return (
    <div className="relative w-full h-[600px]">
      {/* Filter controls */}
      <div className="absolute top-4 right-4 z-[1000] bg-white p-4 rounded shadow-lg">
        <select
          value={filters.region}
          onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
          className="block w-full mb-2 p-2 border rounded"
        >
          <option value="">All Regions</option>
          <option value="Western Europe">Western Europe</option>
          <option value="Eastern Europe">Eastern Europe</option>
          <option value="Northern Europe">Northern Europe</option>
          <option value="Southern Europe">Southern Europe</option>
          <option value="Central Europe">Central Europe</option>
        </select>

        <input
          type="number"
          value={filters.minPopulation}
          onChange={(e) => setFilters(prev => ({ ...prev, minPopulation: parseInt(e.target.value) || 0 }))}
          placeholder="Min Population"
          min="0"
          step="10000"
          className="block w-full p-2 border rounded"
        />
        
        <div className="text-xs text-gray-500 mt-1">
          Showing {cities.length} cities
          {error && <div className="text-red-500 mt-1">{error}</div>}
        </div>
      </div>

      <MapContainer
        center={[51.505, 10]} // Center of Europe
        zoom={5}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MarkerClusterGroup>
          {cities.map((city) => (
            <Marker
              key={city._id}
              position={[city.latitude, city.longitude]}
              icon={selectedCity?._id === city._id ? selectedIcon : DefaultIcon}
              eventHandlers={{
                click: () => handleMarkerClick(city)
              }}
            >
              <Popup>
                <div className="text-sm">
                  <h3 className="font-bold">{city.name}</h3>
                  <p>{city.country}</p>
                  <p className="text-gray-600">Population: {city.population.toLocaleString()}</p>
                  {city.station_codes?.length > 0 && (
                    <p className="text-xs mt-1">
                      Station codes: {city.station_codes.join(', ')}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
      
      {/* Rail Legend Component as direct DOM overlay */}
      <div className="absolute top-4 left-4 z-[9999]">
        <RailLegend isOpen={isLegendOpen} onToggle={() => setIsLegendOpen(!isLegendOpen)} />
      </div>
    </div>
  );
};

export default InteractiveMap; 