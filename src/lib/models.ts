// This file ensures all models are registered with mongoose
// Import all models here to prevent "Schema hasn't been registered for model" errors

// Import models
import User from '@/models/User';
import City from '@/models/City';
import Trip from '@/models/Trip';
import Connection from '@/models/Connection';
import Attraction from '@/models/Attraction';
import mongoose from 'mongoose';

// Export models so they can be imported elsewhere if needed
export {
  User,
  City,
  Trip,
  Connection,
  Attraction
};

// This function does nothing but ensures the models are imported
export function ensureModelsRegistered() {
  // This function is called to ensure all models are registered
  // Add any additional models here
  if (!mongoose.models.User) {
    require('../models/User');
  }
}

export default ensureModelsRegistered; 