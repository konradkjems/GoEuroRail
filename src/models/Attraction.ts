import mongoose from 'mongoose';
import { IAttraction } from '../types/models';

const attractionSchema = new mongoose.Schema({
  city_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['museum', 'landmark', 'park', 'restaurant', 'shopping', 'entertainment'],
    trim: true
  },
  coordinates: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  opening_hours: {
    type: String,
    required: true
  },
  entry_fee: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  photo_url: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Create indexes for common queries
attractionSchema.index({ city_id: 1 });
attractionSchema.index({ category: 1 });
attractionSchema.index({ coordinates: '2dsphere' });

// Check if the model exists before creating a new one
// This prevents "Cannot overwrite model" errors during hot reload in development
const Attraction = mongoose.models.Attraction || mongoose.model<IAttraction>('Attraction', attractionSchema);

export default Attraction; 