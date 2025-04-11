import { FormTrip } from '@/types';

// Cache to store generated itineraries and reduce API calls
const itineraryCache = new Map<string, { itinerary: string; timestamp: number }>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

interface GenerateItineraryParams {
  trip: FormTrip;
  attractions: Record<string, any[]>;
  weather: Record<string, any>;
  budgetLevel: string;
  additionalNotes?: string;
  specificRecommendations?: {
    food?: boolean;
    culturalActivities?: boolean;
    nightlife?: boolean;
    shopping?: boolean;
    outdoorActivities?: boolean;
    familyFriendly?: boolean;
    budgetConsciousTips?: boolean;
    historicalSites?: boolean;
    localExperiences?: boolean;
  };
}

/**
 * Generate a detailed text itinerary using Deepseek AI
 */
export async function generateTextItinerary(params: GenerateItineraryParams): Promise<string> {
  const { 
    trip, 
    attractions, 
    weather, 
    budgetLevel, 
    additionalNotes,
    specificRecommendations
  } = params;
  
  // Create a cache key based on the trip details without using id
  const cacheKey = JSON.stringify({
    tripName: trip.name,
    stops: trip.stops.map(stop => ({
      cityId: stop.cityId,
      arrivalDate: stop.arrivalDate,
      departureDate: stop.departureDate
    })),
    version: '1.0', // Increment this when the prompt changes significantly
    budgetLevel,
    additionalNotes,
    specificRecommendations
  });
  
  // Check if we have a cached response
  const cachedResponse = itineraryCache.get(cacheKey);
  if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_DURATION) {
    console.log('Using cached itinerary response');
    return cachedResponse.itinerary;
  }
  
  try {
    // Build the API request to Deepseek
    const response = await fetch('/api/ai/generate-itinerary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        trip,
        attractions,
        weather,
        budgetLevel,
        additionalNotes,
        specificRecommendations
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(`Failed to generate itinerary: ${errorData?.error || response.statusText}`);
    }
    
    const data = await response.json();
    
    // Cache the successful response
    itineraryCache.set(cacheKey, {
      itinerary: data.itinerary,
      timestamp: Date.now()
    });
    
    return data.itinerary;
  } catch (error) {
    console.error('Error in generateTextItinerary:', error);
    throw error;
  }
}

// Export cleanup function to clear cache if needed
export function clearItineraryCache(): void {
  itineraryCache.clear();
} 