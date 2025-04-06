import { City } from '@/types';

// Adding cities that are missing from the database but needed for rail connections
const missingCitiesData = [
  {
    "id": "cologne",
    "name": "Cologne",
    "country": "Germany",
    "coordinates": {
      "lat": 50.9375,
      "lng": 6.9603
    },
    "region": "Western Europe",
    "population": 1085664,
    "isTransportHub": true,
    "size": "large"
  },
  {
    "id": "seville",
    "name": "Seville",
    "country": "Spain",
    "coordinates": {
      "lat": 37.3891,
      "lng": -5.9845
    },
    "region": "Southern Europe",
    "population": 688711,
    "isTransportHub": false,
    "size": "large"
  },
  {
    "id": "frankfurt",
    "name": "Frankfurt",
    "country": "Germany",
    "coordinates": {
      "lat": 50.1109,
      "lng": 8.6821
    },
    "region": "Western Europe",
    "population": 753056,
    "isTransportHub": true,
    "size": "large"
  },
  {
    "id": "hannover",
    "name": "Hannover",
    "country": "Germany",
    "coordinates": {
      "lat": 52.3759,
      "lng": 9.7320
    },
    "region": "Western Europe",
    "population": 532163,
    "isTransportHub": false,
    "size": "large"
  },
  {
    "id": "munich",
    "name": "Munich",
    "country": "Germany",
    "coordinates": {
      "lat": 48.1351,
      "lng": 11.5820
    },
    "region": "Western Europe",
    "population": 1450381,
    "isTransportHub": true,
    "size": "large"
  },
  {
    "id": "basel",
    "name": "Basel",
    "country": "Switzerland",
    "coordinates": {
      "lat": 47.5596,
      "lng": 7.5886
    },
    "region": "Western Europe",
    "population": 171513,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "zurich",
    "name": "Zurich",
    "country": "Switzerland",
    "coordinates": {
      "lat": 47.3769,
      "lng": 8.5417
    },
    "region": "Western Europe",
    "population": 402762,
    "isTransportHub": true,
    "size": "large"
  },
  {
    "id": "ankara",
    "name": "Ankara",
    "country": "Turkey",
    "coordinates": {
      "lat": 39.9334,
      "lng": 32.8597
    },
    "region": "Eastern Europe",
    "population": 5663322,
    "isTransportHub": false,
    "size": "large"
  },
  {
    "id": "geneva",
    "name": "Geneva",
    "country": "Switzerland",
    "coordinates": {
      "lat": 46.2044,
      "lng": 6.1432
    },
    "region": "Western Europe",
    "population": 198072,
    "isTransportHub": false,
    "size": "medium"
  },
  {
    "id": "lyon",
    "name": "Lyon",
    "country": "France",
    "coordinates": {
      "lat": 45.7640,
      "lng": 4.8357
    },
    "region": "Western Europe",
    "population": 516092,
    "isTransportHub": true,
    "size": "large"
  }
];

export const missingCities: readonly City[] = missingCitiesData as unknown as City[];
export default missingCities; 