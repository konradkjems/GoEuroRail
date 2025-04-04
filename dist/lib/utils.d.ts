import { City, FormTrip, FormTripStop, Trip, TripStop } from "@/types";
export declare function formatDate(date: string | Date): string;
export declare function parseDate(dateString: string): Date;
export declare function addDays(date: Date, days: number): Date;
export declare function getCityById(id: string): City | undefined;
export declare function convertFormTripToTrip(formTrip: FormTrip): Trip;
export declare function convertFormTripStopToTripStop(formStop: FormTripStop): TripStop;
export declare function saveTrips(trips: Trip[]): void;
export declare function loadTrips(): Trip[];
