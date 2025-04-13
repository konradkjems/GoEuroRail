import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

// Get the directory name correctly in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/goeurotrail';

// Simple connection function since we don't have the TypeScript version
async function connectDB() {
  return mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

// Define City model directly in this file
const citySchema = new mongoose.Schema({
  name: String,
  country: String,
  latitude: Number,
  longitude: Number,
  region: String,
  population: Number
});

// Define the model (only if it doesn't exist)
const City = mongoose.models.City || mongoose.model('City', citySchema);

// Define the countries we want to remove
const COUNTRIES_TO_REMOVE = ['Russia', 'Russian Federation', 'Belarus', 'Ukraine'];

async function deleteEasternEuropeanCities() {
  console.log('Starting deletion of cities from Russia, Belarus, and Ukraine...');
  
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('Connected to MongoDB');
    
    // First find how many cities we have from these countries
    const countBefore = await City.countDocuments({
      country: { $in: COUNTRIES_TO_REMOVE }
    });
    
    console.log(`Found ${countBefore} cities from Russia, Belarus, and Ukraine`);
    
    // Delete the cities
    const result = await City.deleteMany({
      country: { $in: COUNTRIES_TO_REMOVE }
    });
    
    console.log(`Deleted ${result.deletedCount} cities from Russia, Belarus, and Ukraine`);
    
    // Also update the cities.ts file if it exists
    try {
      const citiesFilePath = path.join(__dirname, '../lib/cities.ts');
      const citiesContent = await fs.readFile(citiesFilePath, 'utf-8');
      
      // Extract the cities array
      const match = citiesContent.match(/export const cities: City\[\] = (\[[\s\S]*\]);/);
      
      if (match && match[1]) {
        const citiesArray = JSON.parse(match[1]);
        
        // Filter out Russian, Belarusian, and Ukrainian cities
        const filteredCities = citiesArray.filter(
          (city) => !COUNTRIES_TO_REMOVE.includes(city.country)
        );
        
        console.log(`Removed ${citiesArray.length - filteredCities.length} cities from cities.ts file`);
        
        // Write the filtered cities back to the file
        const newContent = `import { City } from '@/types';

export const cities: City[] = ${JSON.stringify(filteredCities, null, 2)};`;
        
        await fs.writeFile(citiesFilePath, newContent, 'utf-8');
        console.log('Updated cities.ts file successfully');
      } else {
        console.error('Could not parse cities.ts file format');
      }
    } catch (err) {
      console.error('Error updating cities.ts file:', err);
    }
    
    console.log('Operation completed successfully');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  }
}

// Run the function
deleteEasternEuropeanCities(); 