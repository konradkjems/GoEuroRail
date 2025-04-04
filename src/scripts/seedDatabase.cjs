require('dotenv').config();
const mongoose = require('mongoose');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

// Simple mapping of countries to regions
const countryToRegion = {
  'France': 'Western Europe',
  'Germany': 'Central Europe',
  'Italy': 'Southern Europe',
  'Spain': 'Southern Europe',
  'Portugal': 'Southern Europe',
  'United Kingdom': 'Western Europe',
  'Ireland': 'Western Europe',
  'Netherlands': 'Western Europe',
  'Belgium': 'Western Europe',
  'Luxembourg': 'Western Europe',
  'Switzerland': 'Central Europe',
  'Austria': 'Central Europe',
  'Czech Republic': 'Central Europe',
  'Poland': 'Central Europe',
  'Slovakia': 'Central Europe',
  'Hungary': 'Central Europe',
  'Slovenia': 'Central Europe',
  'Croatia': 'Southern Europe',
  'Bosnia and Herzegovina': 'Southern Europe',
  'Serbia': 'Southern Europe',
  'Montenegro': 'Southern Europe',
  'Albania': 'Southern Europe',
  'North Macedonia': 'Southern Europe',
  'Greece': 'Southern Europe',
  'Bulgaria': 'Eastern Europe',
  'Romania': 'Eastern Europe',
  'Moldova': 'Eastern Europe',
  'Ukraine': 'Eastern Europe',
  'Belarus': 'Eastern Europe',
  'Lithuania': 'Northern Europe',
  'Latvia': 'Northern Europe',
  'Estonia': 'Northern Europe',
  'Finland': 'Northern Europe',
  'Sweden': 'Northern Europe',
  'Norway': 'Northern Europe',
  'Denmark': 'Northern Europe',
  'Iceland': 'Northern Europe'
};

// European country codes
const europeanCountryCodes = new Set([
  'AL', 'AD', 'AT', 'BY', 'BE', 'BA', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE',
  'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IE', 'IT', 'LV', 'LI', 'LT', 'LU',
  'MT', 'MD', 'MC', 'ME', 'NL', 'MK', 'NO', 'PL', 'PT', 'RO', 'RU', 'SM',
  'RS', 'SK', 'SI', 'ES', 'SE', 'CH', 'UA', 'GB', 'VA'
]);

// Function to get timezone from coordinates (simplified version)
const getTimezoneFromCoordinates = (lat, lng) => {
  const hourOffset = Math.round(lng / 15);
  
  if (lat > 35 && lat < 70) { // Rough boundaries for Europe
    if (hourOffset <= 0) return 'Europe/London';
    if (hourOffset === 1) return 'Europe/Paris';
    if (hourOffset === 2) return 'Europe/Berlin';
    if (hourOffset === 3) return 'Europe/Moscow';
  }
  
  return 'Europe/London'; // Default fallback
};

// Define City schema
const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  station_codes: [{
    type: String,
    trim: true
  }],
  timezone: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  image_url: {
    type: String,
    trim: true
  },
  population: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const City = mongoose.model('City', citySchema);

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing cities
    await City.deleteMany({});
    console.log('Cleared existing cities');

    // Set up a promise to read and process the CSV file
    const cities = [];
    const csvFilePath = path.join(__dirname, '../../dist/datasets/geonames-all-cities-with-a-population-10000.csv');

    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
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
          // Filter for European cities
          if (europeanCountryCodes.has(row.country_code)) {
            // Parse coordinates from the "lat, lng" format
            const [lat, lng] = row.coordinates.split(',').map(coord => parseFloat(coord.trim()));
            
            const cityDoc = {
              name: row.name,
              country: row.country_name,
              latitude: lat,
              longitude: lng,
              station_codes: [],
              timezone: row.timezone || getTimezoneFromCoordinates(lat, lng),
              region: countryToRegion[row.country_name] || 'Other',
              description: `${row.name} is a city in ${row.country_name}.`,
              image_url: '',
              population: parseInt(row.population)
            };
            cities.push(cityDoc);
          }
        })
        .on('end', () => {
          console.log(`Processed ${cities.length} cities from CSV`);
          resolve();
        })
        .on('error', reject);
    });

    // Sort cities by population (descending)
    cities.sort((a, b) => b.population - a.population);

    // Insert cities in batches of 100
    const batchSize = 100;
    for (let i = 0; i < cities.length; i += batchSize) {
      const batch = cities.slice(i, i + batchSize);
      await City.insertMany(batch);
      console.log(`Inserted cities ${i + 1} to ${Math.min(i + batchSize, cities.length)}`);
    }

    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase(); 