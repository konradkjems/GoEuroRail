import { cities } from './filterCities';

// Define the types for rail connections
export type RailSpeed = 
  | 'high-speed' // 310-320 km/h
  | 'very-fast' // 270-300 km/h
  | 'fast' // 240-260 km/h
  | 'medium' // 200-230 km/h
  | 'under-construction'
  | 'normal'; // < 200 km/h

export interface RailConnection {
  fromCityId: string;
  toCityId: string;
  speed: RailSpeed;
  distance?: number; // in km, optional
}

// Helper function to find city IDs by name
const findCityId = (name: string): string | undefined => {
  const city = cities.find(c => 
    c.name.toLowerCase() === name.toLowerCase() ||
    (c.altNames && c.altNames.some(alt => alt.toLowerCase() === name.toLowerCase()))
  );
  return city?.id;
};

// Create bidirectional connections between cities
const createBidirectionalConnection = (
  fromCity: string, 
  toCity: string, 
  speed: RailSpeed, 
  distance?: number
): RailConnection[] => {
  const fromCityId = findCityId(fromCity);
  const toCityId = findCityId(toCity);
  
  if (!fromCityId || !toCityId) {
    console.warn(`Could not find city IDs for connection ${fromCity} - ${toCity}`);
    return [];
  }
  
  return [
    { fromCityId, toCityId, speed, distance },
    { fromCityId: toCityId, toCityId: fromCityId, speed, distance }
  ];
};

// Define rail connections based on the European rail map
// These connections reflect the high-speed and main railway lines across Europe
export const railConnections: RailConnection[] = [
  // High-speed connections (310-320 km/h) - Purple lines
  ...createBidirectionalConnection('Paris', 'Lyon', 'high-speed'),
  ...createBidirectionalConnection('Lyon', 'Marseille', 'high-speed'),
  ...createBidirectionalConnection('Paris', 'Strasbourg', 'high-speed'),
  ...createBidirectionalConnection('Paris', 'Tours', 'high-speed'),
  ...createBidirectionalConnection('Madrid', 'Barcelona', 'high-speed'),
  
  // Very fast connections (270-300 km/h) - Red lines
  ...createBidirectionalConnection('Paris', 'London', 'very-fast'),
  ...createBidirectionalConnection('Paris', 'Brussels', 'very-fast'),
  ...createBidirectionalConnection('Brussels', 'Amsterdam', 'very-fast'),
  ...createBidirectionalConnection('Brussels', 'Cologne', 'very-fast'),
  ...createBidirectionalConnection('Madrid', 'Seville', 'very-fast'),
  ...createBidirectionalConnection('Madrid', 'Valencia', 'very-fast'),
  ...createBidirectionalConnection('Milan', 'Rome', 'very-fast'),
  ...createBidirectionalConnection('Rome', 'Naples', 'very-fast'),
  ...createBidirectionalConnection('Milan', 'Turin', 'very-fast'),
  ...createBidirectionalConnection('Berlin', 'Hamburg', 'very-fast'),
  ...createBidirectionalConnection('Berlin', 'Munich', 'very-fast'),
  ...createBidirectionalConnection('Frankfurt', 'Cologne', 'very-fast'),
  ...createBidirectionalConnection('Frankfurt', 'Munich', 'very-fast'),
  
  // Fast connections (240-260 km/h) - Orange lines
  ...createBidirectionalConnection('Barcelona', 'Valencia', 'fast'),
  ...createBidirectionalConnection('Lyon', 'Turin', 'fast'),
  ...createBidirectionalConnection('Rome', 'Florence', 'fast'),
  ...createBidirectionalConnection('Frankfurt', 'Hannover', 'fast'),
  ...createBidirectionalConnection('Hannover', 'Berlin', 'fast'),
  ...createBidirectionalConnection('Amsterdam', 'Hannover', 'fast'),
  ...createBidirectionalConnection('Vienna', 'Salzburg', 'fast'),
  ...createBidirectionalConnection('Stockholm', 'Copenhagen', 'fast'),
  
  // Medium-speed connections (200-230 km/h) - Yellow lines
  ...createBidirectionalConnection('Amsterdam', 'Copenhagen', 'medium'),
  ...createBidirectionalConnection('Copenhagen', 'Hamburg', 'medium'),
  ...createBidirectionalConnection('Hamburg', 'Frankfurt', 'medium'),
  ...createBidirectionalConnection('Munich', 'Vienna', 'medium'),
  ...createBidirectionalConnection('Vienna', 'Budapest', 'medium'),
  ...createBidirectionalConnection('Madrid', 'Lisbon', 'medium'),
  ...createBidirectionalConnection('Basel', 'Zurich', 'medium'),
  ...createBidirectionalConnection('Zurich', 'Milan', 'medium'),
  ...createBidirectionalConnection('Barcelona', 'Lyon', 'medium'),
  ...createBidirectionalConnection('London', 'Edinburgh', 'medium'),
  ...createBidirectionalConnection('Oslo', 'Stockholm', 'medium'),
  ...createBidirectionalConnection('Stockholm', 'Helsinki', 'medium'),
  
  // Under construction/upgrading - Green dotted lines
  ...createBidirectionalConnection('Barcelona', 'Montpellier', 'under-construction'),
  ...createBidirectionalConnection('Lyon', 'Montpellier', 'under-construction'),
  ...createBidirectionalConnection('Warsaw', 'Vilnius', 'under-construction'),
  ...createBidirectionalConnection('Istanbul', 'Ankara', 'under-construction'),
  
  // Normal speed connections (< 200 km/h) - Grey lines
  ...createBidirectionalConnection('Lisbon', 'Porto', 'normal'),
  ...createBidirectionalConnection('Madrid', 'Porto', 'normal'),
  ...createBidirectionalConnection('Geneva', 'Lyon', 'normal'),
  ...createBidirectionalConnection('Zurich', 'Vienna', 'normal'),
  ...createBidirectionalConnection('Vienna', 'Prague', 'normal'),
  ...createBidirectionalConnection('Prague', 'Berlin', 'normal'),
  ...createBidirectionalConnection('Prague', 'Warsaw', 'normal'),
  ...createBidirectionalConnection('Berlin', 'Warsaw', 'normal'),
  ...createBidirectionalConnection('Warsaw', 'Minsk', 'normal'),
  ...createBidirectionalConnection('Munich', 'Prague', 'normal'),
  ...createBidirectionalConnection('Budapest', 'Belgrade', 'normal'),
  ...createBidirectionalConnection('Belgrade', 'Sofia', 'normal'),
  ...createBidirectionalConnection('Sofia', 'Istanbul', 'normal'),
  ...createBidirectionalConnection('Rome', 'Bari', 'normal'),
  ...createBidirectionalConnection('Dublin', 'Belfast', 'normal'),
];

// Get color for rail speed to use in map visualization
export const getRailSpeedColor = (speed: RailSpeed): string => {
  switch (speed) {
    case 'high-speed':
      return '#8B5CF6'; // Purple - 310-320 km/h
    case 'very-fast':
      return '#EF4444'; // Red - 270-300 km/h
    case 'fast':
      return '#F97316'; // Orange - 240-260 km/h
    case 'medium':
      return '#FACC15'; // Yellow - 200-230 km/h
    case 'under-construction':
      return '#10B981'; // Green (dotted in actual render) - under construction
    case 'normal':
    default:
      return '#9CA3AF'; // Grey - < 200 km/h
  }
};

// Get line style (solid/dashed) based on rail speed
export const getRailSpeedDash = (speed: RailSpeed): number[] | null => {
  return speed === 'under-construction' ? [4, 4] : null; // Dashed line for under construction
};

// Helper to get connections for a trip
export const getConnectionsForTrip = (tripCityIds: string[]): RailConnection[] => {
  if (tripCityIds.length <= 1) return [];
  
  const result: RailConnection[] = [];
  for (let i = 0; i < tripCityIds.length - 1; i++) {
    const fromCityId = tripCityIds[i];
    const toCityId = tripCityIds[i + 1];
    
    // Find direct connection
    const directConnection = railConnections.find(
      conn => conn.fromCityId === fromCityId && conn.toCityId === toCityId
    );
    
    if (directConnection) {
      result.push(directConnection);
    } else {
      // If no direct connection found, add a "normal" speed fallback
      result.push({
        fromCityId,
        toCityId,
        speed: 'normal'
      });
    }
  }
  
  return result;
}; 