import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface CityData {
  id: string;
  name: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  region: string;
  population: number;
  isTransportHub: boolean;
  size: 'small' | 'medium' | 'large';
}

// Countries to exclude
const excludedCountries = ['Russian Federation', 'Moldova', 'Belarus'];

try {
  // Read the current cities file
  const citiesPath = path.join(__dirname, '../lib/cities.ts');
  const citiesContent = fs.readFileSync(citiesPath, 'utf-8');

  // Extract and parse the cities array
  const match = citiesContent.match(/const citiesData = (\[[\s\S]*\]);/);
  if (!match) {
    console.error('Could not find cities array in cities.ts');
    process.exit(1);
  }

  const cities = JSON.parse(match[1]);
  
  // Filter out cities from excluded countries
  const filteredCities = cities.filter((city: CityData) => !excludedCountries.includes(city.country));
  
  // Generate new file content
  const newContent = `import { City } from '@/types';

const citiesData = ${JSON.stringify(filteredCities, null, 2)};

export const cities: readonly City[] = citiesData as unknown as City[];
export default cities;`;
  
  // Write back to the file
  fs.writeFileSync(citiesPath, newContent, 'utf-8');
  
  console.log(`Removed cities from ${excludedCountries.join(', ')}`);
  console.log(`Cities reduced from ${cities.length} to ${filteredCities.length}`);
  
} catch (error) {
  console.error('Error processing cities:', error);
  process.exit(1);
} 