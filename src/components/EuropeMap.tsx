import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { cities } from "@/lib/cities";
import dynamic from "next/dynamic";

const MapWithNoSSR = dynamic(() => Promise.resolve(MapDisplay), {
  ssr: false,
});

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

function MapDisplay() {
  // Center on Europe
  const center: [number, number] = [48.8566, 2.3522]; // Paris as center of Europe

  return (
    <MapContainer
      center={center}
      zoom={4}
      style={{ height: "400px", width: "100%" }}
      className="rounded-lg shadow-lg z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {cities.map((city) => (
        <Marker
          key={city.id}
          position={[city.coordinates.lat, city.coordinates.lng]}
          icon={getIcon()}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-gray-900">{city.name}</h3>
              <p className="text-gray-700">{city.country}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default function EuropeMap() {
  return <MapWithNoSSR />;
} 