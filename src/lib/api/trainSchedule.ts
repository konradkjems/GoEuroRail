import axios from 'axios';
import { getMockTrainConnections } from './mockTrainData';

export interface TrainConnection {
  id: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  changes: number;
  trains: {
    type: string;
    number: string;
    operator: string;
    departureStation: string;
    arrivalStation: string;
    departureTime: string;
    arrivalTime: string;
  }[];
  price?: {
    amount: number;
    currency: string;
    fareClass: string;
  };
}

interface RailEuropeSegment {
  departure: {
    station: string;
    time: string;
  };
  arrival: {
    station: string;
    time: string;
  };
  train: {
    type: string;
    number: string;
    operator: string;
  };
}

interface RailEuropeConnection {
  id: string;
  segments: RailEuropeSegment[];
  duration: string;
  prices: {
    first: number;
    second: number;
    currency: string;
  };
}

const RAIL_EUROPE_API_KEY = process.env.RAIL_EUROPE_API_KEY;
const RAIL_EUROPE_API_URL = 'https://api.raileurope.com/v2';

// Temporarily use mock data while waiting for API access
export async function getTrainConnections(
  fromCity: string,
  toCity: string,
  date: string
): Promise<TrainConnection[]> {
  // Use mock data for now
  return getMockTrainConnections(fromCity, toCity, date);
}

// This function will be implemented when we have API access
export async function getStationCode(cityName: string): Promise<string | null> {
  return `${cityName.toLowerCase().replace(/\s+/g, '-')}-station`;
} 