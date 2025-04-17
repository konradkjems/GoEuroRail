import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';

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

interface CsvRow {
  'Geoname ID': string;
  'Name': string;
  'Country Code': string;
  'Country name EN': string;
  'Population': string;
  'Coordinates': string;
}

// Countries to exclude
const excludedCountries = new Set(['RU', 'BY', 'MD']);

const europeanCountryCodes = new Set([
  'AL', 'AD', 'AT', 'BE', 'BA', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE',
  'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IE', 'IT', 'LV', 'LI', 'LT', 'LU',
  'MT', 'MC', 'ME', 'NL', 'MK', 'NO', 'PL', 'PT', 'RO', 'SM',
  'RS', 'SK', 'SI', 'ES', 'SE', 'CH', 'GB', 'VA'
]);

// Map countries to regions
const countryToRegion: { [key: string]: string } = {
  'FR': 'Western Europe',
  'DE': 'Western Europe',
  'BE': 'Western Europe',
  'NL': 'Western Europe',
  'LU': 'Western Europe',
  'GB': 'Western Europe',
  'IE': 'Western Europe',
  
  'PL': 'Eastern Europe',
  'RO': 'Eastern Europe',
  
  'NO': 'Northern Europe',
  'SE': 'Northern Europe',
  'FI': 'Northern Europe',
  'DK': 'Northern Europe',
  'IS': 'Northern Europe',
  'EE': 'Northern Europe',
  'LV': 'Northern Europe',
  'LT': 'Northern Europe',
  
  'ES': 'Southern Europe',
  'PT': 'Southern Europe',
  'IT': 'Southern Europe',
  'GR': 'Southern Europe',
  'HR': 'Southern Europe',
  'RS': 'Southern Europe',
  'BA': 'Southern Europe',
  'ME': 'Southern Europe',
  'MK': 'Southern Europe',
  'AL': 'Southern Europe',
  
  'AT': 'Central Europe',
  'CH': 'Central Europe',
  'CZ': 'Central Europe',
  'SK': 'Central Europe',
  'HU': 'Central Europe',
  'SI': 'Central Europe'
};

const cities: CityData[] = [];

fs.createReadStream(path.join(__dirname, '../../data/cities.csv'))
  .pipe(csv({ separator: ';' }))
  .on('data', (row: CsvRow) => {
    // Check if the city is in Europe and not in excluded countries
    if (europeanCountryCodes.has(row['Country Code']) && !excludedCountries.has(row['Country Code'])) {
      // Parse coordinates from the dataset format
      const coordinates = row['Coordinates'].split(',').map(coord => parseFloat(coord.trim()));
      
      if (coordinates.length === 2 && !isNaN(coordinates[0]) && !isNaN(coordinates[1])) {
        const region = countryToRegion[row['Country Code']] || 'Other';
        const population = parseInt(row['Population'], 10) || 0;
        
        // Determine city size based on population
        let size: 'small' | 'medium' | 'large' = 'small';
        if (population > 1000000) {
          size = 'large';
        } else if (population > 500000) {
          size = 'medium';
        }
        
        // Determine if it's a transport hub (major cities)
        const isTransportHub = population > 1000000 || [
          'paris', 'london', 'berlin', 'amsterdam', 'brussels', 'frankfurt',
          'munich', 'zurich', 'milan', 'rome', 'barcelona', 'madrid',
          'vienna', 'prague', 'warsaw', 'budapest', 'copenhagen', 'stockholm',
          'oslo', 'helsinki'
        ].includes(row['Name'].toLowerCase());
        
        cities.push({
          id: row['Name'].toLowerCase().replace(/\s+/g, '-'),
          name: row['Name'],
          country: row['Country name EN'],
          coordinates: {
            lat: coordinates[0],
            lng: coordinates[1]
          },
          region: region,
          population: population,
          isTransportHub,
          size
        });
      }
    }
  })
  .on('end', () => {
    // Sort cities by population (descending)
    cities.sort((a, b) => b.population - a.population);

    // Take top cities
    const topCities = cities.slice(0, 1000);

    // Save to TypeScript file
    const output = `import { City } from '@/types';

const citiesData = ${JSON.stringify(topCities, null, 2)};

export const cities: readonly City[] = citiesData as unknown as City[];
export default cities;`;

    fs.writeFileSync(
      path.join(__dirname, '../lib/cities.ts'),
      output,
      'utf-8'
    );

    console.log(`Generated cities.ts with ${topCities.length} European cities (excluding Russian Federation, Belarus, and Moldova)`);
  }); 