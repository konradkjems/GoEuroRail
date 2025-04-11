import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Trip from '@/models/Trip';
import mongoose from 'mongoose';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    await connectDB();
    
    const { id } = params;
    
    // Find trip by share token
    const trip = await Trip.findOne({
      $or: [
        { _id: id, is_public: true },
        { share_token: id }
      ]
    }).populate('cities.city', 'name country latitude longitude')
      .select('-shared_with -user_id');
    
    if (!trip) {
      return NextResponse.json(
        { error: 'Trip not found or not publicly accessible' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ trip });
  } catch (error) {
    console.error('Error fetching public trip:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trip' },
      { status: 500 }
    );
  }
} 