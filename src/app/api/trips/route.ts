import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Trip from '@/models/Trip';
import { authMiddleware } from '@/lib/auth';

// List all trips for the authenticated user
export async function GET(request: NextRequest) {
  return authMiddleware(request, async (user) => {
    try {
      await connectDB();
      
      // Get trips for this user
      const trips = await Trip.find({ user_id: user.userId })
        .sort({ start_date: -1 })
        .lean();
      
      // Transform database format to application format
      const formattedTrips = trips.map(trip => ({
        _id: trip._id.toString(),
        name: trip.trip_name,
        startDate: trip.start_date.toISOString().split('T')[0],
        endDate: trip.end_date.toISOString().split('T')[0],
        notes: trip.travel_notes || '',
        travelers: trip.travelers || 1,
        stops: trip.stops.map(stop => ({
          cityId: stop.cityId,
          arrivalDate: stop.arrivalDate.toISOString().split('T')[0],
          departureDate: stop.departureDate.toISOString().split('T')[0],
          nights: stop.nights || 1,
          isStopover: stop.isStopover || false,
          accommodation: stop.accommodation,
          notes: stop.notes,
          customTransport: stop.customTransport,
          trainDetails: stop.trainDetails,
          useInterrailPass: stop.useInterrailPass || false
        }))
      }));
      
      return NextResponse.json({ trips: formattedTrips });
    } catch (error) {
      console.error('Error fetching trips:', error);
      return NextResponse.json(
        { error: 'Failed to fetch trips' },
        { status: 500 }
      );
    }
  });
}

// Create a new trip
export async function POST(request: NextRequest) {
  return authMiddleware(request, async (user) => {
    try {
      await connectDB();
      
      // Parse the request body
      const tripData = await request.json();
      
      // Create the trip with proper MongoDB schema format
      const newTrip = new Trip({
        user_id: user.userId,
        trip_name: tripData.name,
        start_date: new Date(tripData.startDate),
        end_date: new Date(tripData.endDate),
        travel_notes: tripData.notes || '',
        travelers: tripData.travelers || 1,
        stops: tripData.stops.map(stop => ({
          cityId: stop.cityId,
          arrivalDate: new Date(stop.arrivalDate),
          departureDate: new Date(stop.departureDate),
          nights: stop.nights || 1,
          isStopover: stop.isStopover || false,
          accommodation: stop.accommodation || null,
          notes: stop.notes || null,
          customTransport: stop.customTransport || null,
          trainDetails: stop.trainDetails || null,
          useInterrailPass: stop.useInterrailPass || false
        })),
        transport_modes: ['train'], // Default to train
        total_distance: 0, // Calculate this later if needed
        total_duration: 0, // Calculate this later if needed
        budget_estimate: tripData.budget || 0
      });
      
      await newTrip.save();
      
      return NextResponse.json({
        message: 'Trip created successfully',
        trip: {
          _id: newTrip._id.toString(),
          name: newTrip.trip_name,
          startDate: newTrip.start_date.toISOString().split('T')[0],
          endDate: newTrip.end_date.toISOString().split('T')[0],
          notes: newTrip.travel_notes || '',
          travelers: newTrip.travelers || 1,
          stops: newTrip.stops.map(stop => ({
            cityId: stop.cityId,
            arrivalDate: stop.arrivalDate.toISOString().split('T')[0],
            departureDate: stop.departureDate.toISOString().split('T')[0],
            nights: stop.nights || 1,
            isStopover: stop.isStopover || false,
            accommodation: stop.accommodation,
            notes: stop.notes,
            customTransport: stop.customTransport,
            trainDetails: stop.trainDetails,
            useInterrailPass: stop.useInterrailPass || false
          }))
        }
      });
    } catch (error) {
      console.error('Error creating trip:', error);
      return NextResponse.json(
        { error: 'Failed to create trip', message: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      );
    }
  });
}

// Sync multiple trips (for migrating from localStorage)
export async function PUT(request: NextRequest) {
  return authMiddleware(request, async (user) => {
    try {
      await connectDB();
      
      // Parse the request body
      const { trips } = await request.json();
      
      if (!Array.isArray(trips)) {
        return NextResponse.json(
          { error: 'Invalid request format. Expected an array of trips.' },
          { status: 400 }
        );
      }
      
      const results = await Promise.all(trips.map(async (tripData) => {
        try {
          // Check if the trip already exists
          let existingTrip = null;
          
          if (tripData._id) {
            existingTrip = await Trip.findOne({ 
              _id: tripData._id,
              user_id: user.userId
            });
          }
          
          if (existingTrip) {
            // Update existing trip
            existingTrip.trip_name = tripData.name;
            existingTrip.start_date = new Date(tripData.startDate);
            existingTrip.end_date = new Date(tripData.endDate);
            existingTrip.travel_notes = tripData.notes || '';
            existingTrip.travelers = tripData.travelers || 1;
            existingTrip.stops = tripData.stops.map(stop => ({
              cityId: stop.cityId,
              arrivalDate: new Date(stop.arrivalDate),
              departureDate: new Date(stop.departureDate),
              nights: stop.nights || 1,
              isStopover: stop.isStopover || false,
              accommodation: stop.accommodation || null,
              notes: stop.notes || null,
              customTransport: stop.customTransport || null,
              trainDetails: stop.trainDetails || null,
              useInterrailPass: stop.useInterrailPass || false
            }));
            existingTrip.budget_estimate = tripData.budget || 0;
            
            await existingTrip.save();
            return {
              status: 'updated',
              _id: existingTrip._id.toString(),
              name: existingTrip.trip_name
            };
          } else {
            // Create new trip
            const newTrip = new Trip({
              user_id: user.userId,
              trip_name: tripData.name,
              start_date: new Date(tripData.startDate),
              end_date: new Date(tripData.endDate),
              travel_notes: tripData.notes || '',
              travelers: tripData.travelers || 1,
              stops: tripData.stops.map(stop => ({
                cityId: stop.cityId,
                arrivalDate: new Date(stop.arrivalDate),
                departureDate: new Date(stop.departureDate),
                nights: stop.nights || 1,
                isStopover: stop.isStopover || false,
                accommodation: stop.accommodation || null,
                notes: stop.notes || null,
                customTransport: stop.customTransport || null,
                trainDetails: stop.trainDetails || null,
                useInterrailPass: stop.useInterrailPass || false
              })),
              transport_modes: ['train'], // Default to train
              total_distance: 0, // Calculate this later if needed
              total_duration: 0, // Calculate this later if needed
              budget_estimate: tripData.budget || 0
            });
            
            await newTrip.save();
            return {
              status: 'created',
              _id: newTrip._id.toString(),
              name: newTrip.trip_name
            };
          }
        } catch (error) {
          console.error(`Error syncing trip "${tripData.name}":`, error);
          return {
            status: 'error',
            name: tripData.name,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      }));
      
      return NextResponse.json({
        message: 'Trips synced successfully',
        results
      });
    } catch (error) {
      console.error('Error syncing trips:', error);
      return NextResponse.json(
        { error: 'Failed to sync trips', message: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      );
    }
  });
} 