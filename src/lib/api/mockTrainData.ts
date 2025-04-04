import { TrainConnection } from './trainSchedule';

// Define major transfer hubs for different regions
const TRANSFER_STATIONS = {
  CENTRAL_EUROPE: ['Frankfurt (Main) Hbf', 'München Hbf', 'Zürich HB'],
  WESTERN_EUROPE: ['Paris Gare du Nord', 'Brussels-Midi/Zuid', 'Amsterdam Centraal'],
  EASTERN_EUROPE: ['Wien Hbf', 'Budapest-Keleti', 'Praha hl.n.'],
  SOUTHERN_EUROPE: ['Milano Centrale', 'Barcelona Sants', 'Roma Termini']
};

// Define operators by region
const OPERATORS_BY_REGION = {
  FRANCE: { name: 'SNCF', types: ['TGV', 'TER'] },
  GERMANY: { name: 'Deutsche Bahn', types: ['ICE', 'IC'] },
  ITALY: { name: 'Trenitalia', types: ['Frecciarossa', 'Intercity'] },
  SPAIN: { name: 'Renfe', types: ['AVE', 'Alvia'] },
  AUSTRIA: { name: 'ÖBB', types: ['RailJet', 'IC'] },
  SWITZERLAND: { name: 'SBB', types: ['IC', 'IR'] },
  BENELUX: { name: 'NS International', types: ['IC', 'Thalys'] }
};

interface RouteInfo {
  operator: string;
  type: string;
  duration: number;
}

type MajorRoutes = {
  [key: string]: RouteInfo;
}

// Define major routes with their operators and typical durations
const MAJOR_ROUTES: MajorRoutes = {
  'Paris-London': { operator: 'Eurostar', type: 'Eurostar', duration: 2.5 },
  'Paris-Brussels': { operator: 'Thalys', type: 'Thalys', duration: 1.5 },
  'Paris-Amsterdam': { operator: 'Thalys', type: 'Thalys', duration: 3.5 },
  'Paris-Frankfurt': { operator: 'SNCF/DB', type: 'TGV/ICE', duration: 4 },
  'Amsterdam-Berlin': { operator: 'Deutsche Bahn', type: 'ICE', duration: 6.5 },
  'Berlin-Prague': { operator: 'Deutsche Bahn', type: 'EC', duration: 4.5 },
  'Vienna-Budapest': { operator: 'ÖBB', type: 'RailJet', duration: 2.5 },
  'Milan-Rome': { operator: 'Trenitalia', type: 'Frecciarossa', duration: 3 },
  'Barcelona-Madrid': { operator: 'Renfe', type: 'AVE', duration: 2.5 },
};

function getRouteKey(fromCity: string, toCity: string): string {
  const cities = [fromCity, toCity].sort();
  return `${cities[0]}-${cities[1]}`;
}

function findTransferStation(fromCity: string, toCity: string): string {
  // Get a geographically appropriate transfer station
  const allStations = Object.values(TRANSFER_STATIONS).flat();
  return allStations[Math.floor(Math.random() * allStations.length)];
}

function generateTrainNumber(): string {
  return Math.floor(Math.random() * 9000 + 1000).toString();
}

function addHours(time: string, hours: number): string {
  const [h, m] = time.split(':').map(Number);
  const newDate = new Date(2024, 0, 1, h, m);
  newDate.setHours(newDate.getHours() + hours);
  return `${newDate.getHours().toString().padStart(2, '0')}:${newDate.getMinutes().toString().padStart(2, '0')}`;
}

function generatePrice(duration: number, isFirstClass: boolean = false): { amount: number; currency: string; fareClass: string } {
  // Base price calculation: €20 per hour plus random variation
  const basePrice = Math.floor(duration * 20 + Math.random() * 20);
  const finalPrice = isFirstClass ? basePrice * 1.5 : basePrice;
  
  return {
    amount: Math.round(finalPrice),
    currency: 'EUR',
    fareClass: isFirstClass ? 'First Class' : 'Second Class'
  };
}

function generateConnection(
  fromCity: string,
  toCity: string,
  departureTime: string
): TrainConnection {
  const routeKey = getRouteKey(fromCity, toCity);
  const majorRoute = MAJOR_ROUTES[routeKey];
  
  // Determine if this should be a direct route
  const isDirect = majorRoute || Math.random() > 0.7;
  
  // Calculate duration based on major route or estimate
  const duration = majorRoute ? 
    majorRoute.duration : 
    isDirect ? 
      Math.floor(Math.random() * 4) + 2 : // 2-5 hours
      Math.floor(Math.random() * 6) + 4;  // 4-9 hours

  const segments = isDirect ? [
    {
      type: majorRoute?.type || Object.values(OPERATORS_BY_REGION)[0].types[0],
      number: generateTrainNumber(),
      operator: majorRoute?.operator || Object.values(OPERATORS_BY_REGION)[0].name,
      departureStation: `${fromCity} Central`,
      arrivalStation: `${toCity} Central`,
      departureTime: departureTime,
      arrivalTime: addHours(departureTime, duration)
    }
  ] : [
    {
      type: Object.values(OPERATORS_BY_REGION)[0].types[0],
      number: generateTrainNumber(),
      operator: Object.values(OPERATORS_BY_REGION)[0].name,
      departureStation: `${fromCity} Central`,
      arrivalStation: findTransferStation(fromCity, toCity),
      departureTime: departureTime,
      arrivalTime: addHours(departureTime, Math.floor(duration / 2))
    },
    {
      type: Object.values(OPERATORS_BY_REGION)[1].types[0],
      number: generateTrainNumber(),
      operator: Object.values(OPERATORS_BY_REGION)[1].name,
      departureStation: findTransferStation(fromCity, toCity),
      arrivalStation: `${toCity} Central`,
      departureTime: addHours(departureTime, Math.floor(duration / 2) + 0.5),
      arrivalTime: addHours(departureTime, duration)
    }
  ];

  const isFirstClass = Math.random() > 0.7;

  return {
    id: Math.random().toString(36).substr(2, 9),
    departureTime: segments[0].departureTime,
    arrivalTime: segments[segments.length - 1].arrivalTime,
    duration: `${Math.floor(duration)}h ${Math.floor(Math.random() * 60)}m`,
    changes: segments.length - 1,
    trains: segments,
    price: generatePrice(duration, isFirstClass)
  };
}

export function getMockTrainConnections(
  fromCity: string,
  toCity: string,
  date: string
): Promise<TrainConnection[]> {
  // Generate 3-7 connections throughout the day
  const numConnections = Math.floor(Math.random() * 5) + 3;
  const connections: TrainConnection[] = [];

  // Generate departure times between 6:00 and 20:00
  for (let i = 0; i < numConnections; i++) {
    const hour = Math.floor(Math.random() * 14) + 6; // 6-20
    const minute = Math.floor(Math.random() * 12) * 5; // 0, 5, 10, ..., 55
    const departureTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    connections.push(generateConnection(fromCity, toCity, departureTime));
  }

  // Sort by departure time
  connections.sort((a, b) => a.departureTime.localeCompare(b.departureTime));

  // Simulate API delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(connections);
    }, 1000);
  });
} 