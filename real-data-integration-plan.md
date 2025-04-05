# GoEuroRail Trip Assistant: Real Data Integration Plan

## Overview

This document outlines the plan to replace the current mock data in the Smart Trip Assistant with real data from external APIs. The goal is to transform the assistant into a powerful tool that provides accurate and valuable information to users planning their European rail journeys.

## Current Features Using Mock Data

Currently, the Smart Trip Assistant provides the following features with mock data:
- Weather forecasts
- Budget estimation
- Train pass calculator
- Attraction recommendations
- Accommodation suggestions

## APIs and Data Sources for Integration

### 1. Weather Forecast

**Options:**
- [OpenWeatherMap API](https://openweathermap.org/api)
  - Provides current weather and 5-day forecasts
  - Has free tier (60 calls/minute, 1,000,000 calls/month)
  - Offers historical weather data (premium)
  
- [WeatherAPI.com](https://www.weatherapi.com/)
  - 3-day forecasts in free tier
  - 14-day forecasts in paid tiers
  - Historical weather data available

**Implementation Plan:**
```typescript
// src/lib/api/weatherService.ts
import axios from 'axios';

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function getWeatherForecast(city: string, country: string, date: string) {
  // For dates within 5 days, use forecast API
  const currentDate = new Date();
  const targetDate = new Date(date);
  const daysDifference = Math.floor((targetDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
  
  if (daysDifference <= 5) {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: `${city},${country}`,
        appid: API_KEY,
        units: 'metric'
      }
    });
    
    // Filter for the target date and return formatted forecast
    // ...
    
    return formattedForecast;
  } else {
    // For dates beyond 5 days, use climate averages
    // This could be historical averages or seasonal data
    return getHistoricalWeatherAverages(city, country, targetDate.getMonth());
  }
}

function getHistoricalWeatherAverages(city: string, country: string, month: number) {
  // This could be implemented with a paid API or a database of climate averages
  // ...
}
```

### 2. Accommodation Data

**Options:**
- [Booking.com Affiliate API](https://www.booking.com/affiliate/index.html)
  - Extensive hotel database
  - Requires application for affiliate program
  
- [RapidAPI Hotels API](https://rapidapi.com/apidojo/api/hotels4/)
  - Multiple providers in one interface
  - Pay-per-call pricing

- [Hostelworld API](https://hwdapi.hostelworld.com/)
  - Focused on budget accommodations
  - Good for the target audience of rail travelers

**Implementation Plan:**
```typescript
// src/lib/api/accommodationService.ts
import axios from 'axios';

const API_KEY = process.env.HOSTELWORLD_API_KEY;
const BASE_URL = 'https://api.hostelworld.com/v1';

export async function getAccommodations(city: string, country: string, checkIn: string, checkOut: string, guests: number = 1) {
  try {
    const response = await axios.get(`${BASE_URL}/properties`, {
      params: {
        city: city,
        country: country,
        check_in: checkIn,
        check_out: checkOut,
        guests: guests,
        api_key: API_KEY
      }
    });
    
    return response.data.properties.map(property => ({
      id: property.id,
      name: property.name,
      type: property.type, // hostel, hotel, etc.
      rating: property.rating,
      pricePerNight: property.price_from,
      currency: property.currency,
      location: property.location,
      imageUrl: property.images[0]?.url || null,
      url: property.url
    }));
  } catch (error) {
    console.error('Error fetching accommodations:', error);
    return [];
  }
}
```

### 3. Budget Estimation

**Options:**
- [Numbeo API](https://www.numbeo.com/common/api.jsp)
  - Cost of living data worldwide
  - Requires commercial license
  
- [TripAdvisor Content API](https://developer-tripadvisor.com/content-api/)
  - Hotel and restaurant pricing
  - Application required for access

- [Custom Dataset with Currency Exchange API](https://exchangerate.host/)
  - Build your own dataset of travel costs per city
  - Use free currency exchange APIs to convert to user's currency

**Implementation Plan:**
```typescript
// src/lib/api/budgetService.ts
import axios from 'axios';
import { cities } from '@/lib/cities';

// Cost data could be stored in database or as a static JSON file
import costData from '@/data/travel-costs.json';

const EXCHANGE_API_URL = 'https://api.exchangerate.host/latest';

export async function estimateTripBudget(stops: any[], budget: string, travelers: number = 1) {
  try {
    // Get exchange rates
    const rates = await getExchangeRates();
    
    let totalCost = 0;
    const costBreakdown = [];
    
    for (const stop of stops) {
      const cityData = costData.cities.find(c => c.name === stop.city.name);
      if (!cityData) continue;
      
      const nights = stop.isStopover ? 0 : (stop.nights || 1);
      
      // Calculate accommodation costs
      const accommodationCost = cityData.costs.accommodation[budget] * nights * travelers;
      
      // Calculate food costs
      const foodCost = cityData.costs.food[budget] * (nights || 1) * travelers;
      
      // Calculate activities costs
      const activitiesCost = cityData.costs.activities[budget] * (nights || 1) * travelers;
      
      // Calculate local transport costs
      const localTransportCost = cityData.costs.local_transport * (nights || 1) * travelers;
      
      const stopTotal = accommodationCost + foodCost + activitiesCost + localTransportCost;
      
      costBreakdown.push({
        city: stop.city.name,
        total: stopTotal,
        breakdown: {
          accommodation: accommodationCost,
          food: foodCost,
          activities: activitiesCost,
          localTransport: localTransportCost
        }
      });
      
      totalCost += stopTotal;
    }
    
    // Add train costs if available
    const trainCost = calculateTrainCost(stops);
    if (trainCost > 0) {
      totalCost += trainCost;
    }
    
    return {
      total: totalCost,
      currency: 'EUR',
      breakdown: costBreakdown,
      trainCost
    };
  } catch (error) {
    console.error('Error estimating budget:', error);
    return null;
  }
}

async function getExchangeRates() {
  try {
    const response = await axios.get(EXCHANGE_API_URL);
    return response.data.rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return {};
  }
}

function calculateTrainCost(stops) {
  // Logic to calculate train costs between stops
  // ...
}
```

### 4. Train Pass Calculator

**Options:**
- [Eurail/Interrail Official API](https://www.eurail.com/en/terms-conditions/eurail-api)
  - Direct access to official pass prices and options
  - Requires partnership agreement
  
- [Rail Europe API](https://www.raileurope.com/en/partners)
  - Comprehensive European rail data
  - Partnership required

- [Custom Dataset with Periodic Updates](https://www.interrail.eu/en/interrail-passes)
  - Manually maintained dataset of pass prices and rules
  - Update periodically from the official sites

**Implementation Plan:**
```typescript
// src/lib/api/trainPassService.ts
import passData from '@/data/rail-passes.json';

export function calculateOptimalRailPass(stops, age) {
  // Extract countries
  const countries = new Set(stops.map(stop => stop.city.country));
  
  // Count travel days (days with train journeys)
  const travelDays = calculateTravelDays(stops);
  
  // Get total trip duration
  const tripDuration = calculateTripDuration(stops);
  
  // Calculate individual ticket costs (for comparison)
  const individualTicketCost = calculateIndividualTickets(stops);
  
  // Get applicable passes based on age category
  let ageCategory = 'adult';
  if (age < 28) ageCategory = 'youth';
  if (age < 12) ageCategory = 'child';
  if (age > 59) ageCategory = 'senior';
  
  const applicablePasses = passData.passes
    .filter(pass => pass.ageCategory === ageCategory || pass.ageCategory === 'all')
    .filter(pass => {
      // Filter by validity period
      return pass.validityPeriod >= tripDuration;
    })
    .filter(pass => {
      // Filter by travel days if applicable
      if (pass.type === 'flexi') {
        return pass.travelDays >= travelDays;
      }
      return true;
    })
    .filter(pass => {
      // Filter by countries
      if (pass.coverage === 'global') return true;
      if (pass.coverage === 'oneCountry') {
        return countries.size === 1 && pass.countries.includes([...countries][0]);
      }
      return countries.size <= pass.countries.length;
    });
  
  // Calculate savings for each pass
  const passesWithSavings = applicablePasses.map(pass => ({
    ...pass,
    savings: individualTicketCost - pass.price,
    savingsPercentage: ((individualTicketCost - pass.price) / individualTicketCost) * 100
  }));
  
  // Sort by savings
  const sortedPasses = passesWithSavings.sort((a, b) => b.savings - a.savings);
  
  return {
    travelDays,
    countriesCount: countries.size,
    countries: [...countries],
    tripDuration,
    individualTicketCost,
    recommendedPasses: sortedPasses
  };
}

function calculateTravelDays(stops) {
  // Count days with train journeys
  // ...
}

function calculateTripDuration(stops) {
  // Calculate total trip duration
  // ...
}

function calculateIndividualTickets(stops) {
  // Estimate cost of individual tickets between stops
  // ...
}
```

### 5. Attraction Recommendations

**Options:**
- [Google Places API](https://developers.google.com/maps/documentation/places/web-service/overview)
  - Extensive database of attractions worldwide
  - Includes ratings, photos, and details
  - Pay-per-request pricing
  
- [TripAdvisor Content API](https://developer-tripadvisor.com/content-api/)
  - Detailed attraction data with reviews
  - Application required for access

- [OpenTripMap API](https://opentripmap.io/product)
  - Focuses on travel attractions
  - Has free tier (1000 requests/day)

**Implementation Plan:**
```typescript
// src/lib/api/attractionsService.ts
import axios from 'axios';

const API_KEY = process.env.OPENTRIPMAP_API_KEY;
const BASE_URL = 'https://api.opentripmap.com/0.1/en';

export async function getAttractions(city: string, country: string, categories: string[] = []) {
  try {
    // First, get the location coordinates
    const geoResponse = await axios.get(`${BASE_URL}/places/geoname`, {
      params: {
        name: city,
        country: country,
        apikey: API_KEY
      }
    });
    
    if (!geoResponse.data || !geoResponse.data.lat || !geoResponse.data.lon) {
      throw new Error('Location not found');
    }
    
    const { lat, lon } = geoResponse.data;
    
    // Then, get attractions around this point
    const radius = 5000; // 5km radius
    const limit = 20; // Get top 20 attractions
    
    let url = `${BASE_URL}/places/radius`;
    let params: any = {
      radius,
      limit,
      lat,
      lon,
      apikey: API_KEY,
      rate: 3, // Minimum rating of 3/5
      format: 'json'
    };
    
    // Add categories if specified
    if (categories.length > 0) {
      params.kinds = categories.join(',');
    }
    
    const placesResponse = await axios.get(url, { params });
    
    // For each place, get details
    const attractionsWithDetails = await Promise.all(
      placesResponse.data.slice(0, 10).map(async (place: any) => {
        const detailResponse = await axios.get(`${BASE_URL}/places/xid/${place.xid}`, {
          params: {
            apikey: API_KEY
          }
        });
        
        return {
          id: place.xid,
          name: detailResponse.data.name,
          description: detailResponse.data.wikipedia_extracts?.text || 'No description available',
          address: detailResponse.data.address || {},
          categories: detailResponse.data.kinds?.split(',') || [],
          rating: place.rate,
          coordinates: {
            lat: place.point.lat,
            lng: place.point.lon
          },
          image: detailResponse.data.preview?.source || null,
          website: detailResponse.data.url || null
        };
      })
    );
    
    return attractionsWithDetails;
  } catch (error) {
    console.error('Error fetching attractions:', error);
    return [];
  }
}
```

## Integration Architecture

### 1. API Service Structure

Create a dedicated services directory for API integrations:
```
src/
└── lib/
    └── api/
        ├── weatherService.ts
        ├── accommodationService.ts
        ├── budgetService.ts
        ├── trainPassService.ts
        └── attractionsService.ts
```

### 2. Environment Configuration

Store API keys securely in environment variables:
```
# .env.local
OPENWEATHER_API_KEY=your_key_here
HOSTELWORLD_API_KEY=your_key_here
OPENTRIPMAP_API_KEY=your_key_here
```

### 3. Data Caching Strategy

To minimize API calls and improve performance:

```typescript
// src/lib/cache.ts
import NodeCache from 'node-cache';

// Cache with 1-hour TTL by default
const cache = new NodeCache({ stdTTL: 3600 });

export function getCachedData(key: string) {
  return cache.get(key);
}

export function setCachedData(key: string, data: any, ttl?: number) {
  cache.set(key, data, ttl);
}

export function invalidateCache(keyPattern: string) {
  const keys = cache.keys();
  const matchingKeys = keys.filter(key => key.includes(keyPattern));
  matchingKeys.forEach(key => cache.del(key));
}
```

### 4. Error Handling and Fallbacks

When APIs fail, use fallbacks:

```typescript
// src/lib/api/fallbackService.ts
import mockWeatherData from '@/data/mock-weather-data.json';
import mockAccommodationData from '@/data/mock-accommodation-data.json';
// ... other mock data imports

export function getFallbackWeather(city: string, month: number) {
  // Return mock data for when the API fails
  const regionData = mockWeatherData.regions.find(r => 
    r.cities.some(c => c.name.toLowerCase() === city.toLowerCase())
  );
  
  if (!regionData) return mockWeatherData.regions[0].cities[0].months[month];
  
  const cityData = regionData.cities.find(c => 
    c.name.toLowerCase() === city.toLowerCase()
  );
  
  return cityData?.months[month] || mockWeatherData.regions[0].cities[0].months[month];
}

// ... other fallback functions
```

## Implementation Steps

### Phase 1: API Research and Selection
1. Evaluate API options for each feature
2. Test free tiers and sample data
3. Create accounts and obtain API keys
4. Document API limitations and pricing

### Phase 2: Core Service Implementation
1. Create basic service modules for each API
2. Implement error handling and fallbacks
3. Add caching layer
4. Write tests for each service

### Phase 3: UI Integration
1. Update SmartTripAssistant component to use real data
2. Add loading states during API calls
3. Implement error messaging for users
4. Ensure mobile responsiveness with real data

### Phase 4: Performance Optimization
1. Implement request batching where possible
2. Add server-side prefetching for common queries
3. Optimize caching strategies
4. Add analytics to monitor API usage

## Budget and Resource Considerations

### API Costs
| API | Free Tier | Paid Tier (Estimated) | Notes |
|-----|-----------|------------------------|-------|
| OpenWeatherMap | 1M calls/month | $40/month (10M calls) | Weather forecast data |
| Hostelworld | Limited | Custom pricing | Accommodation data |
| Exchange Rate API | 1K calls/month | $10/month (100K calls) | Currency conversion |
| OpenTripMap | 1K calls/day | $50/month (unlimited) | Attraction data |

### Development Resources
- Backend Developer: 1-2 weeks for API integration
- Frontend Developer: 1 week for UI updates
- QA Engineer: 2-3 days for testing

## Conclusion

Replacing mock data with real API data will significantly enhance the value of the GoEuroRail Smart Trip Assistant. By following this integration plan, we can systematically implement each API while ensuring fallbacks are in place for a seamless user experience. The resulting product will provide users with accurate, real-time information to help them plan their European rail adventures with confidence. 