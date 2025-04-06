import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { authMiddleware, AuthUser } from '@/lib/auth';

async function handler(req: NextRequest, user: AuthUser): Promise<NextResponse> {
  try {
    await connectDB();
    
    // Find user by ID
    const userDoc = await User.findById(user.userId)
      .select('-password') // Exclude password
      .populate('home_city') // Populate home city reference
      .populate({
        path: 'saved_routes',
        select: 'trip_name start_date end_date', // Only include basic trip info
      });
    
    if (!userDoc) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Format user data
    const userData = {
      id: userDoc._id,
      email: userDoc.email,
      homeCity: userDoc.home_city,
      savedRoutes: userDoc.saved_routes,
      travelPreferences: {
        preferNightTrains: userDoc.travel_preferences.prefer_night_trains,
        scenicRoutes: userDoc.travel_preferences.scenic_routes,
        lowBudget: userDoc.travel_preferences.low_budget
      },
      interrailPassType: userDoc.interrail_pass_type,
      language: userDoc.language,
      notificationsEnabled: userDoc.notifications_enabled,
      createdAt: userDoc.createdAt
    };
    
    return NextResponse.json({ user: userData });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve user profile' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  return authMiddleware(req, handler);
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  return authMiddleware(req, async (req: NextRequest, user: AuthUser) => {
    try {
      await connectDB();
      
      const { 
        email, 
        homeCity, 
        travelPreferences, 
        interrailPassType, 
        language, 
        notificationsEnabled 
      } = await req.json();
      
      // Find user and update
      const updatedUser = await User.findByIdAndUpdate(
        user.userId,
        {
          email,
          home_city: homeCity,
          travel_preferences: {
            prefer_night_trains: travelPreferences?.preferNightTrains,
            scenic_routes: travelPreferences?.scenicRoutes,
            low_budget: travelPreferences?.lowBudget
          },
          interrail_pass_type: interrailPassType,
          language,
          notifications_enabled: notificationsEnabled
        },
        // Return updated document and run validators
        { new: true, runValidators: true }
      )
      .select('-password')
      .populate('home_city')
      .populate({
        path: 'saved_routes',
        select: 'trip_name start_date end_date',
      });
      
      if (!updatedUser) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      
      // Format user data
      const userData = {
        id: updatedUser._id,
        email: updatedUser.email,
        homeCity: updatedUser.home_city,
        savedRoutes: updatedUser.saved_routes,
        travelPreferences: {
          preferNightTrains: updatedUser.travel_preferences.prefer_night_trains,
          scenicRoutes: updatedUser.travel_preferences.scenic_routes,
          lowBudget: updatedUser.travel_preferences.low_budget
        },
        interrailPassType: updatedUser.interrail_pass_type,
        language: updatedUser.language,
        notificationsEnabled: updatedUser.notifications_enabled,
        updatedAt: updatedUser.updatedAt
      };
      
      return NextResponse.json({ user: userData });
    } catch (error) {
      console.error('Update profile error:', error);
      return NextResponse.json(
        { error: 'Failed to update user profile' },
        { status: 500 }
      );
    }
  });
} 