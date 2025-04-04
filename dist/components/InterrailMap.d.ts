import "leaflet/dist/leaflet.css";
import { Trip } from "@/types";
interface InterrailMapProps {
    selectedTrip?: Trip | null;
    onCityClick?: (cityId: string) => void;
    className?: string;
}
export default function InterrailMap(props: InterrailMapProps): import("react").JSX.Element;
export {};
