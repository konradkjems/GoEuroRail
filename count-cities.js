// Simple script to count the cities in cities.ts
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const citiesFile = path.join(__dirname, 'src/lib/cities.ts');
const fileContent = fs.readFileSync(citiesFile, 'utf8');

// Extract the array content
const arrayMatch = fileContent.match(/const citiesData = \[([\s\S]*?)\];/);
if (arrayMatch && arrayMatch[1]) {
  // Count the number of city objects by counting occurrences of "id":
  const cityCount = (arrayMatch[1].match(/"id":/g) || []).length;
  console.log(`Total number of cities: ${cityCount}`);
  
  // Check if Menton is in the list
  const hasMenton = arrayMatch[1].includes('"name": "Menton"');
  console.log(`Contains Menton: ${hasMenton}`);
} else {
  console.log('Could not parse the cities file');
} 