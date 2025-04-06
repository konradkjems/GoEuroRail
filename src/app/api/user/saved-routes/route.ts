import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { authMiddleware, AuthUser } from '@/lib/auth';
import mongoose from 'mongoose';

// Get all saved routes for current user
export async function GET(req: NextRequest): Promise<NextResponse> {
  return authMiddleware(req, async (req: NextRequest, user: AuthUser) => {
    try {
      await connectDB();
      
      // Find user and populate saved routes
      const userDoc = await User.findById(user.userId)
        .populate({
          path: 'saved_routes',
          select: 'trip_name start_date end_date cities transport_modes total_distance total_duration budget_estimate'
        });
      
      if (!userDoc) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ savedRoutes: userDoc.saved_routes });
    } catch (error) {
      console.error('Get saved routes error:', error);
      return NextResponse.json(
        { error: 'Failed to retrieve saved routes' },
        { status: 500 }
      );
    }
  });
}

// Add a route to saved routes
export async function POST(req: NextRequest): Promise<NextResponse> {
  return authMiddleware(req, async (req: NextRequest, user: AuthUser) => {
    try {
      await connectDB();
      
      const { routeId } = await req.json();
      
      if (!routeId) {
        return NextResponse.json(
          { error: 'Route ID is required' },
          { status: 400 }
        );
      }
      
      // Check if route already saved
      const userDoc = await User.findById(user.userId);
      
      if (!userDoc) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      
      // Convert routeId to ObjectId
      const routeObjectId = new mongoose.Types.ObjectId(routeId);
      
      // Check if route is already saved
      if (userDoc.saved_routes.includes(routeObjectId)) {
        return NextResponse.json(
          { error: 'Route already saved' },
          { status: 400 }
        );
      }
      
      // Add route to saved routes
      userDoc.saved_routes.push(routeObjectId);
      await userDoc.save();
      
      return NextResponse.json({ 
        message: 'Route saved successfully',
        savedRoutes: userDoc.saved_routes
      });
    } catch (error) {
      console.error('Save route error:', error);
      return NextResponse.json(
        { error: 'Failed to save route' },
        { status: 500 }
      );
    }
  });
}

// Remove a route from saved routes
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  return authMiddleware(req, async (req: NextRequest, user: AuthUser) => {
    try {
      await connectDB();
      
      // Get route ID from URL
      const url = new URL(req.url);
      const routeId = url.searchParams.get('routeId');
      
      if (!routeId) {
        return NextResponse.json(
          { error: 'Route ID is required' },
          { status: 400 }
        );
      }
      
      // Find user
      const userDoc = await User.findById(user.userId);
      
      if (!userDoc) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      
      // Convert routeId to ObjectId
      const routeObjectId = new mongoose.Types.ObjectId(routeId);
      
      // Remove route from saved routes
      userDoc.saved_routes = userDoc.saved_routes.filter(
        (id: mongoose.Types.ObjectId) => !id.equals(routeObjectId)
      );
      
      await userDoc.save();
      
      return NextResponse.json({
        message: 'Route removed successfully',
        savedRoutes: userDoc.saved_routes
      });
    } catch (error) {
      console.error('Remove saved route error:', error);
      return NextResponse.json(
        { error: 'Failed to remove saved route' },
        { status: 500 }
      );
    }
  });
} 