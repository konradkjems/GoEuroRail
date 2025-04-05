import axios from 'axios';
import { getCachedData, setCachedData } from '../cache';

// OpenWeatherMap API configuration
const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || 'your_default_api_key';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Weather forecast data structure
 */
export interface WeatherForecast {
  cityName: string;
  date: string;
  temp: {
    day: number;
    min: number;
    max: number;
  };
  condition: string;
  icon: string;
  rainLevel: string; // 'none', 'light', 'moderate', 'heavy'
}

/**
 * Get weather forecast for a specific location and date
 * @param cityName Name of the city
 * @param date Date for the forecast (or date range)
 * @returns Promise with weather forecast data
 */
export async function getWeatherForecast(cityName: string, date: string): Promise<WeatherForecast> {
  // Create a cache key based on city name and date
  const cacheKey = `weather:${cityName}:${date}`;
  
  // Check if we have cached data
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    console.log(`Using cached weather data for ${cityName} on ${date}`);
    return cachedData;
  }
  
  try {
    // Check if the date is within 5 days (we can use the forecast API)
    const targetDate = new Date(date);
    const now = new Date();
    const daysDifference = Math.floor((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    let weatherData: WeatherForecast;
    
    if (daysDifference >= 0 && daysDifference <= 5) {
      // Use 5-day forecast API for near future
      weatherData = await getForecastFromAPI(cityName, targetDate);
    } else {
      // For dates beyond 5 days or in the past, use historical averages
      weatherData = await getHistoricalWeatherAverages(cityName, targetDate);
    }
    
    // Cache the data (for 3 hours if it's current forecast, 7 days if it's historical)
    const cacheTTL = daysDifference >= 0 && daysDifference <= 5 ? 3 * 60 * 60 : 7 * 24 * 60 * 60;
    setCachedData(cacheKey, weatherData, cacheTTL);
    
    return weatherData;
  } catch (error) {
    console.error(`Error fetching weather data for ${cityName}:`, error);
    // Fall back to approximate data if the API call fails
    return getFallbackWeatherData(cityName, new Date(date));
  }
}

/**
 * Get forecast data from OpenWeatherMap API
 */
async function getForecastFromAPI(cityName: string, date: Date): Promise<WeatherForecast> {
  const url = `${BASE_URL}/forecast?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric`;
  
  const response = await axios.get(url);
  const data = response.data as {
    list: Array<{
      dt: number;
      main: {
        temp: number;
        temp_min: number;
        temp_max: number;
      };
      weather: Array<{
        id: number;
        icon: string;
      }>;
      rain?: {
        '3h'?: number;
      };
    }>;
  };
  
  // Find the forecast entry closest to the target date
  const targetTimestamp = date.getTime();
  let closestForecast = data.list[0];
  let smallestDifference = Infinity;
  
  for (const forecast of data.list) {
    const forecastTime = new Date(forecast.dt * 1000).getTime();
    const difference = Math.abs(forecastTime - targetTimestamp);
    
    if (difference < smallestDifference) {
      smallestDifference = difference;
      closestForecast = forecast;
    }
  }
  
  return formatForecastData(cityName, closestForecast, date);
}

/**
 * Format API response into our WeatherForecast structure
 */
function formatForecastData(cityName: string, forecastData: any, date: Date): WeatherForecast {
  // Map OpenWeatherMap condition codes to our simplified conditions
  const getCondition = (id: number): string => {
    if (id >= 200 && id < 300) return 'thunderstorm';
    if (id >= 300 && id < 400) return 'drizzle';
    if (id >= 500 && id < 600) return 'rain';
    if (id >= 600 && id < 700) return 'snow';
    if (id >= 700 && id < 800) return 'mist';
    if (id === 800) return 'clear';
    if (id > 800) return 'clouds';
    return 'unknown';
  };
  
  // Determine rain level based on precipitation volume or weather code
  const getRainLevel = (data: any): string => {
    const rainVolume = data.rain && data.rain['3h'] ? data.rain['3h'] : 0;
    const weatherId = data.weather[0].id;
    
    if (weatherId >= 500 && weatherId < 600) {
      if (weatherId === 500) return 'light';
      if (weatherId === 501) return 'moderate';
      if (weatherId >= 502) return 'heavy';
    }
    
    if (rainVolume === 0) return 'none';
    if (rainVolume < 2) return 'light';
    if (rainVolume < 10) return 'moderate';
    return 'heavy';
  };
  
  const formattedDate = date.toISOString().split('T')[0];
  
  return {
    cityName,
    date: formattedDate,
    temp: {
      day: Math.round(forecastData.main.temp),
      min: Math.round(forecastData.main.temp_min),
      max: Math.round(forecastData.main.temp_max)
    },
    condition: getCondition(forecastData.weather[0].id),
    icon: forecastData.weather[0].icon,
    rainLevel: getRainLevel(forecastData)
  };
}

/**
 * Get historical weather averages for a location and date
 * For dates beyond the 5-day forecast, we would typically use a climate/historical data API
 * This is a simplified implementation
 */
async function getHistoricalWeatherAverages(cityName: string, date: Date): Promise<WeatherForecast> {
  // In a real implementation, we would query a historical weather API
  // For this example, we'll use our fallback data as a proxy for historical averages
  return getFallbackWeatherData(cityName, date);
}

/**
 * Get fallback weather data based on month and rough geographic region
 */
function getFallbackWeatherData(cityName: string, date: Date): WeatherForecast {
  const month = date.getMonth(); // 0-11
  const formattedDate = date.toISOString().split('T')[0];
  
  // Determine region based on city (very simplified)
  let region = 'central';
  
  // Southern Europe cities
  if (['Rome', 'Barcelona', 'Madrid', 'Athens', 'Lisbon', 'Naples'].includes(cityName)) {
    region = 'southern';
  } 
  // Northern Europe cities
  else if (['Stockholm', 'Oslo', 'Helsinki', 'Copenhagen', 'Reykjavik'].includes(cityName)) {
    region = 'northern';
  } 
  // Eastern Europe cities
  else if (['Warsaw', 'Budapest', 'Bucharest', 'Sofia', 'Kyiv', 'Prague'].includes(cityName)) {
    region = 'eastern';
  }
  // Western Europe is the default fallback
  
  // Temperature and conditions by region and month
  const weatherByRegion: Record<string, any[]> = {
    northern: [
      { temp: { day: -5, min: -8, max: -2 }, condition: 'snow', rainLevel: 'light' },  // Jan
      { temp: { day: -4, min: -7, max: -1 }, condition: 'snow', rainLevel: 'light' },  // Feb
      { temp: { day: 0, min: -3, max: 3 }, condition: 'clouds', rainLevel: 'light' },  // Mar
      { temp: { day: 5, min: 2, max: 8 }, condition: 'drizzle', rainLevel: 'moderate' }, // Apr
      { temp: { day: 10, min: 6, max: 14 }, condition: 'clouds', rainLevel: 'light' },  // May
      { temp: { day: 15, min: 10, max: 19 }, condition: 'clear', rainLevel: 'none' },  // Jun
      { temp: { day: 18, min: 13, max: 22 }, condition: 'clear', rainLevel: 'none' },  // Jul
      { temp: { day: 17, min: 12, max: 21 }, condition: 'clear', rainLevel: 'light' },  // Aug
      { temp: { day: 12, min: 8, max: 16 }, condition: 'clouds', rainLevel: 'moderate' }, // Sep
      { temp: { day: 7, min: 4, max: 10 }, condition: 'rain', rainLevel: 'moderate' },  // Oct
      { temp: { day: 2, min: -1, max: 5 }, condition: 'clouds', rainLevel: 'light' },  // Nov
      { temp: { day: -3, min: -6, max: 0 }, condition: 'snow', rainLevel: 'light' }   // Dec
    ],
    southern: [
      { temp: { day: 10, min: 6, max: 14 }, condition: 'clouds', rainLevel: 'moderate' }, // Jan
      { temp: { day: 11, min: 7, max: 15 }, condition: 'clouds', rainLevel: 'moderate' }, // Feb
      { temp: { day: 13, min: 9, max: 17 }, condition: 'clouds', rainLevel: 'light' },  // Mar
      { temp: { day: 16, min: 11, max: 20 }, condition: 'clear', rainLevel: 'light' },  // Apr
      { temp: { day: 20, min: 15, max: 25 }, condition: 'clear', rainLevel: 'none' },  // May
      { temp: { day: 24, min: 19, max: 29 }, condition: 'clear', rainLevel: 'none' },  // Jun
      { temp: { day: 27, min: 22, max: 32 }, condition: 'clear', rainLevel: 'none' },  // Jul
      { temp: { day: 27, min: 22, max: 32 }, condition: 'clear', rainLevel: 'none' },  // Aug
      { temp: { day: 24, min: 19, max: 29 }, condition: 'clear', rainLevel: 'light' },  // Sep
      { temp: { day: 19, min: 15, max: 24 }, condition: 'clouds', rainLevel: 'moderate' }, // Oct
      { temp: { day: 15, min: 11, max: 19 }, condition: 'clouds', rainLevel: 'moderate' }, // Nov
      { temp: { day: 11, min: 7, max: 15 }, condition: 'rain', rainLevel: 'moderate' }  // Dec
    ],
    eastern: [
      { temp: { day: -2, min: -5, max: 1 }, condition: 'snow', rainLevel: 'light' },  // Jan
      { temp: { day: 0, min: -4, max: 3 }, condition: 'snow', rainLevel: 'light' },  // Feb
      { temp: { day: 5, min: 1, max: 9 }, condition: 'clouds', rainLevel: 'light' },  // Mar
      { temp: { day: 10, min: 5, max: 15 }, condition: 'clouds', rainLevel: 'moderate' }, // Apr
      { temp: { day: 16, min: 10, max: 21 }, condition: 'clouds', rainLevel: 'moderate' }, // May
      { temp: { day: 20, min: 14, max: 25 }, condition: 'clear', rainLevel: 'light' },  // Jun
      { temp: { day: 22, min: 16, max: 28 }, condition: 'clear', rainLevel: 'light' },  // Jul
      { temp: { day: 22, min: 16, max: 27 }, condition: 'clear', rainLevel: 'light' },  // Aug
      { temp: { day: 17, min: 12, max: 22 }, condition: 'clouds', rainLevel: 'moderate' }, // Sep
      { temp: { day: 11, min: 6, max: 15 }, condition: 'clouds', rainLevel: 'moderate' }, // Oct
      { temp: { day: 5, min: 1, max: 8 }, condition: 'clouds', rainLevel: 'moderate' }, // Nov
      { temp: { day: 0, min: -3, max: 3 }, condition: 'snow', rainLevel: 'light' }   // Dec
    ],
    central: [
      { temp: { day: 2, min: -1, max: 5 }, condition: 'clouds', rainLevel: 'light' },  // Jan
      { temp: { day: 3, min: 0, max: 6 }, condition: 'clouds', rainLevel: 'light' },  // Feb
      { temp: { day: 7, min: 3, max: 11 }, condition: 'clouds', rainLevel: 'moderate' }, // Mar
      { temp: { day: 11, min: 6, max: 16 }, condition: 'clouds', rainLevel: 'moderate' }, // Apr
      { temp: { day: 16, min: 10, max: 21 }, condition: 'clouds', rainLevel: 'moderate' }, // May
      { temp: { day: 19, min: 14, max: 24 }, condition: 'clear', rainLevel: 'light' },  // Jun
      { temp: { day: 21, min: 16, max: 26 }, condition: 'clear', rainLevel: 'light' },  // Jul
      { temp: { day: 21, min: 15, max: 25 }, condition: 'clear', rainLevel: 'moderate' }, // Aug
      { temp: { day: 17, min: 12, max: 22 }, condition: 'clouds', rainLevel: 'moderate' }, // Sep
      { temp: { day: 12, min: 8, max: 16 }, condition: 'clouds', rainLevel: 'moderate' }, // Oct
      { temp: { day: 7, min: 3, max: 10 }, condition: 'clouds', rainLevel: 'moderate' }, // Nov
      { temp: { day: 3, min: 0, max: 6 }, condition: 'clouds', rainLevel: 'light' }   // Dec
    ]
  };
  
  // Get the weather data for the specified month and region
  const monthData = weatherByRegion[region][month];
  
  // Add some randomness to make it more realistic
  const randomizeTemp = (temp: number): number => Math.round(temp + (Math.random() * 4 - 2));
  
  return {
    cityName,
    date: formattedDate,
    temp: {
      day: randomizeTemp(monthData.temp.day),
      min: randomizeTemp(monthData.temp.min),
      max: randomizeTemp(monthData.temp.max)
    },
    condition: monthData.condition,
    icon: getIconForCondition(monthData.condition),
    rainLevel: monthData.rainLevel
  };
}

/**
 * Map our condition strings to OpenWeatherMap icon codes
 */
function getIconForCondition(condition: string): string {
  switch (condition) {
    case 'clear': return '01d';
    case 'clouds': return '03d';
    case 'drizzle': return '09d';
    case 'rain': return '10d';
    case 'thunderstorm': return '11d';
    case 'snow': return '13d';
    case 'mist': return '50d';
    default: return '01d';
  }
}