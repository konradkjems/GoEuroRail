// Base interfaces for data models
export interface City {
  id: string;
  name: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  region: string;
  population: number;
  isTransportHub?: boolean;
  size?: 'small' | 'medium' | 'large';
  altNames?: string[]; // Alternative names for the city
}

// Form interfaces (used in components)
export interface FormTripStop {
  cityId: string;
  arrivalDate: string;
  departureDate: string;
  nights: number;
  isStopover?: boolean;
  accommodation?: string;
  notes?: string;
  useInterrailPass?: boolean;
  customTransport?: {
    transportType: "train" | "bus";
    departureTime: string;
    arrivalTime: string;
    departureDate: string;
    arrivalDate: string;
    departureStation?: string;
    arrivalStation?: string;
    operator?: string;
    link?: string;
    notes?: string;
    overnightTransport: boolean;
    bookingNumber?: string;
    track?: string;
    vehicleNumber?: string;
    seatNumber?: string;
  };
  trainDetails?: {
    trainNumber: string;
    duration: string;
    changes: number;
    price?: {
      amount: number;
      currency: string;
    };
  };
}

export interface FormTrip {
  id?: string;
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  notes?: string;
  travelers?: number;
  stops: FormTripStop[];
  userId?: string;
  budget?: number;
}

// Database interfaces (used in API and database operations)
export interface TripStop {
  city: City;
  arrivalDate: string;
  departureDate: string;
  accommodation?: string;
  notes?: string;
  nights?: number;
}

export interface Trip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  stops: TripStop[];
  notes: string;
  travelers?: number;
} 