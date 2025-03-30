import { MapContainer, TileLayer, Marker, Popup, Polyline, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { cities } from "@/lib/cities";
import { formatDate } from "@/lib/utils";
import { City, Trip } from "@/types";
import dynamic from "next/dynamic";
import L from "leaflet";

const MapWithNoSSR = dynamic(() => Promise.resolve(MapDisplay), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

interface InterrailMapProps {
  selectedTrip?: Trip | null;
  onCityClick?: (cityId: string) => void;
  className?: string;
}

// Get custom icon based on whether city is selected
function getIcon(city: City, selectedTrip: Trip | null | undefined, selectedStopIndex: number) {
  // Check if this city is in the selected trip
  const isInTrip = selectedTrip?.stops.some(stop => stop.city.id === city.id);
  
  // Check if this city is the selected stop
  const isSelectedStop = selectedTrip?.stops[selectedStopIndex]?.city.id === city.id;
  
  if (isSelectedStop) {
    return new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  } else if (isInTrip) {
    return new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  } else {
    return new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  }
}

function MapDisplay({ selectedTrip, onCityClick, className }: InterrailMapProps) {
  // Center on Europe
  const center: [number, number] = [48.8566, 2.3522]; // Paris as center of Europe
  
  // Get trip route coordinates if a trip is selected
  const routeCoordinates = selectedTrip?.stops.map(stop => [
    stop.city.coordinates.lat,
    stop.city.coordinates.lng,
  ] as [number, number]) || [];

  // Get trip city IDs to highlight them on the map
  const tripCityIds = selectedTrip?.stops.map(stop => stop.city.id) || [];

  const handleMarkerClick = (cityId: string) => {
    if (onCityClick) {
      onCityClick(cityId);
    }
  };

  return (
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
      {cities.map((city) => {
        const isTripStop = tripCityIds.includes(city.id);
        return (
          <Marker
            key={city.id}
            position={[city.coordinates.lat, city.coordinates.lng]}
            icon={getIcon(city, selectedTrip, 0)}
            eventHandlers={{
              click: () => handleMarkerClick(city.id),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-gray-900">{city.name}</h3>
                <p className="text-gray-700">{city.country}</p>
                {isTripStop && selectedTrip ? (
                  <button 
                    className="mt-2 px-2 py-1 bg-[#FFD166] text-[#264653] text-xs rounded hover:bg-[#FFC233]"
                    onClick={() => handleMarkerClick(city.id)}
                  >
                    View Details
                  </button>
                ) : selectedTrip && (
                  <button 
                    className="mt-2 px-2 py-1 bg-[#06D6A0] text-white text-xs rounded hover:bg-[#05C090]"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onCityClick) {
                        // We'll implement addCityToTrip in the parent component
                        window.dispatchEvent(new CustomEvent('addCityToTrip', { detail: { cityId: city.id } }));
                      }
                    }}
                  >
                    Add to Trip
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
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
  );
}

export default function InterrailMap(props: InterrailMapProps) {
  return <MapWithNoSSR {...props} />;
} 