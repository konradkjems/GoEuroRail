// This file ensures all models are registered with mongoose
// Import all models here to prevent "Schema hasn't been registered for model" errors

// Import models
import User from '@/models/User';
import City from '@/models/City';
import Trip from '@/models/Trip';
import Connection from '@/models/Connection';
import Attraction from '@/models/Attraction';

// Export models so they can be imported elsewhere if needed
export {
  User,
  City,
  Trip,
  Connection,
  Attraction
};

// This function does nothing but ensures the models are imported
export const ensureModelsRegistered = () => {
  // The models are registered when imported above
  // This is just to make eslint happy about "unused" imports
  return {
    User,
    City,
    Trip,
    Connection,
    Attraction
  };
};

export default ensureModelsRegistered; 