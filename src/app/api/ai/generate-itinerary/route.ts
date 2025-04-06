import { NextRequest, NextResponse } from 'next/server';
import { FormTrip } from '@/types';
import { cities } from '@/lib/cities';

// Define the structure of the request body
interface GenerateItineraryRequest {
  trip: FormTrip;
  attractions: Record<string, any[]>;
  weather: Record<string, any>;
  budgetLevel: string;
  additionalNotes?: string;
}

export async function POST(req: NextRequest) {
  try {
    // Parse the request
    const data: GenerateItineraryRequest = await req.json();
    const { trip, attractions, weather, budgetLevel, additionalNotes } = data;
    
    if (!trip || !trip.stops || trip.stops.length === 0) {
      return NextResponse.json({ error: 'Invalid trip data' }, { status: 400 });
    }

    // Prepare the prompt for the AI
    const prompt = generatePrompt(trip, attractions, weather, budgetLevel, additionalNotes);
    
    // Call DeepSeek AI API - In production, this would be a call to an actual API
    // This is a placeholder for demonstration purposes
    const itinerary = await generateItineraryWithAI(prompt);
    
    // Return the generated itinerary
    return NextResponse.json({
      itinerary,
      tripName: trip.name,
      startDate: trip.startDate,
      endDate: trip.endDate
    });
  } catch (error) {
    console.error('Error generating itinerary:', error);
    return NextResponse.json(
      { error: 'Failed to generate itinerary' }, 
      { status: 500 }
    );
  }
}

// Helper function to generate a prompt for the AI
function generatePrompt(
  trip: FormTrip, 
  attractions: Record<string, any[]>, 
  weather: Record<string, any>,
  budgetLevel: string,
  additionalNotes?: string
): string {
  // Format the trip details for the prompt
  const tripStops = trip.stops.map(stop => {
    const city = cities.find(c => c.id === stop.cityId);
    if (!city) return null;
    
    const cityAttractions = attractions[city.name] || [];
    const weatherInfo = weather[city.name] || {};
    
    return {
      city: city.name,
      country: city.country,
      arrivalDate: stop.arrivalDate,
      departureDate: stop.departureDate,
      nights: stop.nights || 1,
      isStopover: stop.isStopover,
      attractions: cityAttractions,
      weather: weatherInfo
    };
  }).filter(Boolean) as {
    city: string;
    country: string;
    arrivalDate: string;
    departureDate: string;
    nights: number;
    isStopover: boolean;
    attractions: any[];
    weather: any;
  }[];

  // Build the prompt
  return `
Generate a detailed travel itinerary for a European rail trip with the following details:

Trip Name: ${trip.name}
Dates: ${trip.startDate} to ${trip.endDate}
Number of Travelers: ${trip.travelers || 1}
Budget Level: ${budgetLevel}

Itinerary:
${tripStops.map((stop, index) => `
Stop ${index + 1}: ${stop.city}, ${stop.country}
Arrival: ${stop.arrivalDate}
Departure: ${stop.departureDate}
Duration: ${stop.nights} night(s)
${stop.isStopover ? '(This is a short stopover)' : ''}

Recommended attractions:
${stop.attractions.map(a => `- ${a.name}: ${a.description}`).join('\n')}

Weather: ${JSON.stringify(stop.weather)}
`).join('\n')}

${additionalNotes ? `Additional Notes: ${additionalNotes}` : ''}

Please create a comprehensive day-by-day itinerary including:
1. Detailed day plans with morning, afternoon, and evening activities
2. Restaurant recommendations for each city (breakfast, lunch, dinner)
3. Cultural tips and local customs to be aware of
4. Practical travel advice for each location
5. Alternative activities in case of bad weather
6. Budget-friendly tips appropriate for a ${budgetLevel} traveler
7. Transportation recommendations between attractions
8. Unique or off-the-beaten-path experiences

Format the itinerary as a professional travel document with clear sections for each day and city.
`;
}

// This function would call the actual DeepSeek AI API in production
async function generateItineraryWithAI(prompt: string): Promise<string> {
  // In a production environment, this would call the DeepSeek AI API
  // For now, we'll return a placeholder response
  
  // Simulate API delay - reduced from 2000ms to 500ms
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return a sample itinerary
  return `# ${prompt.split('\n')[2].replace('Trip Name: ', '')} - Travel Itinerary

## Trip Overview
- **Dates**: ${prompt.split('\n')[3].replace('Dates: ', '')}
- **Duration**: ${prompt.match(/Duration: (\d+) night/g)?.length || 0} nights
- **Travelers**: ${prompt.split('\n')[4].replace('Number of Travelers: ', '')}
- **Budget Level**: ${prompt.split('\n')[5].replace('Budget Level: ', '')}

## Destination Highlights
${prompt.match(/Stop \d+: (.*?),/g)?.map(city => `- ${city.replace('Stop ', '').replace(':', '')}`).join('\n') || ''}

## Daily Itinerary

${generateSampleItinerary(prompt)}

## Practical Information

### Packing Tips
- Comfortable walking shoes for city exploration
- Weather-appropriate clothing
- Universal power adapter
- Rail pass and travel documents
- Reusable water bottle

### Safety Tips
- Keep valuables secure, especially in crowded tourist areas
- Register with your country's travel advisory service
- Have emergency contacts readily available
- Purchase travel insurance
- Make digital copies of important documents

### Transportation Tips
- Arrive at train stations 20-30 minutes before departure
- Validate tickets before boarding where required
- Download local transportation apps in advance
- Consider city passes that include public transportation

Enjoy your European adventure!
`;
}

// Helper function to generate a sample itinerary based on the prompt
function generateSampleItinerary(prompt: string): string {
  const cityMatches = prompt.match(/Stop \d+: (.*?), (.*?)\nArrival: (.*?)\nDeparture: (.*?)\nDuration: (.*?) night/g);
  
  if (!cityMatches) return 'No destinations found in the itinerary.';
  
  // Limit the number of days generated to avoid timeouts
  const MAX_CITIES = 8;
  const MAX_DAYS_PER_CITY = 2;
  
  return cityMatches.slice(0, MAX_CITIES).map((cityBlock, index) => {
    const cityMatch = cityBlock.match(/Stop \d+: (.*?), (.*?)\nArrival: (.*?)\nDeparture: (.*?)\nDuration: (.*?) night/);
    if (!cityMatch) return '';
    
    const [, city, country, arrival, departure, nights] = cityMatch;
    const isStopover = cityBlock.includes('(This is a short stopover)');
    const daysCount = Math.min(parseInt(nights), MAX_DAYS_PER_CITY);
    
    if (isStopover) {
      return `### Day ${index + 1}: ${city}, ${country} (Stopover)
**Date**: ${arrival}

#### Morning
- Arrive at ${city} train station
- Store luggage at the station lockers
- Visit the main square for a quick orientation

#### Afternoon
- Visit the main attraction: Cathedral or Main Museum
- Lunch at a local restaurant
- Quick souvenir shopping

#### Evening
- Return to the train station
- Depart for next destination
`;
    }
    
    let itinerary = `### Days ${index + 1}-${index + daysCount}: ${city}, ${country}
**Dates**: ${arrival} to ${departure}

`;

    for (let day = 1; day <= daysCount; day++) {
      itinerary += `#### Day ${index + day}: Exploring ${city}

**Morning**
- Breakfast at local café
- Visit ${city} main attraction

**Afternoon**
- Lunch at local restaurant
- Visit a museum or relax in a park

**Evening**
- Dinner with local cuisine
- Evening walk or entertainment

`;
    }
    
    return itinerary;
  }).join('\n');
}

export const maxDuration = 60; // 60 seconds maximum for Vercel Hobby plan 