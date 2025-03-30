import { format, parseISO } from "date-fns";
import { City, FormTrip, FormTripStop, Trip, TripStop } from "@/types";
import { cities } from "./cities";
import { v4 as uuidv4 } from "uuid";

export function formatDate(dateString: string): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function parseDate(dateString: string): Date {
  return new Date(dateString);
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(date.getDate() + days);
  return result;
}

export function getCityById(id: string): City | undefined {
  return cities.find(city => city.id === id);
}

export function convertFormTripToTrip(formTrip: FormTrip): Trip {
  const stops: TripStop[] = formTrip.stops
    .filter(stop => stop.cityId) // Filter out empty stops
    .map(stop => convertFormTripStopToTripStop(stop));

  return {
    id: uuidv4(),
    name: formTrip.name,
    startDate: parseISO(formTrip.startDate),
    endDate: parseISO(formTrip.endDate),
    stops,
    notes: formTrip.notes
  };
}

export function convertFormTripStopToTripStop(formStop: FormTripStop): TripStop {
  const city = getCityById(formStop.cityId);
  
  if (!city) {
    throw new Error(`City with ID ${formStop.cityId} not found`);
  }

  return {
    city,
    arrivalDate: formStop.arrivalDate ? parseISO(formStop.arrivalDate) : null,
    departureDate: formStop.departureDate ? parseISO(formStop.departureDate) : null,
    accommodation: formStop.accommodation,
    notes: formStop.notes
  };
}

// Simple client-side storage functions
export function saveTrips(trips: Trip[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("interrail-trips", JSON.stringify(trips));
  }
}

export function loadTrips(): Trip[] {
  if (typeof window !== "undefined") {
    const tripsJson = localStorage.getItem("interrail-trips");
    if (tripsJson) {
      try {
        const parsedTrips = JSON.parse(tripsJson);
        return parsedTrips.map((trip: any) => ({
          ...trip,
          startDate: new Date(trip.startDate),
          endDate: new Date(trip.endDate),
          stops: trip.stops.map((stop: any) => ({
            ...stop,
            arrivalDate: stop.arrivalDate ? new Date(stop.arrivalDate) : null,
            departureDate: stop.departureDate ? new Date(stop.departureDate) : null
          }))
        }));
      } catch (error) {
        console.error("Error parsing trips from localStorage:", error);
      }
    }
  }
  return [];
} 