import "leaflet/dist/leaflet.css";
import { Trip } from "@/types";
interface TripMapProps {
    trip: Trip;
}
export default function TripMap({ trip }: TripMapProps): import("react").JSX.Element;
export {};
