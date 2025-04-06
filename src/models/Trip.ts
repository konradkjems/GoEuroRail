import mongoose from 'mongoose';
import { ITrip } from '../types/models';

const cityVisitSchema = new mongoose.Schema({
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: true
  },
  arrival: {
    type: Date,
    required: true
  },
  departure: {
    type: Date,
    required: true
  }
}, { _id: false });

const tripSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trip_name: {
    type: String,
    required: true,
    trim: true
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  cities: [cityVisitSchema],
  transport_modes: [{
    type: String,
    enum: ['train', 'bus', 'ferry'],
    required: true
  }],
  total_distance: {
    type: Number,
    required: true,
    min: 0
  },
  total_duration: {
    type: Number,
    required: true,
    min: 0
  },
  budget_estimate: {
    type: Number,
    required: true,
    min: 0
  },
  travel_notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Validate that end_date is after start_date
tripSchema.pre('save', function(next) {
  if (this.end_date <= this.start_date) {
    next(new Error('End date must be after start date'));
  }
  next();
});

// Validate that city visit dates are within trip dates
tripSchema.pre('save', function(next) {
  const validDates = this.cities.every(visit => {
    return visit.arrival >= this.start_date && 
           visit.departure <= this.end_date &&
           visit.departure > visit.arrival;
  });

  if (!validDates) {
    next(new Error('City visit dates must be within trip dates and departure must be after arrival'));
  }
  next();
});

// Check if the model exists before creating a new one
// This prevents "Cannot overwrite model" errors during hot reload in development
const Trip = mongoose.models.Trip || mongoose.model<ITrip>('Trip', tripSchema);

export default Trip; 