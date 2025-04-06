import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, password, homeCity, preferences } = await request.json();
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }
    
    // Create new user
    const user = new User({
      email,
      password,
      home_city: homeCity ? new mongoose.Types.ObjectId(homeCity) : null,
      travel_preferences: {
        prefer_night_trains: preferences?.preferNightTrains || false,
        scenic_routes: preferences?.scenicRoutes || false,
        low_budget: preferences?.lowBudget || false
      },
      interrail_pass_type: preferences?.interrailPassType || 'none',
      language: preferences?.language || 'en',
      notifications_enabled: preferences?.notificationsEnabled ?? true
    });
    
    await user.save();
    
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
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
} 