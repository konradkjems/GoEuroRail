// Export all API services
export * from './weatherService';
export * from './accommodationService';
export * from './attractionsService';
export * from './budgetService';
export * from './getYourGuideService';
export * from './deepseekService';

/**
 * This file exports all our API services that provide real data
 * to the Smart Trip Assistant. 
 * 
 * Each service includes:
 * - Data fetching with typed responses
 * - Error handling with fallbacks
 * - Caching to reduce API calls
 * 
 * All services follow a similar pattern:
 * 1. Check cache for data
 * 2. If not cached, fetch from API
 * 3. If API fails, use fallback data
 * 4. Cache successful responses
 */

/**
 * To use these services in your components:
 * 
 * import { getWeatherForecast, getAccommodations, getAttractions, getTripBudget } from '@/lib/api';
 * 
 * // Then call the respective function with appropriate parameters
 * const weather = await getWeatherForecast('Paris', '2023-07-15');
 */ 