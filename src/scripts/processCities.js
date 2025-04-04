import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const europeanCountryCodes = new Set([
  'AL', 'AD', 'AT', 'BY', 'BE', 'BA', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE',
  'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IE', 'IT', 'LV', 'LI', 'LT', 'LU',
  'MT', 'MD', 'MC', 'ME', 'NL', 'MK', 'NO', 'PL', 'PT', 'RO', 'RU', 'SM',
  'RS', 'SK', 'SI', 'ES', 'SE', 'CH', 'UA', 'GB', 'VA'
]);

const countryToRegion = {
  'FR': 'Western Europe',
  'DE': 'Western Europe',
  'BE': 'Western Europe',
  'NL': 'Western Europe',
  'LU': 'Western Europe',
  'GB': 'Western Europe',
  'IE': 'Western Europe',
  
  'PL': 'Eastern Europe',
  'UA': 'Eastern Europe',
  'BY': 'Eastern Europe',
  'RO': 'Eastern Europe',
  'MD': 'Eastern Europe',
  
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

// Major transport hubs in Europe
const transportHubs = new Set([
  'london', 'paris', 'frankfurt', 'amsterdam', 'berlin', 'munich', 'vienna',
  'zurich', 'milan', 'rome', 'madrid', 'barcelona', 'brussels', 'copenhagen',
  'stockholm', 'oslo', 'helsinki', 'warsaw', 'prague', 'budapest', 'istanbul'
]);

// Function to determine city size based on population
function getCitySize(population) {
  if (population >= 1000000) return 'large';
  if (population >= 250000) return 'medium';
  return 'small';
}

const cities = [];

fs.createReadStream(path.join(__dirname, '../../data/cities.csv'))
  .pipe(csv({ 
    separator: ';',
    headers: [
      'geonameid', 'name', 'ascii_name', 'alternate_names', 'feature_class', 'feature_code',
      'country_code', 'country_name', 'country_code2', 'admin1_code', 'admin2_code',
      'admin3_code', 'admin4_code', 'population', 'elevation', 'dem', 'timezone',
      'modification_date', 'label_en', 'coordinates'
    ]
  }))
  .on('data', (row) => {
    // Check if the city is in Europe
    if (europeanCountryCodes.has(row.country_code)) {
      // Parse coordinates from the dataset format
      const coordinates = row.coordinates.split(',').map(coord => parseFloat(coord.trim()));
      
      if (coordinates.length === 2 && !isNaN(coordinates[0]) && !isNaN(coordinates[1])) {
        const region = countryToRegion[row.country_code] || 'Other';
        const population = parseInt(row.population, 10) || 0;
        const cityId = row.ascii_name.toLowerCase().replace(/\s+/g, '-');
        
        cities.push({
          id: cityId,
          name: row.name,
          country: row.country_name,
          coordinates: {
            lat: coordinates[0],
            lng: coordinates[1]
          },
          region: region,
          population: population,
          isTransportHub: transportHubs.has(cityId),
          size: getCitySize(population)
        });
      }
    }
  })
  .on('end', () => {
    // Sort cities by population (descending)
    cities.sort((a, b) => b.population - a.population);

    console.log(`Found ${cities.length} total European cities`);

    // Take top cities (increased from 1000 to 5000 to show more cities)
    const topCities = cities.slice(0, 5000);

    // Save to TypeScript file
    const output = `import { City } from '@/types';

const citiesData = ${JSON.stringify(topCities, null, 2)};
export const cities: readonly City[] = citiesData as unknown as City[];`;

    fs.writeFileSync(
      path.join(__dirname, '../lib/cities.ts'),
      output,
      'utf-8'
    );

    console.log(`Generated cities.ts with ${topCities.length} European cities`);
  }); 