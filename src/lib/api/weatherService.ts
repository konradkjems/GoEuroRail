import axios from 'axios';
import { getCachedData, setCachedData } from '../cache';

// OpenWeatherMap API configuration
const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || 'your_default_api_key';
const BASE_URL = 'https://api.openweathermap.org/data/3.0';

// OpenWeatherMap API response types
interface GeocodingResponse {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

interface OneCallApiResponse {
  current: {
    dt: number;
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    uvi: number;
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
  };
  daily: Array<{
    dt: number;
    temp: {
      day: number;
      min: number;
      max: number;
      night: number;
      eve: number;
      morn: number;
    };
    humidity: number;
    wind_speed: number;
    uvi: number;
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
  }>;
}

/**
 * Weather forecast data structure
 */
export interface WeatherForecast {
  cityName: string;
  date: string;
  temp: number | {
    day: number;
    min: number;
    max: number;
  };
  condition: string;
  icon: string;
  rainLevel: string; // 'none', 'light', 'moderate', 'heavy'
  humidity?: number;
  wind_speed?: number;
  uvi?: number;
  isFromFallback?: boolean; // Flag to indicate if this is fallback data
}

/**
 * Get geographical coordinates for a city name
 */
async function getGeoCoordinates(cityName: string): Promise<{ lat: number; lon: number }> {
  // First check cache
  const cacheKey = `geocode:${cityName}`;
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  try {
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${API_KEY}`;
    
    const response = await axios.get<GeocodingResponse[]>(geoUrl);
    if (response.data && response.data.length > 0) {
      const result = {
        lat: response.data[0].lat,
        lon: response.data[0].lon
      };
      
      // Cache the coordinates for 30 days (cities don't move)
      setCachedData(cacheKey, result, 30 * 24 * 60 * 60);
      
      return result;
    }
    throw new Error(`City "${cityName}" not found`);
  } catch (error) {
    console.error(`Error getting coordinates for ${cityName}:`, error);
    throw error;
  }
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
    // Get coordinates for the city
    const { lat, lon } = await getGeoCoordinates(cityName);
    
    // Parse the target date
    const targetDate = new Date(date);
    const now = new Date();
    const daysDifference = Math.floor((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    let weatherData: WeatherForecast;
    
    // Use One Call API 3.0 for forecast (covers up to 8 days)
    if (daysDifference >= 0 && daysDifference <= 8) {
      weatherData = await getOneCallForecast(cityName, lat, lon, targetDate);
    } else {
      // For dates beyond 8 days, use historical averages
      weatherData = await getHistoricalWeatherAverages(cityName, targetDate);
    }
    
    // Cache the data (for 3 hours if it's current forecast, 7 days if it's historical)
    const cacheTTL = daysDifference >= 0 && daysDifference <= 8 ? 3 * 60 * 60 : 7 * 24 * 60 * 60;
    setCachedData(cacheKey, weatherData, cacheTTL);
    
    return weatherData;
  } catch (error) {
    console.error(`Error fetching weather data for ${cityName}:`, error);
    // Fall back to approximate data if the API call fails
    return getFallbackWeatherData(cityName, new Date(date));
  }
}

/**
 * Get forecast data from OpenWeatherMap One Call API 3.0
 */
async function getOneCallForecast(cityName: string, lat: number, lon: number, date: Date): Promise<WeatherForecast> {
  const url = `${BASE_URL}/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=metric&appid=${API_KEY}`;
  
  const response = await axios.get<OneCallApiResponse>(url);
  const data = response.data;
  
  // For current day, use current data
  const targetDay = date.setHours(0, 0, 0, 0);
  const today = new Date().setHours(0, 0, 0, 0);
  const daysDiff = Math.floor((targetDay - today) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 0) {
    // Return current weather
    const current = data.current;
    return {
      cityName,
      date: date.toISOString().split('T')[0],
      temp: Math.round(current.temp),
      condition: getConditionFromId(current.weather[0].id),
      icon: current.weather[0].icon,
      rainLevel: getRainLevelFromId(current.weather[0].id),
      humidity: current.humidity,
      wind_speed: current.wind_speed,
      uvi: current.uvi,
      isFromFallback: false
    };
  } else if (daysDiff > 0 && daysDiff <= 7) {
    // Return daily forecast for the specific day
    const dailyForecast = data.daily[daysDiff];
    return {
      cityName,
      date: date.toISOString().split('T')[0],
      temp: {
        day: Math.round(dailyForecast.temp.day),
        min: Math.round(dailyForecast.temp.min),
        max: Math.round(dailyForecast.temp.max)
      },
      condition: getConditionFromId(dailyForecast.weather[0].id),
      icon: dailyForecast.weather[0].icon,
      rainLevel: getRainLevelFromId(dailyForecast.weather[0].id),
      humidity: dailyForecast.humidity,
      wind_speed: dailyForecast.wind_speed,
      uvi: dailyForecast.uvi,
      isFromFallback: false
    };
  }
  
  throw new Error(`Weather data not available for ${date.toISOString().split('T')[0]}`);
}

/**
 * Map OpenWeatherMap condition codes to our simplified conditions
 */
function getConditionFromId(id: number): string {
  if (id >= 200 && id < 300) return 'thunderstorm';
  if (id >= 300 && id < 400) return 'drizzle';
  if (id >= 500 && id < 600) return 'rain';
  if (id >= 600 && id < 700) return 'snow';
  if (id >= 700 && id < 800) return 'mist';
  if (id === 800) return 'clear';
  if (id > 800) return 'clouds';
  return 'unknown';
}

/**
 * Determine rain level based on weather code
 */
function getRainLevelFromId(id: number): string {
  if (id >= 500 && id < 600) {
    if (id === 500) return 'light';
    if (id === 501) return 'moderate';
    if (id >= 502) return 'heavy';
  }
  
  if (id >= 200 && id < 300) {
    if (id === 200 || id === 210) return 'light';
    if (id === 201 || id === 211) return 'moderate';
    if (id >= 202 || id >= 212) return 'heavy';
  }
  
  if (id >= 300 && id < 400) return 'light';
  if (id >= 600 && id < 700) return 'moderate';
  
  return 'none';
}

/**
 * Get historical weather averages for a location and date
 * For dates beyond the 8-day forecast, we would typically use a climate/historical data API
 * This is a simplified implementation
 */
async function getHistoricalWeatherAverages(cityName: string, date: Date): Promise<WeatherForecast> {
  // In a real implementation, we would query a historical weather API
  // For this example, we'll use our fallback data as a proxy for historical averages
  const data = getFallbackWeatherData(cityName, date);
  
  // Ensure the fallback flag is set since historical data uses fallback data
  return {
    ...data,
    isFromFallback: true
  };
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
  else if (['Warsaw', 'Budapest', 'Bucharest', 'Sofia', 'Prague'].includes(cityName)) {
    region = 'eastern';
  }
  // Western Europe is the default fallback
  
  // Temperature and conditions by region and month
  const weatherByRegion: Record<string, any[]> = {
    northern: [
      { temp: { day: -5, min: -8, max: -2 }, condition: 'snow', rainLevel: 'light', humidity: 85, wind_speed: 5.0, uvi: 0.5 },  // Jan
      { temp: { day: -4, min: -7, max: -1 }, condition: 'snow', rainLevel: 'light', humidity: 80, wind_speed: 4.8, uvi: 1.0 },  // Feb
      { temp: { day: 0, min: -3, max: 3 }, condition: 'clouds', rainLevel: 'light', humidity: 75, wind_speed: 4.5, uvi: 1.5 },  // Mar
      { temp: { day: 5, min: 2, max: 8 }, condition: 'drizzle', rainLevel: 'moderate', humidity: 70, wind_speed: 4.2, uvi: 2.5 }, // Apr
      { temp: { day: 10, min: 6, max: 14 }, condition: 'clouds', rainLevel: 'light', humidity: 65, wind_speed: 4.0, uvi: 4.0 },  // May
      { temp: { day: 15, min: 10, max: 19 }, condition: 'clear', rainLevel: 'none', humidity: 60, wind_speed: 3.8, uvi: 5.0 },  // Jun
      { temp: { day: 18, min: 13, max: 22 }, condition: 'clear', rainLevel: 'none', humidity: 55, wind_speed: 3.5, uvi: 5.5 },  // Jul
      { temp: { day: 17, min: 12, max: 21 }, condition: 'clear', rainLevel: 'light', humidity: 60, wind_speed: 3.8, uvi: 4.5 },  // Aug
      { temp: { day: 12, min: 8, max: 16 }, condition: 'clouds', rainLevel: 'moderate', humidity: 65, wind_speed: 4.0, uvi: 3.0 }, // Sep
      { temp: { day: 7, min: 4, max: 10 }, condition: 'rain', rainLevel: 'moderate', humidity: 70, wind_speed: 4.2, uvi: 2.0 },  // Oct
      { temp: { day: 2, min: -1, max: 5 }, condition: 'clouds', rainLevel: 'light', humidity: 80, wind_speed: 4.5, uvi: 1.0 },  // Nov
      { temp: { day: -3, min: -6, max: 0 }, condition: 'snow', rainLevel: 'light', humidity: 85, wind_speed: 5.0, uvi: 0.5 }   // Dec
    ],
    southern: [
      { temp: { day: 10, min: 6, max: 14 }, condition: 'clouds', rainLevel: 'moderate', humidity: 75, wind_speed: 4.0, uvi: 2.5 }, // Jan
      { temp: { day: 11, min: 7, max: 15 }, condition: 'clouds', rainLevel: 'moderate', humidity: 70, wind_speed: 4.2, uvi: 3.0 }, // Feb
      { temp: { day: 13, min: 9, max: 17 }, condition: 'clouds', rainLevel: 'light', humidity: 65, wind_speed: 4.0, uvi: 4.0 },  // Mar
      { temp: { day: 16, min: 11, max: 20 }, condition: 'clear', rainLevel: 'light', humidity: 60, wind_speed: 3.8, uvi: 5.0 },  // Apr
      { temp: { day: 20, min: 15, max: 25 }, condition: 'clear', rainLevel: 'none', humidity: 55, wind_speed: 3.5, uvi: 7.0 },  // May
      { temp: { day: 24, min: 19, max: 29 }, condition: 'clear', rainLevel: 'none', humidity: 50, wind_speed: 3.0, uvi: 8.0 },  // Jun
      { temp: { day: 27, min: 22, max: 32 }, condition: 'clear', rainLevel: 'none', humidity: 45, wind_speed: 3.0, uvi: 9.0 },  // Jul
      { temp: { day: 27, min: 22, max: 32 }, condition: 'clear', rainLevel: 'none', humidity: 45, wind_speed: 3.2, uvi: 8.5 },  // Aug
      { temp: { day: 24, min: 19, max: 29 }, condition: 'clear', rainLevel: 'light', humidity: 50, wind_speed: 3.5, uvi: 7.0 },  // Sep
      { temp: { day: 19, min: 15, max: 24 }, condition: 'clouds', rainLevel: 'moderate', humidity: 60, wind_speed: 3.8, uvi: 5.0 }, // Oct
      { temp: { day: 15, min: 11, max: 19 }, condition: 'clouds', rainLevel: 'moderate', humidity: 70, wind_speed: 4.0, uvi: 3.0 }, // Nov
      { temp: { day: 11, min: 7, max: 15 }, condition: 'rain', rainLevel: 'moderate', humidity: 75, wind_speed: 4.2, uvi: 2.0 }  // Dec
    ],
    eastern: [
      { temp: { day: -2, min: -5, max: 1 }, condition: 'snow', rainLevel: 'light', humidity: 85, wind_speed: 4.0, uvi: 1.0 },  // Jan
      { temp: { day: 0, min: -4, max: 3 }, condition: 'snow', rainLevel: 'light', humidity: 80, wind_speed: 4.2, uvi: 1.5 },  // Feb
      { temp: { day: 5, min: 1, max: 9 }, condition: 'clouds', rainLevel: 'light', humidity: 75, wind_speed: 4.5, uvi: 2.5 },  // Mar
      { temp: { day: 10, min: 5, max: 15 }, condition: 'clouds', rainLevel: 'moderate', humidity: 70, wind_speed: 4.0, uvi: 3.5 }, // Apr
      { temp: { day: 16, min: 10, max: 21 }, condition: 'clouds', rainLevel: 'moderate', humidity: 65, wind_speed: 3.8, uvi: 5.0 }, // May
      { temp: { day: 20, min: 14, max: 25 }, condition: 'clear', rainLevel: 'light', humidity: 60, wind_speed: 3.5, uvi: 6.0 },  // Jun
      { temp: { day: 22, min: 16, max: 28 }, condition: 'clear', rainLevel: 'light', humidity: 55, wind_speed: 3.0, uvi: 7.0 },  // Jul
      { temp: { day: 22, min: 16, max: 27 }, condition: 'clear', rainLevel: 'light', humidity: 60, wind_speed: 3.2, uvi: 6.5 },  // Aug
      { temp: { day: 17, min: 12, max: 22 }, condition: 'clouds', rainLevel: 'moderate', humidity: 65, wind_speed: 3.8, uvi: 5.0 }, // Sep
      { temp: { day: 11, min: 6, max: 15 }, condition: 'clouds', rainLevel: 'moderate', humidity: 70, wind_speed: 4.0, uvi: 3.0 }, // Oct
      { temp: { day: 5, min: 1, max: 8 }, condition: 'clouds', rainLevel: 'moderate', humidity: 80, wind_speed: 4.5, uvi: 1.5 }, // Nov
      { temp: { day: 0, min: -3, max: 3 }, condition: 'snow', rainLevel: 'light', humidity: 85, wind_speed: 4.2, uvi: 1.0 }   // Dec
    ],
    central: [
      { temp: { day: 2, min: -1, max: 5 }, condition: 'clouds', rainLevel: 'light', humidity: 80, wind_speed: 4.5, uvi: 1.5 },  // Jan
      { temp: { day: 3, min: 0, max: 6 }, condition: 'clouds', rainLevel: 'light', humidity: 75, wind_speed: 4.5, uvi: 2.0 },  // Feb
      { temp: { day: 7, min: 3, max: 11 }, condition: 'clouds', rainLevel: 'moderate', humidity: 70, wind_speed: 4.2, uvi: 3.0 }, // Mar
      { temp: { day: 11, min: 6, max: 16 }, condition: 'clouds', rainLevel: 'moderate', humidity: 65, wind_speed: 4.0, uvi: 4.0 }, // Apr
      { temp: { day: 16, min: 10, max: 21 }, condition: 'clouds', rainLevel: 'moderate', humidity: 60, wind_speed: 3.8, uvi: 5.5 }, // May
      { temp: { day: 19, min: 14, max: 24 }, condition: 'clear', rainLevel: 'light', humidity: 55, wind_speed: 3.5, uvi: 6.5 },  // Jun
      { temp: { day: 21, min: 16, max: 26 }, condition: 'clear', rainLevel: 'light', humidity: 50, wind_speed: 3.2, uvi: 7.0 },  // Jul
      { temp: { day: 21, min: 15, max: 25 }, condition: 'clear', rainLevel: 'moderate', humidity: 55, wind_speed: 3.5, uvi: 6.0 }, // Aug
      { temp: { day: 17, min: 12, max: 22 }, condition: 'clouds', rainLevel: 'moderate', humidity: 60, wind_speed: 3.8, uvi: 5.0 }, // Sep
      { temp: { day: 12, min: 8, max: 16 }, condition: 'clouds', rainLevel: 'moderate', humidity: 70, wind_speed: 4.0, uvi: 3.5 }, // Oct
      { temp: { day: 7, min: 3, max: 10 }, condition: 'clouds', rainLevel: 'moderate', humidity: 75, wind_speed: 4.2, uvi: 2.0 }, // Nov
      { temp: { day: 3, min: 0, max: 6 }, condition: 'clouds', rainLevel: 'light', humidity: 80, wind_speed: 4.5, uvi: 1.0 }   // Dec
    ]
  };
  
  // Get base weather for this month and region
  const baseWeather = { ...weatherByRegion[region][month] };
  
  // Add some randomness to make it look more natural
  const randomizeTemp = (temp: number): number => Math.round(temp + (Math.random() * 4 - 2));
  
  if (typeof baseWeather.temp === 'object') {
    baseWeather.temp = {
      day: randomizeTemp(baseWeather.temp.day),
      min: randomizeTemp(baseWeather.temp.min),
      max: randomizeTemp(baseWeather.temp.max)
    };
  }
  
  // Add icon
  baseWeather.icon = getIconForCondition(baseWeather.condition);
  
  return {
    cityName,
    date: formattedDate,
    ...baseWeather,
    isFromFallback: true
  };
}

/**
 * Get weather icon code based on condition
 */
function getIconForCondition(condition: string): string {
  switch (condition) {
    case 'clear':
      return '01d';
    case 'clouds':
      return '03d';
    case 'rain':
      return '10d';
    case 'drizzle':
      return '09d';
    case 'thunderstorm':
      return '11d';
    case 'snow':
      return '13d';
    case 'mist':
      return '50d';
    default:
      return '03d';
  }
}