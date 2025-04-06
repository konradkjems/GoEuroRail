import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types/models';

// Define the user schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  home_city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: false
  },
  saved_routes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip'
  }],
  travel_preferences: {
    prefer_night_trains: {
      type: Boolean,
      default: false
    },
    scenic_routes: {
      type: Boolean,
      default: false
    },
    low_budget: {
      type: Boolean,
      default: false
    }
  },
  interrail_pass_type: {
    type: String,
    enum: ['continuous', 'flexi', 'none'],
    default: 'none'
  },
  language: {
    type: String,
    enum: ['en', 'de', 'fr', 'es', 'it'],
    default: 'en'
  },
  notifications_enabled: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare password for login
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Check if the model exists before creating a new one
// This prevents "Cannot overwrite model" errors during hot reload in development
const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User; 