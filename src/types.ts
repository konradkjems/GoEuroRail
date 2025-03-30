export interface Trip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  notes?: string;
  stops: TripStop[];
  travelers?: number;
}

export interface TripStop {
  city: City;
  arrivalDate?: string;
  departureDate?: string;
  accommodation?: string;
  notes?: string;
  nights?: number;
}

export interface City {
  id: string;
  name: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
} 