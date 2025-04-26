'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { cities } from '@/lib/cities';
import { FormTrip, FormTripStop } from '@/types';
import { getRailSpeedColor, getRailSpeedDash, getConnectionsForTrip, railConnections } from '@/lib/railConnections';
import { Feature, Geometry, GeoJsonProperties, Point } from 'geojson';
import RailLegend from './RailLegend';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// Set your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

// Check if token is missing
if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
  console.error('Mapbox token is missing. Please set NEXT_PUBLIC_MAPBOX_TOKEN in your environment variables.');
}

// Popular Interrail destinations
const popularInterrailCities = [
  'amsterdam', 'barcelona', 'berlin', 'budapest', 'copenhagen', 
  'florence', 'lisbon', 'london', 'madrid', 'milan', 'munich', 
  'nice', 'paris', 'prague', 'rome', 'vienna', 'venice',
  'salzburg', 'brussels', 'lyon', 'marseille', 'krakow', 'porto',
  'geneva', 'ljubljana', 'dubrovnik', 'split', 'athens',
  'stockholm', 'oslo', 'helsinki', 'tallinn', 'riga', 'gdansk', 'málaga', 'valencia', 'mostar', 'gdansk', 'poznan', 'krakow', 'Frankfurt am Main', 'seville', 'faro', 'almeria', 'brest', 'brighton', 
  
  // Additional European capitals
  'dublin', 'luxembourg', 'bern', 'andorra-la-vella', 'valletta', 'nicosia',
  'sofia', 'bucharest', 'belgrade', 'bratislava', 'skopje', 'tirana',
  'podgorica', 'chisinau', 'san-marino', 'vatican-city', 'vaduz',
  'sarajevo', 'pristina', 'monaco', 'zagreb',
  
  // Additional major European cities
  'frankfurt', 'hamburg', 'cologne', 'seville', 'bologna', 'naples', 
  'granada', 'bordeaux', 'palermo', 'turin', 'strasbourg', 'antwerp',
  'gdansk', 'bilbao', 'thessaloniki', 'stuttgart', 'nuremberg', 'dresden',
  'gothenburg', 'aarhus', 'bergen', 'malmo', 'eindhoven', 'rotterdam', 'utrecht',
  'lille', 'montpellier', 'toulouse', 'genoa', 'basel', 'verona', 'wroclaw', 'zürich',
];

interface MapboxMapProps {
  trip: FormTrip;
  selectedStop: FormTripStop | null;
  onStopSelect: (stop: FormTripStop) => void;
  onShowTrainSchedule?: (data: { fromCityId: string; toCityId: string; date: string }) => void;
  onTrainSelect?: (train: any) => void;
  className?: string;
}

export default function MapboxMap({ 
  trip, 
  selectedStop, 
  onStopSelect,
  onShowTrainSchedule,
  onTrainSelect,
  className 
}: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [lng] = useState(8.6821); // Frankfurt longitude
  const [lat] = useState(50.1109); // Frankfurt latitude
  const [zoom] = useState(5);
  const [isLegendOpen, setIsLegendOpen] = useState(true);
  const [showRailNetwork, setShowRailNetwork] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof cities>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Handle toggle rail network
  const handleToggleRailNetwork = () => {
    setShowRailNetwork(!showRailNetwork);
    
    if (map.current) {
      const visibility = !showRailNetwork ? 'visible' : 'none';
      if (map.current.getLayer('rail-network')) {
        map.current.setLayoutProperty('rail-network', 'visibility', visibility);
      }
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    
    // Search in cities based on name and country
    const results = cities
      .filter(city => 
        city.name.toLowerCase().includes(query.toLowerCase()) || 
        city.country.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5); // Limit to 5 results
    
    setSearchResults(results);
  };

  // Handle selecting a search result
  const handleSelectCity = (city: typeof cities[0]) => {
    if (!map.current) return;
    
    // Fly to the selected city
    map.current.flyTo({
      center: [city.coordinates.lng, city.coordinates.lat],
      zoom: 8,
      essential: true
    });
    
    setSearchQuery('');
    setSearchResults([]);
    
    // Check if city is already in trip
    const existingStop = trip.stops.find(stop => stop.cityId === city.id);
    if (existingStop) {
      onStopSelect(existingStop);
      return;
    }
    
    // Create and show a popup for adding the city
    setTimeout(() => {
      if (!map.current) return;
      
      // Create an interactive popup for non-trip stops
      const popupContent = document.createElement('div');
      popupContent.className = 'p-3 min-w-[200px] bg-white text-gray-900';
      popupContent.innerHTML = `
        <h3 class="font-bold text-lg mb-1 text-gray-900">${city.name}</h3>
        <p class="text-sm text-gray-600 mb-2">${city.country}</p>
        ${city.isTransportHub ? '<p class="text-sm text-blue-600 mb-2">Major Transport Hub</p>' : ''}
        <button class="add-to-trip-btn bg-amber-400 hover:bg-amber-500 text-gray-900 px-4 py-2 rounded-md text-sm font-medium w-full transition-colors">
          Add to Trip
        </button>
      `;

      // Create and show the popup
      const interactivePopup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: false,
        anchor: 'bottom',
        offset: [0, -10],
        className: 'custom-popup'
      })
      .setLngLat([city.coordinates.lng, city.coordinates.lat])
      .setDOMContent(popupContent)
      .addTo(map.current);

      // Style the close button after popup is added
      const popupEl = interactivePopup.getElement();
      if (popupEl) {
        const closeButton = popupEl.querySelector('.mapboxgl-popup-close-button') as HTMLButtonElement;
        if (closeButton) {
          closeButton.className = 'mapboxgl-popup-close-button absolute top-2 right-2 text-gray-500 hover:text-gray-900 text-xl font-medium cursor-pointer z-50';
          closeButton.innerHTML = '×';
          closeButton.style.border = 'none';
          closeButton.style.background = 'none';
          closeButton.style.padding = '0 6px';
        }
      }

      // Add click handler for the Add to Trip button
      const addButton = popupContent.querySelector('.add-to-trip-btn');
      if (addButton) {
        addButton.addEventListener('click', () => {
          const newStop: FormTripStop = {
            cityId: city.id,
            nights: 2,
            arrivalDate: new Date().toISOString(),
            departureDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
          };
          onStopSelect(newStop);
          interactivePopup.remove();
        });
      }
    }, 300); // Small delay to ensure the map has finished flying to the location
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/konradkjems/cm9g0evsi00jc01s8f75w5g88',
      center: [lng, lat],
      zoom: zoom,
      attributionControl: false
    });

    map.current = mapInstance;

    // Add navigation controls
    mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add attribution
    mapInstance.addControl(new mapboxgl.AttributionControl({
      compact: true
    }), 'bottom-right');

    // Handle style load event first
    mapInstance.on('style.load', () => {
      console.log('Map style loaded');
      
      if (!trip) {
        console.log('No trip data available');
        return;
      }

      try {
        // Get all layers to check what we're working with
        const layers = mapInstance.getStyle().layers || [];
        const firstLabelLayer = layers.find(layer => 
          layer.type === 'symbol' && 
          (layer.id.includes('label') || layer.id.includes('text'))
        )?.id;

        // Add all cities first
        const cityFeatures: Feature<Geometry, GeoJsonProperties>[] = cities
          .filter(city => 
            city.isTransportHub || 
            city.size === 'large' ||
            popularInterrailCities.includes(city.id) ||
            trip.stops.some(stop => stop.cityId === city.id)
          )
          .map(city => ({
            type: 'Feature',
            properties: {
              id: city.id,
              name: city.name,
              country: city.country,
              isTransportHub: city.isTransportHub,
              size: city.size,
              isSelected: false,
              isTripStop: false,
              stopIndex: -1,
              isPopular: popularInterrailCities.includes(city.id)
            },
            geometry: {
              type: 'Point',
              coordinates: [city.coordinates.lng, city.coordinates.lat]
            } as Point
          }));

        // Update properties for cities in the trip
        trip.stops.forEach((stop, index) => {
          const feature = cityFeatures.find(f => f.properties?.id === stop.cityId);
          if (feature && feature.properties) {
            feature.properties.isTripStop = true;
            feature.properties.stopIndex = index;
            feature.properties.isSelected = selectedStop?.cityId === stop.cityId;
          }
        });

        // Add cities source
        if (mapInstance.getSource('cities')) {
          mapInstance.removeLayer('city-circles');
          mapInstance.removeLayer('city-circles-stroke');
          mapInstance.removeLayer('stop-numbers');
          if (mapInstance.getLayer('stop-labels')) {
            mapInstance.removeLayer('stop-labels');
          }
          mapInstance.removeSource('cities');
        }

        mapInstance.addSource('cities', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: cityFeatures
          }
        });

        // Add city circles with different styles based on city type
        mapInstance.addLayer({
          id: 'city-circles',
          type: 'circle',
          source: 'cities',
          paint: {
            // Circle color based on city type
            'circle-color': [
              'case',
              ['get', 'isSelected'], '#EF4444', // Selected city (red)
              ['get', 'isTripStop'], '#3B82F6', // Trip stop (blue)
              ['get', 'isTransportHub'], '#8B5CF6', // Transport hub (purple)
              ['get', 'isPopular'], '#10B981', // Popular interrail city (green)
              '#6366F1' // Major city (indigo)
            ],
            // Circle size based on city type and zoom
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              4, [
                'case',
                ['get', 'isTripStop'], 8,
                ['get', 'isTransportHub'], 6,
                ['get', 'isPopular'], 5,
                4 // Major cities
              ],
              8, [
                'case',
                ['get', 'isTripStop'], 16,
                ['get', 'isTransportHub'], 12,
                ['get', 'isPopular'], 10,
                8 // Major cities
              ]
            ],
            'circle-opacity': [
              'case',
              ['get', 'isTripStop'], 1,
              ['get', 'isTransportHub'], 0.9,
              ['get', 'isPopular'], 0.85,
              0.7
            ]
          }
        }, firstLabelLayer);

        // Add white stroke around circles
        mapInstance.addLayer({
          id: 'city-circles-stroke',
          type: 'circle',
          source: 'cities',
          paint: {
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              4, [
                'case',
                ['get', 'isTripStop'], 10,
                ['get', 'isTransportHub'], 8,
                ['get', 'isPopular'], 7,
                6 // Major cities
              ],
              8, [
                'case',
                ['get', 'isTripStop'], 18,
                ['get', 'isTransportHub'], 14,
                ['get', 'isPopular'], 12,
                10 // Major cities
              ]
            ],
            'circle-color': 'white',
            'circle-opacity': 0.8
          }
        }, 'city-circles');

        // Add stop numbers for trip stops
        mapInstance.addLayer({
          id: 'stop-numbers',
          type: 'symbol',
          source: 'cities',
          filter: ['get', 'isTripStop'],
          layout: {
            'text-field': ['number-format', ['+', ['get', 'stopIndex'], 1], {}],
            'text-font': ['DIN Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': [
              'interpolate',
              ['linear'],
              ['zoom'],
              4, 12,
              8, 16
            ],
            'text-allow-overlap': true
          },
          paint: {
            'text-color': 'white'
          }
        });

        // Add click handlers for cities
        mapInstance.on('click', 'city-circles', (e) => {
          if (e.features && e.features[0].properties) {
            const props = e.features[0].properties;
            const feature = e.features[0] as Feature<Point>;
            const coordinates = feature.geometry.coordinates as [number, number];
            
            // If it's already a trip stop, select it
            const existingStop = trip.stops.find(s => s.cityId === props.id);
            if (existingStop) {
              onStopSelect(existingStop);
              return;
            }

            // Create an interactive popup for non-trip stops
            const popupContent = document.createElement('div');
            popupContent.className = 'p-3 min-w-[200px] bg-white text-gray-900';
            popupContent.innerHTML = `
              <h3 class="font-bold text-lg mb-1 text-gray-900">${props.name}</h3>
              <p class="text-sm text-gray-600 mb-2">${props.country}</p>
              ${props.isTransportHub ? '<p class="text-sm text-blue-600 mb-2">Major Transport Hub</p>' : ''}
              <button class="add-to-trip-btn bg-amber-400 hover:bg-amber-500 text-gray-900 px-4 py-2 rounded-md text-sm font-medium w-full transition-colors">
                Add to Trip
              </button>
            `;

            // Create and show the popup
            const interactivePopup = new mapboxgl.Popup({
              closeButton: true,
              closeOnClick: false,
              anchor: 'bottom',
              offset: [0, -10],
              className: 'custom-popup'
            })
            .setLngLat(coordinates)
            .setDOMContent(popupContent)
            .addTo(mapInstance);

            // Style the close button after popup is added
            const popupEl = interactivePopup.getElement();
            if (popupEl) {
              const closeButton = popupEl.querySelector('.mapboxgl-popup-close-button') as HTMLButtonElement;
              if (closeButton) {
                closeButton.className = 'mapboxgl-popup-close-button absolute top-2 right-2 text-gray-500 hover:text-gray-900 text-xl font-medium cursor-pointer z-50';
                closeButton.innerHTML = '×';
                closeButton.style.border = 'none';
                closeButton.style.background = 'none';
                closeButton.style.padding = '0 6px';
              }
            }

            // Add click handler for the Add to Trip button
            const addButton = popupContent.querySelector('.add-to-trip-btn');
            if (addButton) {
              addButton.addEventListener('click', () => {
                const newStop: FormTripStop = {
                  cityId: props.id,
                  nights: 2,
                  arrivalDate: new Date().toISOString(),
                  departureDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
                };
                onStopSelect(newStop);
                interactivePopup.remove();
              });
            }
          }
        });

        // Change cursor on hover
        const handleMouseEnter = (e: mapboxgl.MapMouseEvent) => {
          mapInstance.getCanvas().style.cursor = 'pointer';
        };

        const handleMouseLeave = (e: mapboxgl.MapMouseEvent) => {
          mapInstance.getCanvas().style.cursor = '';
        };

        // Remove any existing event listeners
        mapInstance.off('mouseenter', 'city-circles', handleMouseEnter);
        mapInstance.off('mouseleave', 'city-circles', handleMouseLeave);

        // Add new event listeners
        mapInstance.on('mouseenter', 'city-circles', handleMouseEnter);
        mapInstance.on('mouseleave', 'city-circles', handleMouseLeave);

        // Add rail network source
        const allRailFeatures: Feature<Geometry, GeoJsonProperties>[] = railConnections
          .map(connection => {
            const fromCity = cities.find(c => c.id === connection.fromCityId);
            const toCity = cities.find(c => c.id === connection.toCityId);
            if (!fromCity || !toCity) return null;

            return {
              type: 'Feature',
              properties: {
                speed: connection.speed,
                distance: connection.distance,
                color: getRailSpeedColor(connection.speed),
                dashArray: getRailSpeedDash(connection.speed)
              },
              geometry: {
                type: 'LineString',
                coordinates: [
                  [fromCity.coordinates.lng, fromCity.coordinates.lat],
                  [toCity.coordinates.lng, toCity.coordinates.lat]
                ]
              }
            } as Feature<Geometry, GeoJsonProperties>;
          })
          .filter((feature): feature is Feature<Geometry, GeoJsonProperties> => feature !== null);

        console.log(`Generated ${allRailFeatures.length} rail features`);

        // Clean up existing layers if they exist
        if (mapInstance.getSource('rail-network')) {
          if (mapInstance.getLayer('rail-network')) {
            mapInstance.removeLayer('rail-network');
          }
          mapInstance.removeSource('rail-network');
        }

        // Add rail network source
        mapInstance.addSource('rail-network', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: allRailFeatures
          }
        });

        // Add rail network layer
        mapInstance.addLayer({
          id: 'rail-network',
          type: 'line',
          source: 'rail-network',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
            'visibility': showRailNetwork ? 'visible' : 'none'
          },
          paint: {
            'line-color': ['get', 'color'],
            'line-width': ['interpolate', ['linear'], ['zoom'],
              4, 1,  // At zoom level 4, width will be 1px
              8, 3   // At zoom level 8, width will be 3px
            ],
            'line-dasharray': [
              'case',
              ['==', ['get', 'speed'], 'under-construction'],
              ['literal', [2, 2]],
              ['literal', [1]]
            ],
            'line-opacity': 1
          }
        }, firstLabelLayer);

        console.log('Added rail network layer');

        // Create and add trip route
        const tripRouteCoordinates = trip.stops.map(stop => {
          const city = cities.find(c => c.id === stop.cityId);
          return city ? [city.coordinates.lng, city.coordinates.lat] : null;
        }).filter((coord): coord is [number, number] => coord !== null);

        if (mapInstance.getSource('trip-route')) {
          if (mapInstance.getLayer('trip-route-line')) {
            mapInstance.removeLayer('trip-route-line');
          }
          mapInstance.removeSource('trip-route');
        }

        mapInstance.addSource('trip-route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: tripRouteCoordinates
            }
          }
        });

        mapInstance.addLayer({
          id: 'trip-route-line',
          type: 'line',
          source: 'trip-route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
            'visibility': 'visible'
          },
          paint: {
            'line-color': '#000000',
            'line-width': ['interpolate', ['linear'], ['zoom'],
              4, 2,  // At zoom level 4, width will be 2px
              8, 4   // At zoom level 8, width will be 4px
            ],
            'line-opacity': 0.9
          }
        }, firstLabelLayer);

        console.log('Added trip route layer');

        // Fit bounds to show all stops
        if (trip.stops.length > 0) {
          const bounds = new mapboxgl.LngLatBounds();
          trip.stops.forEach(stop => {
            const city = cities.find(c => c.id === stop.cityId);
            if (city) {
              bounds.extend([city.coordinates.lng, city.coordinates.lat]);
            }
          });
          mapInstance.fitBounds(bounds, { padding: 50 });
        }

        // Create custom DOM markers for trip stops with labels
        trip.stops.forEach((stop, index) => {
          const city = cities.find(c => c.id === stop.cityId);
          if (!city) return;
          
          // Create marker element
          const markerEl = document.createElement('div');
          markerEl.className = 'flex items-center';
          
          // Create label with city name
          const labelEl = document.createElement('div');
          labelEl.className = 'bg-white text-gray-900 px-3 py-1 rounded flex items-center text-sm font-medium shadow-lg';
          
          // City name
          const nameEl = document.createElement('span');
          nameEl.textContent = city.name;
          
          // Assemble elements
          labelEl.appendChild(nameEl);
          markerEl.appendChild(labelEl);
          
          // Create and add the marker
          const marker = new mapboxgl.Marker({
            element: markerEl,
            anchor: 'left',
            offset: [10, 0]
          })
          .setLngLat([city.coordinates.lng, city.coordinates.lat])
          .addTo(mapInstance);
          
          // Make marker clickable to select stop
          markerEl.addEventListener('click', () => {
            onStopSelect(stop);
          });
          
          // Store marker reference for cleanup
          markersRef.current.push(marker);
        });

        // Add hover effect for rail connections
        mapInstance.on('mouseenter', 'rail-network', (e) => {
          mapInstance.getCanvas().style.cursor = 'pointer';
          
          if (e.features && e.features[0].properties) {
            const props = e.features[0].properties;
            const speed = props.speed;
            const distance = props.distance;
            
            // Create popup content
            const popupContent = document.createElement('div');
            popupContent.className = 'p-2 text-sm';
            popupContent.innerHTML = `
              <div class="font-medium mb-1">Rail Connection</div>
              <div class="text-gray-600">Speed: ${speed}</div>
              ${distance ? `<div class="text-gray-600">Distance: ${distance} km</div>` : ''}
            `;
            
            // Show popup
            new mapboxgl.Popup({
              closeButton: false,
              closeOnClick: false,
              className: 'rail-info-popup'
            })
            .setLngLat(e.lngLat)
            .setDOMContent(popupContent)
            .addTo(mapInstance);
          }
        });

        // Remove hover effects
        mapInstance.on('mouseleave', 'rail-network', () => {
          mapInstance.getCanvas().style.cursor = '';
          const popups = document.getElementsByClassName('rail-info-popup');
          while(popups[0]) {
            popups[0].remove();
          }
        });

      } catch (error) {
        console.error('Error setting up map layers:', error);
      }
    });

    // Handle errors
    mapInstance.on('error', (e) => {
      console.error('Map error:', e);
    });

    // Cleanup on unmount
    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      mapInstance.remove();
    };
  }, [trip, selectedStop]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className={`w-full h-full ${className || ''}`} />
      
      {/* City search input */}
      <div className="absolute top-2 right-16 z-10">
        <div className="relative" ref={searchContainerRef}>
          <div className="flex items-center bg-white rounded-md shadow-md overflow-hidden">
            <input
              type="text"
              placeholder="Search cities..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchOpen(true)}
              className="py-1.5 px-3 text-sm focus:outline-none w-48"
            />
            <button 
              className="p-1.5 bg-gray-50 hover:bg-gray-100"
              onClick={() => {
                if (searchQuery) {
                  setSearchQuery('');
                  setSearchResults([]);
                } else {
                  setIsSearchOpen(!isSearchOpen);
                }
              }}
            >
              {searchQuery ? (
                <div className="h-4 w-4 text-gray-500 flex items-center justify-center">×</div>
              ) : (
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-500" />
              )}
            </button>
          </div>
          
          {/* Search results dropdown */}
          {isSearchOpen && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg z-20">
              <ul className="py-1 max-h-64 overflow-auto">
                {searchResults.map(city => (
                  <li 
                    key={city.id}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => handleSelectCity(city)}
                  >
                    <div className="font-medium">{city.name}</div>
                    <div className="text-xs text-gray-500">{city.country}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {/* Rail legend */}
      <div className="absolute bottom-4 left-4 z-10">
        <RailLegend 
          isOpen={isLegendOpen} 
          onToggle={() => setIsLegendOpen(!isLegendOpen)}
          showRailNetwork={showRailNetwork}
          onToggleRailNetwork={handleToggleRailNetwork}
        />
      </div>
    </div>
  );
} 