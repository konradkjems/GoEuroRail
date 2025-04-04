import { format, parseISO } from "date-fns";
import { City, FormTrip, FormTripStop, Trip, TripStop } from "@/types";
import { cities } from "./cities";
import { v4 as uuidv4 } from "uuid";

export function formatDate(date: string | Date): string {
  if (!date) return 'N/A';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
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
    startDate: formTrip.startDate,
    endDate: formTrip.endDate,
    stops,
    notes: formTrip.notes || '',
    travelers: formTrip.travelers
  };
}

export function convertFormTripStopToTripStop(formStop: FormTripStop): TripStop {
  const city = getCityById(formStop.cityId);
  
  if (!city) {
    throw new Error(`City with ID ${formStop.cityId} not found`);
  }

  return {
    city,
    arrivalDate: formStop.arrivalDate,
    departureDate: formStop.departureDate,
    accommodation: formStop.accommodation || '',
    notes: formStop.notes || '',
    nights: formStop.nights || 1
  };
}

// Function to get timezone from coordinates (simplified version)
export const getTimezoneFromCoordinates = (lat: number, lng: number): string => {
  // This is a simplified version. In a real application, you would use a proper
  // timezone database like 'tzdata' or an API service to get accurate timezone data.
  
  // For now, we'll use a simple longitude-based approximation
  const hourOffset = Math.round(lng / 15);
  
  if (lat > 35 && lat < 70) { // Rough boundaries for Europe
    if (hourOffset <= 0) return 'Europe/London';
    if (hourOffset === 1) return 'Europe/Paris';
    if (hourOffset === 2) return 'Europe/Berlin';
    if (hourOffset === 3) return 'Europe/Moscow';
  }
  
  return 'Europe/London'; // Default fallback
};

// Function to load trips from localStorage
export const loadTrips = () => {
  if (typeof window === 'undefined') return [];
  const savedTrips = localStorage.getItem('trips');
  return savedTrips ? JSON.parse(savedTrips) : [];
};

// Function to save trips to localStorage
export const saveTrips = (trips: any[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('trips', JSON.stringify(trips));
}; 