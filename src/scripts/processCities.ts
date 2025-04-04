const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

interface CityData {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  region: string;
  population: number;
}

interface CsvRow {
  ASCII_Name: string;
  Country_Code: string;
  Country_name_EN: string;
  Coordinates: string;
  Population_2021: string;
}

const europeanCountryCodes = new Set([
  'AL', 'AD', 'AT', 'BY', 'BE', 'BA', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE',
  'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IE', 'IT', 'LV', 'LI', 'LT', 'LU',
  'MT', 'MD', 'MC', 'ME', 'NL', 'MK', 'NO', 'PL', 'PT', 'RO', 'RU', 'SM',
  'RS', 'SK', 'SI', 'ES', 'SE', 'CH', 'UA', 'GB', 'VA'
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

const cities: CityData[] = [];

fs.createReadStream(path.join(__dirname, '../../data/geonames-all-cities-with-a-population-10000-csv.csv'))
  .pipe(csv({ separator: ';' }))
  .on('data', (row: CsvRow) => {
    // Check if the city is in Europe
    if (europeanCountryCodes.has(row.Country_Code)) {
      // Parse coordinates from the dataset format
      const coordinates = row.Coordinates.split(',').map((coord: string) => parseFloat(coord.trim()));
      
      if (coordinates.length === 2 && !isNaN(coordinates[0]) && !isNaN(coordinates[1])) {
        const region = countryToRegion[row.Country_Code] || 'Other';
        
        cities.push({
          id: row.ASCII_Name.toLowerCase().replace(/\s+/g, '-'),
          name: row.ASCII_Name,
          country: row.Country_name_EN,
          latitude: coordinates[0],
          longitude: coordinates[1],
          region: region,
          population: parseInt(row.Population_2021, 10) || 0
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

export const cities: City[] = ${JSON.stringify(topCities, null, 2)};`;

    fs.writeFileSync(
      path.join(__dirname, '../lib/cities.ts'),
      output,
      'utf-8'
    );

    console.log(`Generated cities.ts with ${topCities.length} European cities`);
  }); 