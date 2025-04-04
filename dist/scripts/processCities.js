"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const url_1 = require("url");
const path_1 = require("path");
const csv_parser_1 = __importDefault(require("csv-parser"));
const __filename = (0, url_1.fileURLToPath)(import.meta.url);
const __dirname = (0, path_1.dirname)(__filename);
const europeanCountryCodes = new Set([
    'AL', 'AD', 'AT', 'BY', 'BE', 'BA', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE',
    'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IE', 'IT', 'LV', 'LI', 'LT', 'LU',
    'MT', 'MD', 'MC', 'ME', 'NL', 'MK', 'NO', 'PL', 'PT', 'RO', 'RU', 'SM',
    'RS', 'SK', 'SI', 'ES', 'SE', 'CH', 'UA', 'GB', 'VA'
]);
const cities = [];
(0, fs_1.createReadStream)('../../cities /geonames-all-cities-with-a-population-1000@public.csv')
    .pipe((0, csv_parser_1.default)({
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
        // Parse coordinates from the "lat, lng" format
        const [lat, lng] = row.coordinates.split(',').map((coord) => parseFloat(coord.trim()));
        cities.push({
            id: row.geonameid,
            name: row.name,
            country: row.country_name,
            coordinates: {
                lat,
                lng
            },
            population: parseInt(row.population, 10)
        });
    }
})
    .on('end', () => {
    // Sort cities by population (descending)
    cities.sort((a, b) => b.population - a.population);
    // Take top 1000 cities and remove population field
    const topCities = cities.slice(0, 1000).map(({ population, ...rest }) => rest);
    // Generate the cities.ts file
    const output = `import { City } from '@/types';

export const cities: City[] = ${JSON.stringify(topCities, null, 2)};`;
    (0, fs_1.writeFileSync)((0, path_1.join)(__dirname, '../lib/cities.ts'), output, 'utf-8');
    console.log(`Generated cities.ts with ${topCities.length} European cities`);
});
//# sourceMappingURL=processCities.js.map