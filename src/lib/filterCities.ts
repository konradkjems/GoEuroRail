import { cities as allCities } from './cities';
import { missingCities } from './missingCities';
import { City } from '@/types';

// Filter out cities from Russia and Ukraine due to political situation
const filteredCities = allCities.filter(city => 
  city.country !== "Russian Federation" && city.country !== "Ukraine"
);

// Combine filtered cities with missing cities
export const cities: readonly City[] = [...filteredCities, ...missingCities];
export default cities; 