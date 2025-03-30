export interface City {
  id: string;
  name: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface TripStop {
  city: City;
  arrivalDate: Date | null;
  departureDate: Date | null;
  accommodation: string;
  notes: string;
}

export interface Trip {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  stops: TripStop[];
  notes: string;
}

export interface FormTripStop {
  cityId: string;
  arrivalDate: string;
  departureDate: string;
  accommodation: string;
  notes: string;
}

export interface FormTrip {
  name: string;
  startDate: string;
  endDate: string;
  stops: FormTripStop[];
  notes: string;
} 