import { connectToDatabase } from '../config/database.js';
import { City } from '../models/index.js';
import mongoose from 'mongoose';

const deleteRussianCities = async () => {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    console.log('Connected to MongoDB');

    // Delete all cities from Russian Federation
    const result = await City.deleteMany({ country: 'Russian Federation' });
    console.log(`Deleted ${result.deletedCount} Russian cities from the database`);

    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error deleting Russian cities:', error);
    process.exit(1);
  }
};

// Run the script
deleteRussianCities(); 