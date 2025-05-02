'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPinIcon, HomeIcon } from '@heroicons/react/24/outline';
import ReactDOM from 'react-dom';

// Set Mapbox access token
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
if (!MAPBOX_TOKEN) {
  console.warn('Mapbox token not found. Map functionality will be limited.');
}
mapboxgl.accessToken = MAPBOX_TOKEN;

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

interface AccommodationMapProps {
  accommodations: MapAccommodation[];
  center: { lat: number; lng: number };
  selectedId: string | null;
  onMarkerClick: (id: string) => void;
  className?: string;
  initialZoom?: number;
  onSelectAccommodation?: (id: string) => void;
  selectedAccommodationId?: string;
}

export default function AccommodationMap({ 
  accommodations, 
  center, 
  selectedId,
  onMarkerClick,
  className = '',
  initialZoom = 12,
  onSelectAccommodation,
  selectedAccommodationId
}: AccommodationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const [zoom] = useState(12); // Start at a slightly more zoomed out level
  const isDraggingRef = useRef(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const popups = useRef<{ [key: string]: mapboxgl.Popup }>({});
  
  // Initialize map with enhanced styling
  useEffect(() => {
    if (!mapContainer.current) return;
    if (!MAPBOX_TOKEN) {
      setMapError('Mapbox token not found. Please check your environment configuration.');
      return;
    }
    
    // Clean up function for unmounting
    let isMounted = true;
    
    try {
      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/konradkjems/cm9g0evsi00jc01s8f75w5g88', // Use the same style as MapboxMap
        center: [center.lng, center.lat],
        zoom: initialZoom || zoom,
        attributionControl: false,
      });

      // Set map instance to ref
      map.current = mapInstance;

      // Wait for map to load before doing operations
      mapInstance.on('load', () => {
        if (!isMounted) return;
        
        // Set map loaded state only when fully loaded
        setMapLoaded(true);
        
        // Add a CSS filter to the map for more vibrant colors
        const canvas = mapInstance.getCanvas();
        canvas.style.filter = 'saturate(1.1) contrast(1.05)';
        
        // Add navigation controls with custom styling
        mapInstance.addControl(
          new mapboxgl.NavigationControl({
            showCompass: true,
            showZoom: true,
            visualizePitch: true
          }), 
          'top-right'
        );
        
        // Rest of the map setup that should happen after load
        setupMapControls(mapInstance);
      });

      // Add error handling
      mapInstance.on('error', (e) => {
        console.error('Mapbox error:', e);
        if (isMounted) {
          setMapError('Error loading map. Please try refreshing the page.');
        }
      });

      // Add drag detection to prevent marker interaction during dragging
      mapInstance.on('mousedown', () => {
        isDraggingRef.current = false;
      });
      
      mapInstance.on('mousemove', (e) => {
        if (e.originalEvent.buttons === 1) { // Check if mouse button is pressed
          isDraggingRef.current = true;
        }
      });
      
      mapInstance.on('mouseup', () => {
        // Use setTimeout to distinguish between click and drag
        setTimeout(() => {
          isDraggingRef.current = false;
        }, 50);
      });

      // Ensure smoother transitions
      mapInstance.dragRotate.disable();
      mapInstance.touchPitch.disable();
      mapInstance.touchZoomRotate.disableRotation();
      mapInstance.keyboard.disableRotation();
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Failed to initialize map. Please check your browser compatibility and try again.');
    }

    // Cleanup on unmount
    return () => {
      isMounted = false;
      if (map.current) {
        try {
          Object.values(markersRef.current).forEach(marker => marker.remove());
          markersRef.current = {};
          map.current.remove();
        } catch (e) {
          console.error('Error cleaning up map:', e);
        }
      }
    };
  }, [center.lat, center.lng, initialZoom, zoom]);
  
  // Helper function to setup map controls
  const setupMapControls = (mapInstance: mapboxgl.Map) => {
    // Add custom reset view button
    const resetViewButton = document.createElement('button');
    resetViewButton.className = 'mapboxgl-ctrl-icon mapboxgl-ctrl-reset-view';
    resetViewButton.setAttribute('aria-label', 'Reset View');
    resetViewButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    `;
    
    resetViewButton.addEventListener('click', () => {
      // Reset to initial view
      mapInstance.flyTo({
        center: [center.lng, center.lat],
        zoom: zoom,
        duration: 1000,
        essential: true
      });
    });
    
    const resetControl = document.createElement('div');
    resetControl.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
    resetControl.appendChild(resetViewButton);
    
    mapInstance.getContainer().appendChild(resetControl);
    
    // Position the control at top-right
    resetControl.style.position = 'absolute';
    resetControl.style.top = '85px';
    resetControl.style.right = '10px';
    
    // Style controls after they're added
    setTimeout(() => {
      const controls = document.querySelectorAll('.mapboxgl-ctrl-group');
      controls.forEach(control => {
        (control as HTMLElement).style.border = 'none';
        (control as HTMLElement).style.borderRadius = '8px';
        (control as HTMLElement).style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.1)';
        (control as HTMLElement).style.overflow = 'hidden';
      });
    }, 100);

    // Add attribution with custom styling
    mapInstance.addControl(new mapboxgl.AttributionControl({
      compact: true
    }), 'bottom-right');
  };
  
  // Create and update markers with enhanced animations
  useEffect(() => {
    if (!map.current) return;
    
    // Wait for map to be loaded
    if (!map.current.loaded()) {
      map.current.on('load', () => updateMarkers());
    } else {
      updateMarkers();
    }
    
    function updateMarkers() {
      // Remove existing markers not in new data
      Object.keys(markersRef.current).forEach(id => {
        if (!accommodations.some(acc => acc.id === id)) {
          markersRef.current[id].remove();
          delete markersRef.current[id];
        }
      });
      
      // Add or update markers for accommodations
      accommodations.forEach((accommodation, index) => {
        // Skip if already on map (we'll just update its state)
        if (markersRef.current[accommodation.id]) {
          updateMarkerStyle(accommodation.id, accommodation.id === selectedId);
          return;
        }

        // Create marker element with enhanced style
        const el = document.createElement('div');
        el.className = 'accommodation-marker';
        // No initial animation to improve stability
        el.style.opacity = '0';
        
        // Set initial styles
        el.innerHTML = `
          <div class="marker-container">
            <div class="${accommodation.id === selectedId 
              ? 'marker-badge marker-selected' 
              : 'marker-badge'} 
              ${accommodation.id === selectedId ? 'bg-[#06D6A0]' : 'bg-[#264653]'}">
              <span class="text-xs font-bold font-sans text-white">${formatPrice(accommodation.price.amount, accommodation.price.currency)}</span>
            </div>
          </div>
        `;
        
        // Create a popup but don't add it to map yet
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 25,
          className: 'accommodation-popup'
        });
        
        // Add enhanced hover effects that won't trigger during dragging
        el.addEventListener('mouseenter', () => {
          if (!isDraggingRef.current && map.current) {
            const markerDiv = el.querySelector('.marker-badge') as HTMLDivElement;
            markerDiv.classList.add('marker-hover');
            
            // Show popup with accommodation details
            popup.setLngLat([accommodation.location.lng, accommodation.location.lat])
              .setHTML(`
                <div class="p-2">
                  <p class="font-medium text-sm truncate">${accommodation.name}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-600">Price per night</span>
                    <span className="font-bold text-[#06D6A0]">${formatPrice(accommodation.price.amount, accommodation.price.currency)}</span>
                  </div>
                </div>
              `)
              .addTo(map.current);
          }
        });
        
        el.addEventListener('mouseleave', () => {
          const markerDiv = el.querySelector('.marker-badge') as HTMLDivElement;
          markerDiv.classList.remove('marker-hover');
          
          // Remove popup
          popup.remove();
        });
        
        // Add click event with drag prevention
        el.addEventListener('click', (e) => {
          if (!isDraggingRef.current) {
            // Remove popup to avoid it staying open after click
            popup.remove();
            onMarkerClick(accommodation.id);
          }
        });
        
        // Create and add the marker
        const marker = new mapboxgl.Marker({
          element: el,
          anchor: 'bottom'
        })
        .setLngLat([accommodation.location.lng, accommodation.location.lat])
        .addTo(map.current!);
        
        // Fade in marker with slight delay for map to stabilize first
        setTimeout(() => {
          el.style.opacity = '1';
        }, 100 + index * 20); // Stagger with shorter delays for smoother experience
        
        // Store marker reference
        markersRef.current[accommodation.id] = marker;
      });
    }
    
    function updateMarkerStyle(id: string, isSelected: boolean) {
      const marker = markersRef.current[id];
      if (!marker) return;
      
      const el = marker.getElement();
      const markerDiv = el.querySelector('.marker-badge') as HTMLDivElement;
      
      if (isSelected) {
        markerDiv.classList.add('marker-selected');
        markerDiv.classList.add('bg-[#06D6A0]');
        markerDiv.classList.remove('bg-[#264653]');
      } else {
        markerDiv.classList.remove('marker-selected');
        markerDiv.classList.remove('bg-[#06D6A0]');
        markerDiv.classList.add('bg-[#264653]');
      }
    }
  }, [accommodations, selectedId, onMarkerClick]);
  
  // Update map center with smooth animation, but only when center changes significantly
  useEffect(() => {
    if (!map.current) return;
    
    // Get current center for comparison
    const currentCenter = map.current.getCenter();
    const distanceChanged = Math.abs(currentCenter.lng - center.lng) > 0.01 || 
                           Math.abs(currentCenter.lat - center.lat) > 0.01;
    
    // Only animate if there's a significant change in position
    if (distanceChanged) {
      // Use easeTo for smoother animation that's less jarring than flyTo
      map.current.easeTo({
        center: [center.lng, center.lat],
        duration: 800,
        zoom: map.current.getZoom(), // Maintain current zoom level to reduce visual change
        easing: t => t * (2 - t), // Ease out quad function for smoother animation
      });
    }
  }, [center]);
  
  // Update selected marker when selectedId changes
  useEffect(() => {
    Object.keys(markersRef.current).forEach(id => {
      updateMarkerStyle(id, id === selectedId);
    });
    
    function updateMarkerStyle(id: string, isSelected: boolean) {
      const marker = markersRef.current[id];
      if (!marker) return;
      
      const el = marker.getElement();
      const markerDiv = el.querySelector('.marker-badge') as HTMLDivElement;
      
      if (isSelected) {
        // Add selected class instead of directly manipulating style
        markerDiv.classList.add('marker-selected');
        markerDiv.classList.add('bg-[#06D6A0]');
        markerDiv.classList.remove('bg-[#264653]');
      } else {
        markerDiv.classList.remove('marker-selected');
        markerDiv.classList.remove('bg-[#06D6A0]');
        markerDiv.classList.add('bg-[#264653]');
      }
    }
  }, [selectedId]);

  // Add accommodation markers when map or accommodations change
  useEffect(() => {
    if (!map.current || !mapLoaded || !accommodations || accommodations.length === 0) return;

    // Clean up existing markers and popups
    Object.values(markersRef.current).forEach(marker => marker.remove());
    Object.values(popups.current).forEach(popup => popup.remove());
    markersRef.current = {};
    popups.current = {};

    // Add markers for each accommodation
    accommodations.forEach(accommodation => {
      try {
        // Create popup for this accommodation
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: [0, -10],
          className: 'accommodation-popup',
          maxWidth: '300px',
        });
        
        // Create the popup content
        const popupNode = document.createElement('div');
        ReactDOM.render(
          <AccommodationPreview accommodation={accommodation} />,
          popupNode
        );
        popup.setDOMContent(popupNode);
        
        // Create a DOM element for the marker
        const markerEl = document.createElement('div');
        markerEl.className = 'accommodation-marker';
        
        // Create price badge element
        const markerContainer = document.createElement('div');
        markerContainer.className = 'marker-container';
        
        const el = document.createElement('div');
        el.className = `marker-badge ${selectedAccommodationId === accommodation.id ? 'marker-selected' : ''}`;
        // Apply stronger styling with more opaque background
        el.style.backgroundColor = selectedAccommodationId === accommodation.id ? '#06D6A0' : '#264653';
        el.style.color = 'white';
        el.style.fontWeight = 'bold';
        el.style.fontSize = '12px';
        el.style.padding = '6px 12px';
        el.style.borderRadius = '9999px';
        el.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.3)'; // Stronger shadow
        el.style.opacity = '1'; // Full opacity
        el.textContent = `€${Math.round(accommodation.price.amount)}`;
        
        markerContainer.appendChild(el);
        markerEl.appendChild(markerContainer);
        
        // Create a marker
        const marker = new mapboxgl.Marker({
          element: markerEl,
          anchor: 'bottom',
        })
          .setLngLat([accommodation.location.lng, accommodation.location.lat])
          .addTo(map.current!);
        
        // Add hover events
        markerEl.addEventListener('mouseenter', () => {
          el.classList.add('marker-hover');
          popup.addTo(map.current!);
        });
        
        markerEl.addEventListener('mouseleave', () => {
          el.classList.remove('marker-hover');
          if (selectedAccommodationId !== accommodation.id) {
            popup.remove();
          }
        });
        
        // Add click event to select accommodation
        markerEl.addEventListener('click', () => {
          if (onSelectAccommodation) {
            onSelectAccommodation(accommodation.id);
          }
        });
        
        // Store the marker and popup reference
        markersRef.current[accommodation.id] = marker;
        popups.current[accommodation.id] = popup;
        
        // If this accommodation is selected, show its popup
        if (selectedAccommodationId === accommodation.id) {
          popup.addTo(map.current!);
          
          // Pan to the selected accommodation
          map.current!.panTo([accommodation.location.lng, accommodation.location.lat], {
            animate: true,
            duration: 500
          });
        }
      } catch (error) {
        console.error('Error adding marker:', error);
      }
    });
  }, [accommodations, mapLoaded, selectedAccommodationId, onSelectAccommodation]);

  // Update marker styles when selection changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    
    // Update marker styles based on selection
    Object.keys(markersRef.current).forEach(id => {
      const markerEl = markersRef.current[id].getElement();
      const badge = markerEl.querySelector('.marker-badge');
      
      if (badge) {
        if (id === selectedAccommodationId) {
          badge.classList.add('marker-selected');
          // Show popup for selected marker
          popups.current[id]?.addTo(map.current!);
        } else {
          badge.classList.remove('marker-selected');
          // Hide popup for non-selected markers
          popups.current[id]?.remove();
        }
      }
    });
  }, [selectedAccommodationId, mapLoaded]);

  // Show error state if map fails to load
  if (mapError) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 p-4">
        <div className="text-red-500 text-center max-w-md">
          <div className="font-semibold mb-2">Map Error</div>
          <p>{mapError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden rounded-lg shadow-inner ${className}`}>
      {/* Add a subtle gradient overlay for depth */}
      <div className="absolute inset-0 pointer-events-none rounded-lg" 
           style={{ 
             boxShadow: 'inset 0 0 8px rgba(0,0,0,0.1)',
             background: 'radial-gradient(circle at center, transparent 70%, rgba(0,0,0,0.03) 100%)'
           }}>
      </div>
      
      {/* Map container with rounded corners */}
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      
      {/* Add CSS for improved marker styling */}
      <style jsx global>{`
        .accommodation-marker {
          cursor: pointer;
          transition: opacity 0.3s ease-out;
        }
        
        .marker-container {
          position: relative;
          transform-origin: bottom center;
        }
        
        .marker-badge {
          min-width: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px 12px;
          border-radius: 9999px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
          transform-origin: center;
          opacity: 1 !important;
          color: white;
          font-weight: bold;
        }
        
        .marker-hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
        }
        
        .marker-selected {
          box-shadow: 0 0 0 rgba(6, 214, 160, 0.6);
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(6, 214, 160, 0.8);
          }
          70% {
            box-shadow: 0 0 0 8px rgba(6, 214, 160, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(6, 214, 160, 0);
          }
        }
        
        /* Make popup more consistent with site styling */
        .mapboxgl-popup-content {
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          padding: 0;
        }
        
        .accommodation-popup-content {
          border-radius: 8px;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

// Helper function to format price
function formatPrice(price: number, currency: string): string {
  if (currency === 'EUR') return `€${Math.round(price)}`;
  if (currency === 'USD') return `$${Math.round(price)}`;
  return `${Math.round(price)} ${currency}`;
}

// New component for accommodation preview in popups
const AccommodationPreview = ({ accommodation }: { accommodation: MapAccommodation }) => {
  return (
    <div className="accommodation-popup-content p-0">
      <div className="relative h-[120px] overflow-hidden">
        <img 
          src={accommodation.imageUrl || '/images/accommodation-placeholder.jpg'} 
          alt={accommodation.name}
          className="w-full h-full object-cover"
        />
        {accommodation.rating && (
          <div 
            className="absolute top-2 right-2 bg-black/80 text-white text-xs rounded-md px-2 py-1 shadow-md flex items-center"
          >
            <span className="text-yellow-400 mr-1">★</span> 
            {accommodation.rating}
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="font-bold text-sm text-[#264653] truncate">{accommodation.name}</p>
        <div className="flex justify-between items-center mt-1">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">{accommodation.type}</span>
          <p className="font-bold text-[#06D6A0] text-sm">
            €{accommodation.price.amount.toFixed(0)}/night
          </p>
        </div>
      </div>
    </div>
  );
}; 