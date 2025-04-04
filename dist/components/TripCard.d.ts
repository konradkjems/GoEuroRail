import { Trip } from "@/types";
interface TripCardProps {
    trip: Trip;
    onDelete: (id: string) => void;
}
export default function TripCard({ trip, onDelete }: TripCardProps): import("react").JSX.Element;
export {};
