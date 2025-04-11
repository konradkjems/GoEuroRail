import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Trip from '@/models/Trip';
import { authMiddleware, AuthUser } from '@/lib/auth';
import mongoose from 'mongoose';

// Share a trip with other users
export async function POST(req: NextRequest): Promise<NextResponse> {
  return authMiddleware(req, async (req: NextRequest, user: AuthUser) => {
    try {
      await connectDB();
      
      const { tripId, shareWithEmails, accessLevel } = await req.json();
      
      if (!tripId || !shareWithEmails || !Array.isArray(shareWithEmails)) {
        return NextResponse.json(
          { error: 'Invalid request parameters' },
          { status: 400 }
        );
      }
      
      // Find the trip and verify ownership
      const trip = await Trip.findById(tripId);
      if (!trip) {
        return NextResponse.json(
          { error: 'Trip not found' },
          { status: 404 }
        );
      }
      
      if (trip.user_id.toString() !== user.userId) {
        return NextResponse.json(
          { error: 'Unauthorized to share this trip' },
          { status: 403 }
        );
      }
      
      // Update trip with sharing information
      const sharedWith = shareWithEmails.map(email => ({
        email,
        accessLevel: accessLevel || 'view',
        sharedAt: new Date()
      }));
      
      trip.shared_with = sharedWith;
      await trip.save();
      
      return NextResponse.json({
        message: 'Trip shared successfully',
        sharedWith
      });
    } catch (error) {
      console.error('Error sharing trip:', error);
      return NextResponse.json(
        { error: 'Failed to share trip' },
        { status: 500 }
      );
    }
  });
}

// Get shared trips for current user
export async function GET(req: NextRequest): Promise<NextResponse> {
  return authMiddleware(req, async (req: NextRequest, user: AuthUser) => {
    try {
      await connectDB();
      
      // Find trips shared with the current user
      const sharedTrips = await Trip.find({
        'shared_with.email': user.email
      }).populate('user_id', 'email')
        .select('trip_name start_date end_date cities shared_with');
      
      return NextResponse.json({ sharedTrips });
    } catch (error) {
      console.error('Error fetching shared trips:', error);
      return NextResponse.json(
        { error: 'Failed to fetch shared trips' },
        { status: 500 }
      );
    }
  });
} 