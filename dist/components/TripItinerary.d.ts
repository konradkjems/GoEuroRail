import { Trip } from "@/types";
interface TripItineraryProps {
    trip: Trip | null;
    onDeleteTrip?: (id: string) => void;
    selectedStopIndex?: number;
    onSelectStop?: (index: number) => void;
    onUpdateTrip?: (updatedTrip: Trip) => void;
}
export default function TripItinerary({ trip, onDeleteTrip, selectedStopIndex, onSelectStop, onUpdateTrip }: TripItineraryProps): import("react").JSX.Element;
export {};
