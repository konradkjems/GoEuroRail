import mongoose from 'mongoose';
import { ICity } from '../types/models';

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
  population: {
    type: Number,
    required: true,
    default: 0
  },
  popular_routes_from: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City'
  }],
  image_url: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Create indexes for common queries
citySchema.index({ name: 1, country: 1 }, { unique: true });
citySchema.index({ region: 1 });
citySchema.index({ latitude: 1, longitude: 1 });
citySchema.index({ population: -1 });

// Check if the model exists before creating a new one
// This prevents "Cannot overwrite model" errors during hot reload in development
const City = mongoose.models.City || mongoose.model<ICity>('City', citySchema);

export default City; 