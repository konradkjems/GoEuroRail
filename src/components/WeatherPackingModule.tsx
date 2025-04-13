import React, { useState, useEffect } from 'react';
import { FormTrip, FormTripStop, City } from '@/types';
import { cities } from '@/lib/cities';
import { getWeatherForecast, WeatherForecast } from '@/lib/api';
import {
  CloudIcon,
  SunIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  InformationCircleIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

// Mock weather data by month and region (from SmartTripAssistant)
const WEATHER_DATA: Record<string, Record<string, any>> = {
  'Western Europe': {
    Jan: { temp: 5, condition: 'cloudy', rain: 'moderate', icon: 'cloud', humidity: 80, wind_speed: 5.2, uvi: 1.5, rainLevel: 'moderate' },
    Feb: { temp: 6, condition: 'cloudy', rain: 'light', icon: 'cloud', humidity: 75, wind_speed: 5.0, uvi: 2.0, rainLevel: 'light' },
    Mar: { temp: 9, condition: 'partly cloudy', rain: 'light', icon: 'cloud-sun', humidity: 70, wind_speed: 4.8, uvi: 3.0, rainLevel: 'light' },
    Apr: { temp: 12, condition: 'partly cloudy', rain: 'moderate', icon: 'cloud-sun', humidity: 65, wind_speed: 4.5, uvi: 4.0, rainLevel: 'moderate' },
    May: { temp: 16, condition: 'mostly sunny', rain: 'light', icon: 'sun', humidity: 60, wind_speed: 4.0, uvi: 5.0, rainLevel: 'light' },
    Jun: { temp: 20, condition: 'sunny', rain: 'none', icon: 'sun', humidity: 55, wind_speed: 3.8, uvi: 6.5, rainLevel: 'none' },
    Jul: { temp: 23, condition: 'sunny', rain: 'none', icon: 'sun', humidity: 50, wind_speed: 3.5, uvi: 7.0, rainLevel: 'none' },
    Aug: { temp: 22, condition: 'sunny', rain: 'light', icon: 'sun', humidity: 55, wind_speed: 3.6, uvi: 6.5, rainLevel: 'light' },
    Sep: { temp: 19, condition: 'partly cloudy', rain: 'moderate', icon: 'cloud-sun', humidity: 60, wind_speed: 4.0, uvi: 5.0, rainLevel: 'moderate' },
    Oct: { temp: 14, condition: 'cloudy', rain: 'moderate', icon: 'cloud', humidity: 70, wind_speed: 4.5, uvi: 3.0, rainLevel: 'moderate' },
    Nov: { temp: 9, condition: 'cloudy', rain: 'high', icon: 'cloud-rain', humidity: 75, wind_speed: 5.0, uvi: 2.0, rainLevel: 'heavy' },
    Dec: { temp: 6, condition: 'cloudy', rain: 'moderate', icon: 'cloud', humidity: 80, wind_speed: 5.5, uvi: 1.0, rainLevel: 'moderate' }
  },
  'Eastern Europe': {
    Jan: { temp: 0, condition: 'snow', rain: 'light', icon: 'snow', humidity: 85, wind_speed: 4.0, uvi: 1.0, rainLevel: 'light' },
    Feb: { temp: 1, condition: 'snow', rain: 'light', icon: 'snow', humidity: 80, wind_speed: 4.2, uvi: 1.5, rainLevel: 'light' },
    Mar: { temp: 5, condition: 'cloudy', rain: 'moderate', icon: 'cloud', humidity: 75, wind_speed: 4.5, uvi: 2.5, rainLevel: 'moderate' },
    Apr: { temp: 10, condition: 'partly cloudy', rain: 'moderate', icon: 'cloud-sun', humidity: 70, wind_speed: 4.0, uvi: 3.5, rainLevel: 'moderate' },
    May: { temp: 15, condition: 'partly cloudy', rain: 'light', icon: 'cloud-sun', humidity: 65, wind_speed: 3.8, uvi: 5.0, rainLevel: 'light' },
    Jun: { temp: 20, condition: 'mostly sunny', rain: 'light', icon: 'sun', humidity: 60, wind_speed: 3.5, uvi: 6.0, rainLevel: 'light' },
    Jul: { temp: 23, condition: 'sunny', rain: 'none', icon: 'sun', humidity: 55, wind_speed: 3.0, uvi: 7.0, rainLevel: 'none' },
    Aug: { temp: 22, condition: 'sunny', rain: 'light', icon: 'sun', humidity: 60, wind_speed: 3.2, uvi: 6.5, rainLevel: 'light' },
    Sep: { temp: 17, condition: 'partly cloudy', rain: 'moderate', icon: 'cloud-sun', humidity: 65, wind_speed: 3.8, uvi: 5.0, rainLevel: 'moderate' },
    Oct: { temp: 11, condition: 'cloudy', rain: 'moderate', icon: 'cloud', humidity: 70, wind_speed: 4.0, uvi: 3.0, rainLevel: 'moderate' },
    Nov: { temp: 5, condition: 'cloudy', rain: 'high', icon: 'cloud-rain', humidity: 80, wind_speed: 4.5, uvi: 1.5, rainLevel: 'heavy' },
    Dec: { temp: 1, condition: 'snow', rain: 'moderate', icon: 'snow', humidity: 85, wind_speed: 4.2, uvi: 1.0, rainLevel: 'moderate' }
  },
  'Southern Europe': {
    Jan: { temp: 10, condition: 'partly cloudy', rain: 'moderate', icon: 'cloud-sun', humidity: 75, wind_speed: 4.0, uvi: 2.5, rainLevel: 'moderate' },
    Feb: { temp: 11, condition: 'partly cloudy', rain: 'moderate', icon: 'cloud-sun', humidity: 70, wind_speed: 4.2, uvi: 3.0, rainLevel: 'moderate' },
    Mar: { temp: 14, condition: 'mostly sunny', rain: 'light', icon: 'sun', humidity: 65, wind_speed: 4.0, uvi: 4.0, rainLevel: 'light' },
    Apr: { temp: 16, condition: 'mostly sunny', rain: 'light', icon: 'sun', humidity: 60, wind_speed: 3.8, uvi: 5.0, rainLevel: 'light' },
    May: { temp: 20, condition: 'sunny', rain: 'none', icon: 'sun', humidity: 55, wind_speed: 3.5, uvi: 7.0, rainLevel: 'none' },
    Jun: { temp: 24, condition: 'sunny', rain: 'none', icon: 'sun', humidity: 50, wind_speed: 3.0, uvi: 8.0, rainLevel: 'none' },
    Jul: { temp: 28, condition: 'sunny', rain: 'none', icon: 'sun', humidity: 45, wind_speed: 3.0, uvi: 9.0, rainLevel: 'none' },
    Aug: { temp: 28, condition: 'sunny', rain: 'none', icon: 'sun', humidity: 45, wind_speed: 3.2, uvi: 8.5, rainLevel: 'none' },
    Sep: { temp: 24, condition: 'mostly sunny', rain: 'light', icon: 'sun', humidity: 50, wind_speed: 3.5, uvi: 7.0, rainLevel: 'light' },
    Oct: { temp: 20, condition: 'partly cloudy', rain: 'moderate', icon: 'cloud-sun', humidity: 60, wind_speed: 3.8, uvi: 5.0, rainLevel: 'moderate' },
    Nov: { temp: 15, condition: 'partly cloudy', rain: 'moderate', icon: 'cloud-sun', humidity: 70, wind_speed: 4.0, uvi: 3.0, rainLevel: 'moderate' },
    Dec: { temp: 11, condition: 'cloudy', rain: 'high', icon: 'cloud-rain', humidity: 75, wind_speed: 4.2, uvi: 2.0, rainLevel: 'heavy' }
  },
  'Northern Europe': {
    Jan: { temp: -3, condition: 'snow', rain: 'light', icon: 'snow', humidity: 85, wind_speed: 5.0, uvi: 0.5, rainLevel: 'light' },
    Feb: { temp: -2, condition: 'snow', rain: 'light', icon: 'snow', humidity: 80, wind_speed: 4.8, uvi: 1.0, rainLevel: 'light' },
    Mar: { temp: 1, condition: 'snow', rain: 'light', icon: 'snow', humidity: 75, wind_speed: 4.5, uvi: 1.5, rainLevel: 'light' },
    Apr: { temp: 5, condition: 'cloudy', rain: 'moderate', icon: 'cloud', humidity: 70, wind_speed: 4.2, uvi: 2.5, rainLevel: 'moderate' },
    May: { temp: 10, condition: 'partly cloudy', rain: 'light', icon: 'cloud-sun', humidity: 65, wind_speed: 4.0, uvi: 4.0, rainLevel: 'light' },
    Jun: { temp: 15, condition: 'partly cloudy', rain: 'light', icon: 'cloud-sun', humidity: 60, wind_speed: 3.8, uvi: 5.0, rainLevel: 'light' },
    Jul: { temp: 18, condition: 'mostly sunny', rain: 'none', icon: 'sun', humidity: 55, wind_speed: 3.5, uvi: 5.5, rainLevel: 'none' },
    Aug: { temp: 17, condition: 'partly cloudy', rain: 'light', icon: 'cloud-sun', humidity: 60, wind_speed: 3.8, uvi: 4.5, rainLevel: 'light' },
    Sep: { temp: 12, condition: 'cloudy', rain: 'moderate', icon: 'cloud', humidity: 65, wind_speed: 4.0, uvi: 3.0, rainLevel: 'moderate' },
    Oct: { temp: 7, condition: 'cloudy', rain: 'moderate', icon: 'cloud', humidity: 70, wind_speed: 4.2, uvi: 2.0, rainLevel: 'moderate' },
    Nov: { temp: 2, condition: 'snow', rain: 'moderate', icon: 'snow', humidity: 80, wind_speed: 4.5, uvi: 1.0, rainLevel: 'moderate' },
    Dec: { temp: -1, condition: 'snow', rain: 'light', icon: 'snow', humidity: 85, wind_speed: 5.0, uvi: 0.5, rainLevel: 'light' }
  }
};

interface WeatherPackingModuleProps {
  trip: FormTrip;
}

export default function WeatherPackingModule({ trip }: WeatherPackingModuleProps) {
  const [weatherData, setWeatherData] = useState<Record<string, WeatherForecast>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

  // Fetch weather data when component mounts
  useEffect(() => {
    fetchWeatherData();
  }, [trip]);

  const fetchWeatherData = async () => {
    if (!trip.stops || trip.stops.length === 0) return;
    
    setIsLoading(true);
    
    const newWeatherData: Record<string, any> = {};
    
    try {
      for (const stop of trip.stops) {
        const city = cities.find(c => c.id === stop.cityId);
        if (!city) continue;
        
        const stopKey = `${city.name}-${stop.arrivalDate}`;
        
        // Check if we already have data for this city+date
        if (weatherData[stopKey]) continue;
        
        // Get weather forecast
        const forecast = await getWeatherForecast(city.name, stop.arrivalDate);
        if (forecast) {
          newWeatherData[stopKey] = forecast;
        }
      }
      
      setWeatherData((prev: Record<string, any>) => ({ ...prev, ...newWeatherData }));
    } catch (error: any) {
      console.error('Error fetching weather data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get region from city
  const getRegion = (city: City): 'Western Europe' | 'Eastern Europe' | 'Southern Europe' | 'Northern Europe' => {
    const westernEurope = ['France', 'Germany', 'Netherlands', 'Belgium', 'Austria', 'Switzerland', 'Luxembourg'];
    const easternEurope = ['Poland', 'Czech Republic', 'Hungary', 'Slovakia', 'Romania', 'Bulgaria', 'Croatia', 'Slovenia'];
    const southernEurope = ['Italy', 'Spain', 'Portugal', 'Greece', 'Malta', 'Cyprus'];
    const northernEurope = ['Sweden', 'Norway', 'Finland', 'Denmark', 'Iceland', 'Estonia', 'Latvia', 'Lithuania'];
    
    if (westernEurope.includes(city.country)) return 'Western Europe';
    if (easternEurope.includes(city.country)) return 'Eastern Europe';
    if (southernEurope.includes(city.country)) return 'Southern Europe';
    if (northernEurope.includes(city.country)) return 'Northern Europe';
    
    // Default to Western Europe if unknown
    return 'Western Europe';
  };

  // Get weather for a specific stop
  const getWeatherForStop = (stop: FormTripStop) => {
    const city = cities.find(c => c.id === stop.cityId);
    if (!city) return null;
    
    const stopKey = `${city.name}-${stop.arrivalDate}`;
    
    // Check if we have real data for this stop
    if (weatherData[stopKey]) {
      return weatherData[stopKey];
    }
    
    // Fall back to mock data
    const region = getRegion(city);
    const arrivalDate = new Date(stop.arrivalDate);
    const month = arrivalDate.toLocaleString('en-US', { month: 'short' });
    
    return WEATHER_DATA[region][month];
  };

  // Get weather icon component
  const getWeatherIcon = (weather: any) => {
    // Handle both real API response and mock data formats
    const icon = typeof weather === 'string' ? weather : (weather?.icon || 'cloud');
    
    switch (icon) {
      case 'sun':
      case '01d':
      case '01n':
        return <SunIcon className="h-8 w-8 text-yellow-500" />;
      case 'cloud-sun':
      case '02d':
      case '02n':
      case '03d':
      case '03n':
        return <CloudIcon className="h-8 w-8 text-gray-400" />;
      case 'cloud':
      case '04d':
      case '04n':
        return <CloudIcon className="h-8 w-8 text-gray-600" />;
      case 'cloud-rain':
      case '09d':
      case '09n':
      case '10d':
      case '10n':
        return <CloudIcon className="h-8 w-8 text-blue-500" />;
      case 'snow':
      case '13d':
      case '13n':
        return <CloudIcon className="h-8 w-8 text-blue-300" />;
      default:
        return <CloudIcon className="h-8 w-8 text-gray-400" />;
    }
  };

  // Get UV index description based on numeric value
  const getUVIndexDescription = (uvi: number): string => {
    if (uvi < 3) return "Low";
    if (uvi < 6) return "Moderate";
    if (uvi < 8) return "High";
    if (uvi < 11) return "Very High";
    return "Extreme";
  };

  // Get weather advice for the trip
  const getWeatherAdvice = () => {
    if (!trip || !trip.stops || trip.stops.length === 0) return null;
    
    const weatherByStop = trip.stops.map(stop => {
      const city = cities.find(c => c.id === stop.cityId);
      const weather = getWeatherForStop(stop);
      
      return {
        city: city?.name || 'Unknown city',
        date: stop.arrivalDate,
        weather
      };
    }).filter(item => item.weather !== null);
    
    // Find extreme weather conditions
    const extremeWeather = weatherByStop.filter(item => {
      const weather = item.weather;
      
      if (!weather) return false;
      
      // Check if we're dealing with API or mock data
      if ('temp' in weather && 'rainLevel' in weather) {
        // API data (WeatherForecast type)
        const temp = typeof weather.temp === 'number' 
          ? weather.temp 
          : (weather.temp?.day || 0);
        
        return temp < 0 || 
               temp > 30 || 
               weather.rainLevel === 'heavy' || 
               weather.condition === 'snow' || 
               weather.condition === 'thunderstorm';
      } else {
        // Mock data
        return (weather.condition?.includes('very cold') || false) || 
               (weather.condition?.includes('hot') || false) ||
               (weather.rain === 'high') ||
               (weather.rain === 'very high');
      }
    });
    
    // Find average temperature across all stops
    const avgTemp = weatherByStop.reduce((sum, item) => {
      const weather = item.weather;
      
      if (!weather) return sum;
      
      // Check if we're dealing with API or mock data
      if ('temp' in weather) {
        // API data
        if (typeof weather.temp === 'number') {
          return sum + weather.temp;
        } else if (weather.temp && typeof weather.temp === 'object' && 'day' in weather.temp) {
          return sum + (weather.temp.day || 0);
        } else {
          return sum;
        }
      } else if (typeof (weather as any).temp === 'number') {
        // Mock data
        return sum + ((weather as any).temp || 0);
      } else {
        return sum;
      }
    }, 0) / (weatherByStop.length || 1); // Avoid division by zero
    
    // General packing advice based on average temp
    let packingAdvice = '';
    let packingItems = [];
    
    if (avgTemp < 5) {
      packingAdvice = 'Pack heavy winter clothes, gloves, scarf, and waterproof boots.';
      packingItems = [
        'Thermal underwear',
        'Heavy winter coat',
        'Gloves and hat',
        'Scarf',
        'Waterproof boots',
        'Wool socks',
        'Warm sweaters',
      ];
    } else if (avgTemp < 12) {
      packingAdvice = 'Pack warm clothes with layers, a good jacket, and a waterproof outer layer.';
      packingItems = [
        'Medium weight jacket',
        'Sweaters/fleece',
        'Long sleeve shirts',
        'Waterproof outer layer',
        'Comfortable shoes',
        'Light gloves',
        'Scarf'
      ];
    } else if (avgTemp < 18) {
      packingAdvice = 'Pack layers, light jacket, and some warmer options for evenings.';
      packingItems = [
        'Light jacket',
        'Light sweaters',
        'Long and short sleeve shirts',
        'Pants/jeans',
        'One warmer layer for evenings',
        'Comfortable walking shoes',
        'Light rain jacket'
      ];
    } else if (avgTemp < 24) {
      packingAdvice = 'Pack light clothes, but bring a light jacket for evenings and some rain protection.';
      packingItems = [
        'T-shirts/short sleeve shirts',
        'Light pants/skirts',
        'One light jacket for evenings',
        'Shorts (optional)',
        'Light rain jacket',
        'Sun hat',
        'Comfortable shoes',
        'Sunscreen'
      ];
    } else {
      packingAdvice = 'Pack light summer clothes, sun protection, and perhaps a very light jacket for evenings.';
      packingItems = [
        'T-shirts/light tops',
        'Shorts/skirts',
        'Light pants',
        'Summer dresses',
        'Swimwear',
        'Sunglasses',
        'Sun hat',
        'Sunscreen (high SPF)',
        'Light jacket/sweater for evenings'
      ];
    }
    
    // Add rain gear if needed
    const hasRainyStops = weatherByStop.some(item => 
      item.weather && 
      ((item.weather.rainLevel === 'moderate' || item.weather.rainLevel === 'heavy') ||
       (item.weather.rain === 'moderate' || item.weather.rain === 'high'))
    );
    
    if (hasRainyStops && !packingItems.some(item => item.toLowerCase().includes('umbrella'))) {
      packingItems.push('Umbrella');
      packingItems.push('Waterproof jacket');
    }
    
    return {
      weatherByStop,
      extremeWeather,
      avgTemp,
      packingAdvice,
      packingItems,
      hasRainyStops
    };
  };

  const weatherAdvice = getWeatherAdvice();

  return (
    <div className="space-y-6">
      {/* Collapsible Header Panel */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div 
          className="px-4 py-3 bg-gray-50 border-b flex justify-between items-center cursor-pointer"
          onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
        >
          <div className="flex items-center gap-2">
            <CloudIcon className="h-5 w-5 text-gray-600" />
            <h3 className="text-md font-medium text-gray-700">Weather & Packing</h3>
          </div>
          {isPanelCollapsed ? (
            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronUpIcon className="h-5 w-5 text-gray-500" />
          )}
        </div>
        
        {!isPanelCollapsed && (
          <>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
              </div>
            ) : (
              <div>
                <h3 className="px-4 pt-4 text-gray-800 text-md font-medium">Weather forecast for your trip:</h3>
                {/* Weather by Destination */}
                <div className="divide-y">
                  {trip.stops.map((stop, index) => {
                    const city = cities.find(c => c.id === stop.cityId);
                    const weather = getWeatherForStop(stop);
                    if (!city || !weather) return null;
                    
                    // Extract temperature - work with both API and mock data formats
                    const temp = typeof weather.temp === 'number' 
                      ? weather.temp 
                      : (weather.temp?.day || 0);
                    
                    // Get min temperature
                    const minTemp = typeof weather.temp === 'number'
                      ? Math.round(temp - 3) // Approximation for mock data
                      : (weather.temp?.min || Math.round(temp - 3));
                    
                    // Get feels like
                    const feelsLike = typeof weather.feels_like === 'object'
                      ? weather.feels_like?.day || Math.round(temp - 2)
                      : Math.round(temp - 2); // Approximation
                    
                    // Format date
                    const date = new Date(stop.arrivalDate);
                    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                    
                    // Extract condition - work with both API and mock data formats
                    const condition = weather.condition || 
                      (weather.weather && weather.weather[0] ? weather.weather[0].main : 'clouds');
                    
                    // Get humidity
                    const humidity = weather.humidity || 65;
                    
                    // Get wind speed
                    const windSpeed = weather.wind_speed || 14;
                    
                    return (
                      <div key={`${city.id}-${index}`} className="p-4 bg-white border-t border-gray-100">
                        <div className="mb-1">
                          <h4 className="font-medium text-gray-800">{city.name}</h4>
                          <div className="text-sm text-gray-500">{formattedDate}</div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div>
                              {getWeatherIcon(weather)}
                              <div className="text-sm text-gray-600 mt-1">{condition}</div>
                            </div>
                            
                            <div className="text-4xl font-bold text-teal-500">
                              {Math.round(temp)}°C
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="text-sm flex items-center">
                              <span className="text-gray-600">Min: </span>
                              <span className="ml-1 text-gray-800">{Math.round(minTemp)}°C</span>
                            </div>
                            <div className="text-sm flex items-center">
                              <span className="text-gray-600">Feels like: </span>
                              <span className="ml-1 text-gray-800">{Math.round(feelsLike)}°C</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div className="flex items-center">
                            <CloudIcon className="h-4 w-4 text-blue-500 mr-1" />
                            <span className="text-gray-600">Humidity: </span>
                            <span className="ml-1 text-gray-800">{humidity}%</span>
                          </div>
                          <div className="flex items-center">
                            <ArrowTrendingUpIcon className="h-4 w-4 text-gray-500 mr-1 transform rotate-90" />
                            <span className="text-gray-600">Wind: </span>
                            <span className="ml-1 text-gray-800">{windSpeed} km/h</span>
                          </div>
                          <div className="flex items-center">
                            <SunIcon className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-gray-600">UV: </span>
                            <span className="ml-1 text-gray-800">Moderate</span>
                          </div>
                          <div className="flex items-center">
                            <CloudIcon className="h-4 w-4 text-blue-400 mr-1" />
                            <span className="text-gray-600">Rain: </span>
                            <span className="ml-1 text-gray-800">moderate</span>
                          </div>
                        </div>
                        
                        <div className="mt-2 text-xs text-amber-600 flex items-center justify-center px-4 py-1 bg-amber-50 rounded-full max-w-fit">
                          <InformationCircleIcon className="h-3 w-3 mr-1" />
                          Estimated weather data
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Packing Recommendations */}
                {weatherAdvice && (
                  <div className="p-4 border-t border-gray-200">
                    <h3 className="font-medium text-gray-800 mb-3">Packing Recommendations</h3>
                    
                    <div className="mb-4 flex items-center space-x-2">
                      <ArrowTrendingUpIcon className="h-5 w-5 text-blue-500" />
                      <span className="text-gray-700">
                        Average temperature: <span className="font-medium">{Math.round(weatherAdvice.avgTemp)}°C</span>
                      </span>
                    </div>
                    
                    {weatherAdvice.extremeWeather.length > 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 flex items-start space-x-2">
                        <ExclamationTriangleIcon className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-amber-800">Weather Alerts</h4>
                          <ul className="mt-1 text-sm text-amber-700 space-y-1">
                            {weatherAdvice.extremeWeather.map((item, index) => (
                              <li key={index}>
                                {item.city}: {
                                  typeof item.weather.temp === 'number'
                                    ? `${Math.round(item.weather.temp)}°C`
                                    : `${Math.round(item.weather.temp?.day || 0)}°C`
                                }, {item.weather.condition || 'extreme conditions'}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                      <div className="flex items-start space-x-2">
                        <InformationCircleIcon className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-800">General Advice</h4>
                          <p className="mt-1 text-sm text-blue-700">{weatherAdvice.packingAdvice}</p>
                        </div>
                      </div>
                    </div>
                    
                    <h4 className="font-medium text-gray-700 mb-2">Packing Checklist</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {weatherAdvice.packingItems.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="h-5 w-5 border border-gray-300 rounded flex-shrink-0"></div>
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 