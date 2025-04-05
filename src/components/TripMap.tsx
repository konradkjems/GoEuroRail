import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Trip } from "@/types";
import { Icon } from "leaflet";
import L from "leaflet";
import { formatDate } from "@/lib/utils";
import RailLegend from './RailLegend';

// Need to handle SSR with Leaflet
import dynamic from "next/dynamic";

const MapWithNoSSR = dynamic(() => Promise.resolve(MapDisplay), {
  ssr: false,
});

interface TripMapProps {
  trip: Trip;
}

// Fix for Leaflet default icon in Next.js
function getIcon() {
  return new Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
  });
}

function MapDisplay({ trip }: TripMapProps) {
  const [isLegendOpen, setIsLegendOpen] = useState(true);

  // Extract coordinates for centering the map
  const coordinates = trip.stops.map(stop => [
    stop.city.coordinates.lat,
    stop.city.coordinates.lng,
  ]);

  // If no stops, center on Europe
  const center = coordinates.length > 0
    ? [coordinates[0][0], coordinates[0][1]]
    : [48.8566, 2.3522]; // Paris as default center

  return (
    <div className="relative">
      <MapContainer
        center={[center[0], center[1]] as [number, number]}
        zoom={5}
        style={{ height: "500px", width: "100%" }}
        className="rounded-lg shadow-lg z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {trip.stops.map((stop, index) => (
          <Marker
            key={`${stop.city.id}-${index}`}
            position={[stop.city.coordinates.lat, stop.city.coordinates.lng]}
            icon={getIcon()}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-gray-900">{stop.city.name}, {stop.city.country}</h3>
                {stop.arrivalDate && (
                  <p className="text-gray-700">Arrival: {formatDate(stop.arrivalDate)}</p>
                )}
                {stop.departureDate && (
                  <p className="text-gray-700">Departure: {formatDate(stop.departureDate)}</p>
                )}
                {stop.accommodation && (
                  <p className="text-gray-700">Accommodation: {stop.accommodation}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Draw lines between consecutive stops */}
        {trip.stops.length > 1 && (
          <Polyline
            positions={coordinates as [number, number][]}
            color="blue"
            weight={3}
            opacity={0.7}
          />
        )}
      </MapContainer>
      
      {/* Rail Legend Component as direct DOM overlay */}
      <div className="absolute top-4 left-4 z-[9999]">
        <RailLegend isOpen={isLegendOpen} onToggle={() => setIsLegendOpen(!isLegendOpen)} />
      </div>
    </div>
  );
}

export default function TripMap({ trip }: TripMapProps) {
  return <MapWithNoSSR trip={trip} />;
} 