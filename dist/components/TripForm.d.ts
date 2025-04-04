import { Trip, FormTrip } from "@/types";
interface TripFormProps {
    initialData?: Trip;
    onSubmit: (data: FormTrip) => void;
}
export default function TripForm({ initialData, onSubmit }: TripFormProps): import("react").JSX.Element;
export {};
