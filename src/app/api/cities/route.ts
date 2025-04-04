import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/config/database';
import City from '@/models/City';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '1000');
    const country = searchParams.get('country');
    const region = searchParams.get('region');
    const minPopulation = parseInt(searchParams.get('minPopulation') || '0');

    await connectToDatabase();

    // Build query based on filters
    const query: any = {};
    
    // Only add population filter if it's greater than 0
    if (minPopulation > 0) {
      query.population = { $gte: minPopulation };
    }
    
    if (country) query.country = country;
    if (region) query.region = region;

    // Get total count for pagination
    const total = await City.countDocuments(query);

    // Fetch cities with pagination
    const cities = await City.find(query, {
      _id: 1,
      name: 1,
      country: 1,
      latitude: 1,
      longitude: 1,
      region: 1,
      station_codes: 1,
      population: 1
    })
    .sort({ population: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean(); // Convert to plain JavaScript objects

    // Log some debug information
    console.log(`Fetched ${cities.length} cities with query:`, query);
    if (cities.length > 0) {
      console.log('Sample city:', cities[0]);
    }

    return NextResponse.json({
      cities,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cities', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 