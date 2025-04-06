import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';

// Set a timeout constant
const DB_TIMEOUT = 20000; // Increased from 10 to 20 seconds

export const dynamic = 'force-dynamic'; // Disable caching for this route

export async function POST(request: NextRequest) {
  try {
    // Try to connect to the database with timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database connection timeout')), DB_TIMEOUT)
    );
    
    await Promise.race([connectDB(), timeoutPromise]);
    
    // Parse request body
    const { email, password, homeCity, preferences } = await request.json();
    
    // Log registration attempt (without sensitive data)
    console.log(`Registration attempt for email: ${email.substring(0, 3)}****`);
    
    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      console.log(`Registration failed: User with email ${email.substring(0, 3)}**** already exists`);
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }
    
    // Validate homeCity as ObjectId if provided
    let homeCityObjectId = null;
    if (homeCity) {
      if (!mongoose.Types.ObjectId.isValid(homeCity)) {
        return NextResponse.json(
          { error: 'Invalid home city ID format' },
          { status: 400 }
        );
      }
      homeCityObjectId = new mongoose.Types.ObjectId(homeCity);
    }
    
    // Create user data object
    const userData = {
      email,
      password,
      home_city: homeCityObjectId,
      travel_preferences: {
        prefer_night_trains: preferences?.preferNightTrains || false,
        scenic_routes: preferences?.scenicRoutes || false,
        low_budget: preferences?.lowBudget || false
      },
      interrail_pass_type: preferences?.interrailPassType || 'none',
      language: preferences?.language || 'en',
      notifications_enabled: preferences?.notificationsEnabled ?? true
    };
    
    // Create and save user without using transactions
    const user = new User(userData);
    await user.save();
    
    console.log(`User successfully registered: ${email.substring(0, 3)}****`);
    
    // Return user without password
    const userWithoutPassword = {
      id: user._id,
      email: user.email,
      homeCity: user.home_city,
      travelPreferences: user.travel_preferences,
      interrailPassType: user.interrail_pass_type,
      language: user.language,
      notificationsEnabled: user.notifications_enabled,
      createdAt: user.createdAt
    };
    
    return NextResponse.json({ user: userWithoutPassword }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Check for specific errors
    if (error instanceof mongoose.Error.ValidationError) {
      console.error('Validation error:', error.message);
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 }
      );
    }
    
    if (error instanceof Error) {
      if (error.message === 'Database connection timeout') {
        console.error('Database connection timeout error');
        return NextResponse.json(
          { error: 'Database connection timeout', message: 'Please try again later' },
          { status: 504 }
        );
      }
      
      console.error('Error message:', error.message);
      return NextResponse.json(
        { error: 'Registration failed', message: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Registration failed', message: 'Unknown error' },
      { status: 500 }
    );
  }
} 