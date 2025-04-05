# API Services for GoEuroRail

This directory contains service modules for fetching real-time data from various APIs to enhance the trip planning experience.

## Available Services

### Weather Service

Provides weather forecasts and historical averages for destinations:
- Current forecast for dates within 5 days
- Historical weather averages for dates beyond the forecast window
- Fallback to regional weather data when API is unavailable

```typescript
import { getWeatherForecast } from '@/lib/api';

// Get weather for a specific city and date
const weather = await getWeatherForecast('Paris', '2023-08-15');
```

### Accommodation Service

Fetches hotel, hostel, and apartment options based on search criteria:
- Price filtering
- Accommodation type filtering
- Rating and amenities information

```typescript
import { getAccommodations } from '@/lib/api';

// Search for accommodations
const accommodations = await getAccommodations({
  cityName: 'Rome',
  checkIn: '2023-08-15',
  checkOut: '2023-08-20',
  adults: 2,
  priceMax: 200
});
```

### Attractions Service

Provides points of interest and activities for destinations:
- Museums, landmarks, parks, etc.
- Ratings and visitor information
- Category filtering

```typescript
import { getAttractions } from '@/lib/api';

// Get attractions for a city
const attractions = await getAttractions({
  cityName: 'Amsterdam',
  categories: ['museums', 'landmarks'],
  limit: 10
});
```

### Budget Service

Estimates travel costs based on destination, travel style, and trip duration:
- Accommodation costs
- Food costs
- Local transportation costs
- Attractions and activities costs

```typescript
import { getTripBudget, BudgetCategory } from '@/lib/api';

// Get budget estimation
const budget = await getTripBudget({
  cityName: 'Berlin',
  days: 5,
  travelers: 2,
  preferredCategory: BudgetCategory.MODERATE
});
```

## Setting Up API Keys

To use these services with real APIs, you'll need to obtain API keys from the following providers:

1. **OpenWeatherMap API** - For weather forecasts
   - Sign up at: https://openweathermap.org/api
   - Free tier includes 1,000 API calls per day

2. **RapidAPI Hotels API** - For accommodation data
   - Subscribe at: https://rapidapi.com/apidojo/api/hotels4/
   - Various pricing tiers available

3. **TripAdvisor API** - For attractions and POIs
   - Sign up at: https://developer.tripadvisor.com/
   - Requires application approval

4. **Numbeo API** - For cost of living data (budget estimates)
   - Sign up at: https://www.numbeo.com/api/
   - Free trial available

## Configuration

1. Copy the `.env.local.example` file to `.env.local`
2. Add your API keys to the new `.env.local` file
3. Restart the development server

```
# .env.local example
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_key_here
NEXT_PUBLIC_RAPIDAPI_KEY=your_key_here
NEXT_PUBLIC_RAPIDAPI_HOST=hotels4.p.rapidapi.com
NEXT_PUBLIC_TRIPADVISOR_API_KEY=your_key_here
NEXT_PUBLIC_NUMBEO_API_KEY=your_key_here
```

## Fallback Mechanism

All services include fallback data if the API requests fail. This ensures the application remains functional even without valid API keys or during network issues.

## Caching

Responses are cached to minimize API calls:
- Weather data: 3 hours for forecasts, 7 days for historical data
- Accommodation data: 24 hours
- Attractions data: 24 hours
- Budget data: 7 days

## Error Handling

All services include comprehensive error handling to ensure graceful degradation when APIs are unavailable. 