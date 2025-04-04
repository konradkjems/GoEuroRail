import dotenv from 'dotenv';
import { connectToDatabase } from '../config/database.js';
import { City } from '../models/index.js';
import { cities } from '../lib/cities.js';
import { getTimezoneFromCoordinates } from '../lib/utils.js';

dotenv.config();

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

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    console.log('Connected to MongoDB');

    // Clear existing cities
    await City.deleteMany({});
    console.log('Cleared existing cities');

    // Transform and insert cities
    const cityDocuments = cities.map(city => ({
      name: city.name,
      country: city.country,
      latitude: city.coordinates.lat,
      longitude: city.coordinates.lng,
      station_codes: [], // To be filled later with actual station codes
      timezone: getTimezoneFromCoordinates(city.coordinates.lat, city.coordinates.lng),
      region: countryToRegion[city.country] || 'Other',
      description: `${city.name} is a city in ${city.country}.`,
      image_url: '' // To be filled later with actual images
    }));

    // Insert cities in batches of 100
    const batchSize = 100;
    for (let i = 0; i < cityDocuments.length; i += batchSize) {
      const batch = cityDocuments.slice(i, i + batchSize);
      await City.insertMany(batch);
      console.log(`Inserted cities ${i + 1} to ${Math.min(i + batchSize, cityDocuments.length)}`);
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