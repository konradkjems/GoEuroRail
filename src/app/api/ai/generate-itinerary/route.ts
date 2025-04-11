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

export async function POST(req: NextRequest) {
  try {
    // Parse the request
    const data: GenerateItineraryRequest = await req.json();
    const { 
      trip, 
      attractions, 
      weather, 
      budgetLevel, 
      additionalNotes,
      specificRecommendations 
    } = data;
    
    if (!trip || !trip.stops || trip.stops.length === 0) {
      return NextResponse.json({ error: 'Invalid trip data' }, { status: 400 });
    }

    // Prepare the prompt for the AI
    const prompt = generatePrompt(
      trip, 
      attractions, 
      weather, 
      budgetLevel, 
      additionalNotes,
      specificRecommendations
    );
    
    // Call DeepSeek AI API
    const itinerary = await generateItineraryWithDeepseek(prompt);
    
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
  additionalNotes?: string,
  specificRecommendations?: GenerateItineraryRequest['specificRecommendations']
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

  // Build specialized recommendations section based on user preferences
  let specializedSection = '';
  if (specificRecommendations) {
    const recommendationTypes = [];
    
    if (specificRecommendations.food) {
      recommendationTypes.push('- Detailed food recommendations including local specialties, good restaurants for each meal (breakfast, lunch, dinner), and culinary experiences with specific venue names');
    }
    
    if (specificRecommendations.culturalActivities) {
      recommendationTypes.push('- Cultural activities such as museums, galleries, theaters, and local festivals with opening hours and ticket information');
    }
    
    if (specificRecommendations.nightlife) {
      recommendationTypes.push('- Nightlife options including bars, clubs, and evening entertainment with specific venues and their ambiance');
    }
    
    if (specificRecommendations.shopping) {
      recommendationTypes.push('- Shopping recommendations like local markets, boutiques, and specialty stores with their specialties and opening hours');
    }
    
    if (specificRecommendations.outdoorActivities) {
      recommendationTypes.push('- Outdoor activities and natural attractions like hiking, parks, and scenic views with specific trails and viewpoints');
    }
    
    if (specificRecommendations.familyFriendly) {
      recommendationTypes.push('- Family-friendly activities and attractions suitable for all ages with specific recommendations for children');
    }
    
    if (specificRecommendations.budgetConsciousTips) {
      recommendationTypes.push('- Budget-conscious tips for saving money while still enjoying the experience, including free attractions and discount opportunities');
    }
    
    if (specificRecommendations.historicalSites) {
      recommendationTypes.push('- Historical sites, architecture, and heritage locations with their significance and interesting historical facts');
    }
    
    if (specificRecommendations.localExperiences) {
      recommendationTypes.push('- Authentic local experiences that go beyond typical tourist activities, including interactions with locals and hidden gems');
    }
    
    if (recommendationTypes.length > 0) {
      specializedSection = `
Please provide specialized recommendations including:
${recommendationTypes.join('\n')}
`;
    }
  }

  // Calculate total number of cities and nights
  const totalCities = tripStops.length;
  const totalNights = tripStops.reduce((sum, stop) => sum + stop.nights, 0);

  // Build the main prompt
  return `
Generate a detailed travel itinerary for a European rail trip with the following details:

Trip Name: ${trip.name}
Dates: ${trip.startDate} to ${trip.endDate}
Number of Travelers: ${trip.travelers || 1}
Budget Level: ${budgetLevel}
Total Cities: ${totalCities}
Total Nights: ${totalNights}

Itinerary:
${tripStops.map((stop, index) => `
Stop ${index + 1}: ${stop.city}, ${stop.country}
Arrival: ${stop.arrivalDate}
Departure: ${stop.departureDate}
Duration: ${stop.nights} night(s)
${stop.isStopover ? '(This is a short stopover)' : ''}

Recommended attractions:
${stop.attractions.map(a => `- ${a.name}: ${a.description}`).join('\n')}

Weather: Average temperature ${stop.weather.temp}°C, ${stop.weather.condition}
`).join('\n')}

${specializedSection}

${additionalNotes ? `Additional Notes: ${additionalNotes}` : ''}

Please create a comprehensive day-by-day itinerary including:
1. Detailed day plans with morning, afternoon, and evening activities for EACH city with equal depth
2. Restaurant recommendations for each city with specific venue names (breakfast, lunch, dinner)
3. Cultural tips and local customs to be aware of
4. Practical travel advice for each location
5. Alternative activities in case of bad weather
6. Budget-friendly tips appropriate for a ${budgetLevel} traveler
7. Transportation recommendations between attractions
8. Unique or off-the-beaten-path experiences

IMPORTANT GUIDELINES:
- Create fully detailed itineraries for ALL cities, not just the first few
- Every city should have a complete day-by-day plan with similar level of detail
- Include specific timing suggestions for activities (e.g., "9:00 AM: Visit...")
- Name actual venues, restaurants, and attractions - avoid generic suggestions
- For longer stays (3+ nights), cover different aspects of the city on different days
- Format the itinerary as a professional travel document with clear sections for each day and city
- Use markdown formatting with headings, bullet points, and emphasis where appropriate

Remember that travelers need specific, actionable information they can follow for their entire trip.
`;
}

// Deepseek AI API call function
async function generateItineraryWithDeepseek(prompt: string): Promise<string> {
  const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
  
  if (!DEEPSEEK_API_KEY) {
    console.warn('Deepseek API Key not found, using fallback generation');
    return generateFallbackItinerary(prompt);
  }
  
  try {
    const systemPrompt = `You are an expert travel planner with deep knowledge of European destinations, rail travel, cultural experiences, and local recommendations. 
Your task is to create detailed, personalized travel itineraries with thoughtful recommendations.

IMPORTANT GUIDELINES:
1. Create a COMPREHENSIVE itinerary with EQUAL detail for EACH city in the trip
2. For each city, provide at least 1-2 full days of detailed planning with morning, afternoon, and evening activities
3. Include specific restaurant recommendations for each meal
4. Name actual venues, attractions, and places - avoid generic suggestions
5. Provide practical information about transportation between attractions
6. If weather is mentioned, include alternative indoor activities for rainy days
7. Format your response using markdown with headers, subheaders, and bullet points
8. DO NOT abbreviate or skip any part of the itinerary - every day for every city must be fully planned
9. Include specific timing suggestions (e.g., "9:00 AM: Visit...")
10. For trips with many cities, ensure the same level of detail for ALL cities, not just the first few

Remember that travelers need specific, actionable information they can follow for their entire trip.`;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 8000, // Increased token limit for longer, more detailed responses
        top_p: 0.95
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Deepseek API error:', errorData);
      return generateFallbackItinerary(prompt);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling Deepseek API:', error);
    return generateFallbackItinerary(prompt);
  }
}

// Fallback function for when the API call fails
function generateFallbackItinerary(prompt: string): string {
  // Extract trip name
  const tripNameMatch = prompt.match(/Trip Name: (.*?)$/m);
  const tripName = tripNameMatch ? tripNameMatch[1] : 'European Rail Adventure';
  
  // Extract dates
  const datesMatch = prompt.match(/Dates: (.*?) to (.*?)$/m);
  const startDate = datesMatch ? datesMatch[1] : 'Start Date';
  const endDate = datesMatch ? datesMatch[2] : 'End Date';
  
  // Extract budget level
  const budgetMatch = prompt.match(/Budget Level: (.*?)$/m);
  const budgetLevel = budgetMatch ? budgetMatch[1] : 'moderate';
  
  // Extract cities and their details more comprehensively
  const cityBlocks = prompt.match(/Stop \d+: [\s\S]*?(?=Stop \d+:|$)/g) || [];
  const cities = cityBlocks.map(block => {
    const cityMatch = block.match(/Stop \d+: (.*?), (.*?)\nArrival: (.*?)\nDeparture: (.*?)\nDuration: (.*?) night/);
    if (!cityMatch) return { name: 'Unknown City', country: '', nights: 2, isStopover: false, attractions: [] };
    
    const [, name, country, arrival, departure, nights] = cityMatch;
    const isStopover = block.includes('(This is a short stopover)');
    const attractions = block.match(/- (.*?): (.*?)(?:\n|$)/g) || [];
    
    return {
      name,
      country,
      arrival,
      departure,
      nights: parseInt(nights),
      isStopover,
      attractions: attractions.map(attr => {
        const match = attr.match(/- (.*?): (.*?)(?:\n|$)/);
        return match ? { name: match[1], description: match[2] } : { name: '', description: '' };
      }).filter(a => a.name)
    };
  });
  
  // Extract special recommendations
  const hasFood = prompt.includes('food recommendations');
  const hasCulturalActivities = prompt.includes('Cultural activities');
  const hasNightlife = prompt.includes('Nightlife options');
  const hasShopping = prompt.includes('Shopping recommendations');
  const hasOutdoorActivities = prompt.includes('Outdoor activities');
  const hasFamilyFriendly = prompt.includes('Family-friendly activities');
  const hasBudgetTips = prompt.includes('Budget-conscious tips');
  const hasHistoricalSites = prompt.includes('Historical sites');
  const hasLocalExperiences = prompt.includes('Authentic local experiences');
  
  // Generate a complete sample itinerary with the extracted information
  return `# ${tripName} - Travel Itinerary

## Trip Overview
- **Dates**: ${startDate} to ${endDate}
- **Budget Level**: ${budgetLevel} 
- **Destinations**: ${cities.map(city => city.name).join(', ')}

## Trip Highlights
${cities.map(city => `- Explore ${city.name}, ${city.country} (${city.nights} night${city.nights > 1 ? 's' : ''})`).join('\n')}

## Daily Itinerary

${cities.map((city, cityIndex) => {
  // For stopovers, just one day
  if (city.isStopover) {
    const mainAttraction = city.attractions && city.attractions.length > 0 
      ? city.attractions[0]?.name 
      : 'Cathedral or Main Museum';
      
    return `
### Day ${cityIndex + 1}: ${city.name}, ${city.country} (Stopover)
**Date**: ${city.arrival}

#### Morning (8:00 AM - 12:00 PM)
- 8:00 AM: Arrive at ${city.name} train station
- 8:30 AM: Store luggage at the station lockers
- 9:00 AM: Enjoy breakfast at a café near the train station
- 10:00 AM: Visit the main square for orientation and photos
- 11:00 AM: Explore the central area with a quick walking tour

#### Afternoon (12:00 PM - 6:00 PM)
- 12:30 PM: Lunch at a local restaurant serving traditional ${city.country} cuisine
- 2:00 PM: Visit the main attraction: ${mainAttraction}
- 3:30 PM: Quick shopping for souvenirs at the local market
- 5:00 PM: Relaxing coffee break at a scenic café

#### Evening (6:00 PM - Departure)
- 6:30 PM: Dinner near the train station
- 8:00 PM: Depart for next destination
`;
  }
  
  // For regular cities, generate detailed itinerary for each day
  let cityItinerary = `
### ${city.name}, ${city.country}
**Dates**: ${city.arrival} to ${city.departure}
**Duration**: ${city.nights} night${city.nights > 1 ? 's' : ''}

`;

  // Generate day-by-day itinerary for this city
  for (let day = 1; day <= city.nights; day++) {
    // Safe way to get attraction names
    const getAttractionName = (index: number) => {
      if (!city.attractions || city.attractions.length === 0) {
        return `${city.name}'s main attraction`;
      }
      
      const safeIndex = index % city.attractions.length;
      return city.attractions[safeIndex]?.name || `${city.name}'s main attraction`;
    };
    
    cityItinerary += `
#### Day ${cityIndex + day}: Exploring ${city.name} - Day ${day}

**Morning (8:00 AM - 12:00 PM)**
- 8:00 AM: Breakfast at ${['a local café', 'your hotel', 'a bakery in the old town'][day % 3]}
- 9:30 AM: Visit ${getAttractionName(day)}
- 11:00 AM: Explore the ${['historical district', 'cultural quarter', 'central market'][day % 3]}

**Afternoon (12:00 PM - 6:00 PM)**
- 12:30 PM: Lunch at ${['a traditional restaurant', 'a cozy bistro', 'a popular local eatery'][day % 3]}
- 2:00 PM: Visit ${getAttractionName(day + 1)}
- 4:00 PM: ${['Shopping at local boutiques', 'Relax at a public park', 'Take a guided walking tour'][day % 3]}

**Evening (6:00 PM - 10:00 PM)**
- 7:00 PM: Dinner at ${['a highly-rated restaurant', 'a family-owned tavern', 'a trendy neighborhood spot'][day % 3]}
- 9:00 PM: ${['Evening walk along the riverfront', 'Attend a local performance', 'Enjoy the nightlife district'][day % 3]}
`;
  }
  
  // Add special sections based on requested recommendations
  if (hasFood) {
    cityItinerary += `
#### Restaurant Recommendations in ${city.name}
- **Breakfast**: ${['Local Café', 'Traditional Bakery', 'Hotel Breakfast'][cityIndex % 3]} - Try the local specialties
- **Lunch**: ${['Central Market Eatery', 'Historic District Restaurant', 'Neighborhood Bistro'][cityIndex % 3]} - Authentic cuisine with moderate prices
- **Dinner**: ${['Fine Dining Experience', 'Traditional Tavern', 'Family Restaurant'][cityIndex % 3]} - Reservation recommended
- **Local Specialties**: Don't miss trying the regional dishes like ${['local stew', 'traditional pastries', 'seasonal specialties'][cityIndex % 3]}
`;
  }
  
  if (hasCulturalActivities) {
    cityItinerary += `
#### Cultural Activities in ${city.name}
- Visit the ${['City Museum', 'National Gallery', 'Historical Museum'][cityIndex % 3]} (Open 9 AM - 5 PM)
- Attend a performance at the ${['Opera House', 'Cultural Center', 'Historic Theater'][cityIndex % 3]}
- Explore the ${['Old Town', 'Arts District', 'Cultural Quarter'][cityIndex % 3]}
`;
  }
  
  if (hasOutdoorActivities) {
    cityItinerary += `
#### Outdoor Activities in ${city.name}
- Walk through the beautiful ${['City Park', 'Botanical Gardens', 'Riverside Promenade'][cityIndex % 3]}
- Take a ${['bike tour', 'walking tour', 'boat tour'][cityIndex % 3]} of the city
- Visit the scenic ${['viewpoint', 'hilltop area', 'natural reserve'][cityIndex % 3]} for amazing photos
`;
  }

  return cityItinerary;
}).join('\n')}

## Practical Information

### Packing Tips
- Comfortable walking shoes for city exploration
- Weather-appropriate clothing (check forecast before departure)
- Universal power adapter with European plugs
- Rail pass and travel documents in a secure pouch
- Reusable water bottle to stay hydrated and reduce plastic waste
- Small daypack for daily excursions
- Medications and personal items

### Safety Tips
- Keep valuables secure, especially in crowded tourist areas
- Use hotel safes for important documents and extra cash
- Register with your country's travel advisory service
- Save emergency contacts including local embassy information
- Purchase comprehensive travel insurance
- Make digital copies of important documents
- Be aware of common scams in tourist areas

### Transportation Tips
- Arrive at train stations 20-30 minutes before departure
- Validate tickets before boarding where required
- Download local transportation apps for each city
- Consider multi-day city passes that include public transportation
- Be mindful of strike information which can affect rail service
- For regional trains, reservations may not be required but are recommended
- Keep your rail pass accessible for conductor inspections

### Budget Tips for ${budgetLevel} Travelers
- Consider picnic lunches from local markets to save on meal costs
- Many museums offer free or discounted entry on specific days
- Take advantage of city tourist cards for bundled savings
- Use public transportation instead of taxis when possible
- Look for prix fixe lunch menus which are often better value than dinner
- Stay in accommodations slightly outside city centers for better rates
- Take advantage of free walking tours (but remember to tip your guide)

${hasLocalExperiences ? `
### Authentic Local Experiences
- Shop at morning markets where locals buy fresh produce
- Take a cooking class to learn regional specialties
- Attend local festivals or events happening during your visit
- Visit neighborhood cafés away from tourist centers
- Learn a few phrases in the local language to enhance interactions
` : ''}

Enjoy your European adventure!
`;
}

export const maxDuration = 60; // 60 seconds maximum for Vercel Hobby plan 