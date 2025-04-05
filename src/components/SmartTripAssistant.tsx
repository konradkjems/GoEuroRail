import React, { useState, useEffect } from 'react';
import { FormTrip, FormTripStop, City } from "@/types";
import { cities } from "@/lib/cities";
import {
  BanknotesIcon,
  CloudIcon,
  TicketIcon,
  PhotoIcon,
  HomeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SunIcon,
  ExclamationTriangleIcon,
  StarIcon,
  ClockIcon,
  GlobeEuropeAfricaIcon,
  BuildingOfficeIcon,
  CurrencyEuroIcon,
  MapPinIcon,
  UserGroupIcon,
  CalendarIcon,
  ArrowTrendingUpIcon
} from "@heroicons/react/24/outline";
import { getWeatherForecast, WeatherForecast, getTripBudget, BudgetCategory, getAccommodations, Accommodation as ApiAccommodation, AccommodationSearchParams, getAttractions, Attraction as ApiAttraction, AttractionSearchParams, getActivities, getActivityWidgetHtml } from "@/lib/api";

interface SmartTripAssistantProps {
  trip: FormTrip;
}

// Budget ranges by region
const ACCOMMODATION_COSTS = {
  'Western Europe': { budget: 30, mid: 80, luxury: 150 },
  'Eastern Europe': { budget: 15, mid: 50, luxury: 100 },
  'Southern Europe': { budget: 20, mid: 60, luxury: 120 },
  'Northern Europe': { budget: 35, mid: 90, luxury: 180 }
};

const FOOD_COSTS = {
  'Western Europe': { budget: 15, mid: 35, luxury: 60 },
  'Eastern Europe': { budget: 10, mid: 20, luxury: 40 },
  'Southern Europe': { budget: 12, mid: 30, luxury: 50 },
  'Northern Europe': { budget: 18, mid: 40, luxury: 70 }
};

const ATTRACTION_COSTS = {
  'Western Europe': { budget: 10, mid: 20, luxury: 40 },
  'Eastern Europe': { budget: 5, mid: 15, luxury: 30 },
  'Southern Europe': { budget: 8, mid: 18, luxury: 35 },
  'Northern Europe': { budget: 12, mid: 25, luxury: 45 }
};

const TRAIN_COSTS = {
  'Western Europe': { local: 15, express: 40, international: 80 },
  'Eastern Europe': { local: 8, express: 20, international: 40 },
  'Southern Europe': { local: 10, express: 30, international: 60 },
  'Northern Europe': { local: 20, express: 50, international: 100 }
};

// Interrail/Eurail Pass pricing
const RAIL_PASSES = {
  'Global Pass': {
    '5 days in 1 month': { youth: 251, adult: 335, senior: 301 },
    '7 days in 1 month': { youth: 289, adult: 385, senior: 347 },
    '10 days in 2 months': { youth: 333, adult: 444, senior: 400 },
    '15 days in 2 months': { youth: 389, adult: 519, senior: 467 },
    '15 consecutive days': { youth: 342, adult: 456, senior: 410 },
    '22 consecutive days': { youth: 389, adult: 518, senior: 466 },
    '1 month continuous': { youth: 480, adult: 640, senior: 576 },
    '2 months continuous': { youth: 621, adult: 828, senior: 745 },
    '3 months continuous': { youth: 763, adult: 1017, senior: 915 }
  }
};

// Mock weather data by month and region
const WEATHER_DATA = {
  'Western Europe': {
    Jan: { temp: 3, condition: 'cold', rain: 'moderate', icon: 'cloud' },
    Feb: { temp: 4, condition: 'cold', rain: 'moderate', icon: 'cloud' },
    Mar: { temp: 8, condition: 'cool', rain: 'moderate', icon: 'cloud-sun' },
    Apr: { temp: 12, condition: 'mild', rain: 'moderate', icon: 'cloud-sun' },
    May: { temp: 16, condition: 'mild', rain: 'low', icon: 'sun' },
    Jun: { temp: 19, condition: 'warm', rain: 'low', icon: 'sun' },
    Jul: { temp: 22, condition: 'warm', rain: 'low', icon: 'sun' },
    Aug: { temp: 22, condition: 'warm', rain: 'low', icon: 'sun' },
    Sep: { temp: 18, condition: 'mild', rain: 'moderate', icon: 'cloud-sun' },
    Oct: { temp: 13, condition: 'mild', rain: 'moderate', icon: 'cloud-sun' },
    Nov: { temp: 8, condition: 'cool', rain: 'high', icon: 'cloud-rain' },
    Dec: { temp: 4, condition: 'cold', rain: 'moderate', icon: 'cloud' }
  },
  'Eastern Europe': {
    Jan: { temp: -2, condition: 'very cold', rain: 'low', icon: 'snow' },
    Feb: { temp: 0, condition: 'very cold', rain: 'low', icon: 'snow' },
    Mar: { temp: 5, condition: 'cold', rain: 'low', icon: 'cloud' },
    Apr: { temp: 12, condition: 'mild', rain: 'moderate', icon: 'cloud-sun' },
    May: { temp: 17, condition: 'mild', rain: 'moderate', icon: 'cloud-sun' },
    Jun: { temp: 21, condition: 'warm', rain: 'moderate', icon: 'sun' },
    Jul: { temp: 24, condition: 'hot', rain: 'low', icon: 'sun' },
    Aug: { temp: 23, condition: 'warm', rain: 'low', icon: 'sun' },
    Sep: { temp: 18, condition: 'mild', rain: 'low', icon: 'sun' },
    Oct: { temp: 12, condition: 'mild', rain: 'moderate', icon: 'cloud-sun' },
    Nov: { temp: 5, condition: 'cold', rain: 'moderate', icon: 'cloud' },
    Dec: { temp: 0, condition: 'very cold', rain: 'low', icon: 'snow' }
  },
  'Southern Europe': {
    Jan: { temp: 9, condition: 'cool', rain: 'high', icon: 'cloud-rain' },
    Feb: { temp: 10, condition: 'cool', rain: 'high', icon: 'cloud-rain' },
    Mar: { temp: 12, condition: 'mild', rain: 'moderate', icon: 'cloud-sun' },
    Apr: { temp: 15, condition: 'mild', rain: 'moderate', icon: 'cloud-sun' },
    May: { temp: 19, condition: 'warm', rain: 'low', icon: 'sun' },
    Jun: { temp: 23, condition: 'warm', rain: 'low', icon: 'sun' },
    Jul: { temp: 26, condition: 'hot', rain: 'very low', icon: 'sun' },
    Aug: { temp: 26, condition: 'hot', rain: 'very low', icon: 'sun' },
    Sep: { temp: 23, condition: 'warm', rain: 'low', icon: 'sun' },
    Oct: { temp: 18, condition: 'mild', rain: 'moderate', icon: 'cloud-sun' },
    Nov: { temp: 14, condition: 'mild', rain: 'high', icon: 'cloud-rain' },
    Dec: { temp: 10, condition: 'cool', rain: 'high', icon: 'cloud-rain' }
  },
  'Northern Europe': {
    Jan: { temp: -3, condition: 'very cold', rain: 'moderate', icon: 'snow' },
    Feb: { temp: -3, condition: 'very cold', rain: 'moderate', icon: 'snow' },
    Mar: { temp: 1, condition: 'very cold', rain: 'moderate', icon: 'snow' },
    Apr: { temp: 6, condition: 'cold', rain: 'moderate', icon: 'cloud' },
    May: { temp: 12, condition: 'mild', rain: 'moderate', icon: 'cloud-sun' },
    Jun: { temp: 16, condition: 'mild', rain: 'moderate', icon: 'cloud-sun' },
    Jul: { temp: 19, condition: 'mild', rain: 'moderate', icon: 'sun' },
    Aug: { temp: 18, condition: 'mild', rain: 'moderate', icon: 'sun' },
    Sep: { temp: 14, condition: 'mild', rain: 'moderate', icon: 'cloud-sun' },
    Oct: { temp: 8, condition: 'cool', rain: 'high', icon: 'cloud-rain' },
    Nov: { temp: 3, condition: 'cold', rain: 'high', icon: 'cloud-rain' },
    Dec: { temp: -1, condition: 'very cold', rain: 'moderate', icon: 'snow' }
  }
};

// Top attractions by city
interface Attraction {
  name: string;
  description: string;
  timeNeeded: string; // in hours
  category: 'museum' | 'landmark' | 'park' | 'entertainment' | 'historical';
  rating: number; // out of 5
  mustSee: boolean;
}

const TOP_ATTRACTIONS: Record<string, Attraction[]> = {
  'Paris': [
    { name: 'Eiffel Tower', description: 'Iconic iron lattice tower with stunning city views.', timeNeeded: '2-3', category: 'landmark', rating: 4.6, mustSee: true },
    { name: 'Louvre Museum', description: 'World\'s largest art museum and home to the Mona Lisa.', timeNeeded: '3-4', category: 'museum', rating: 4.8, mustSee: true },
    { name: 'Notre-Dame Cathedral', description: 'Medieval Catholic cathedral with Gothic architecture.', timeNeeded: '1-2', category: 'historical', rating: 4.7, mustSee: true },
    { name: 'Montmartre', description: 'Hilltop district with artists\' square and Sacré-Cœur Basilica.', timeNeeded: '2-3', category: 'landmark', rating: 4.5, mustSee: false },
    { name: 'Seine River Cruise', description: 'Scenic boat tour along Paris\'s historic waterway.', timeNeeded: '1-2', category: 'entertainment', rating: 4.4, mustSee: false }
  ],
  'Rome': [
    { name: 'Colosseum', description: 'Ancient amphitheater in the center of Rome.', timeNeeded: '2-3', category: 'historical', rating: 4.7, mustSee: true },
    { name: 'Vatican Museums', description: 'Museums with Renaissance masterpieces and the Sistine Chapel.', timeNeeded: '3-4', category: 'museum', rating: 4.8, mustSee: true },
    { name: 'Roman Forum', description: 'Ancient Roman social, political, and commercial center.', timeNeeded: '1-2', category: 'historical', rating: 4.6, mustSee: true },
    { name: 'Trevi Fountain', description: 'Baroque fountain known for coin-tossing tradition.', timeNeeded: '0.5-1', category: 'landmark', rating: 4.7, mustSee: true },
    { name: 'Pantheon', description: 'Ancient Roman temple with magnificent dome.', timeNeeded: '1', category: 'historical', rating: 4.8, mustSee: false }
  ],
  'Barcelona': [
    { name: 'Sagrada Familia', description: 'Unfinished Gaudí masterpiece basilica.', timeNeeded: '2-3', category: 'landmark', rating: 4.8, mustSee: true },
    { name: 'Park Güell', description: 'Public park with Gaudí\'s colorful mosaic art.', timeNeeded: '2', category: 'park', rating: 4.7, mustSee: true },
    { name: 'Casa Batlló', description: 'Modernist masterpiece by Antoni Gaudí.', timeNeeded: '1-2', category: 'landmark', rating: 4.6, mustSee: false },
    { name: 'La Rambla', description: 'Popular tree-lined pedestrian street.', timeNeeded: '1-2', category: 'entertainment', rating: 4.3, mustSee: false },
    { name: 'Gothic Quarter', description: 'Historic center with narrow medieval streets.', timeNeeded: '2-3', category: 'historical', rating: 4.7, mustSee: true }
  ],
  'Amsterdam': [
    { name: 'Anne Frank House', description: 'Biographical museum of wartime diarist Anne Frank.', timeNeeded: '1.5-2', category: 'museum', rating: 4.8, mustSee: true },
    { name: 'Van Gogh Museum', description: 'Museum housing the world\'s largest collection of Van Gogh\'s works.', timeNeeded: '2-3', category: 'museum', rating: 4.7, mustSee: true },
    { name: 'Rijksmuseum', description: 'Dutch national museum with arts and history.', timeNeeded: '3-4', category: 'museum', rating: 4.8, mustSee: false },
    { name: 'Canal Cruise', description: 'Boat tour through Amsterdam\'s historic canals.', timeNeeded: '1-1.5', category: 'entertainment', rating: 4.6, mustSee: true },
    { name: 'Vondelpark', description: 'Urban public park with open-air theatre.', timeNeeded: '1-2', category: 'park', rating: 4.5, mustSee: false }
  ],
  'Berlin': [
    { name: 'Brandenburg Gate', description: 'Neoclassical monument and symbol of German unity.', timeNeeded: '0.5-1', category: 'landmark', rating: 4.7, mustSee: true },
    { name: 'Berlin Wall Memorial', description: 'Historic site commemorating divided Germany.', timeNeeded: '1-2', category: 'historical', rating: 4.8, mustSee: true },
    { name: 'Museum Island', description: 'Complex of five world-renowned museums.', timeNeeded: '3-5', category: 'museum', rating: 4.8, mustSee: true },
    { name: 'Reichstag Building', description: 'Historic parliament building with glass dome offering city views.', timeNeeded: '1-2', category: 'landmark', rating: 4.6, mustSee: false },
    { name: 'Tiergarten', description: 'Sprawling urban park with monuments and gardens.', timeNeeded: '1-2', category: 'park', rating: 4.5, mustSee: false }
  ]
};

// Default attractions for cities not in the list
const DEFAULT_ATTRACTIONS: Attraction[] = [
  { name: 'Main Square', description: 'Central city square with historical significance.', timeNeeded: '0.5-1', category: 'landmark', rating: 4.3, mustSee: true },
  { name: 'Local Museum', description: 'Museum showcasing local history and culture.', timeNeeded: '1-2', category: 'museum', rating: 4.2, mustSee: false },
  { name: 'Cathedral', description: 'Historic central cathedral.', timeNeeded: '0.5-1', category: 'historical', rating: 4.4, mustSee: true },
  { name: 'City Park', description: 'Urban park for relaxation.', timeNeeded: '1', category: 'park', rating: 4.1, mustSee: false }
];

// Accommodation types and data
interface Accommodation {
  type: 'hotel' | 'hostel' | 'apartment' | 'guesthouse';
  name: string;
  description: string;
  priceRange: string; // e.g. "€€" or "€€€"
  forBudgetLevel: 'budget' | 'moderate' | 'luxury' | ('budget' | 'moderate' | 'luxury')[];
  amenities: string[];
  bestFor: string[];
  neighborhood?: string;
}

// Accommodation suggestions by city and budget level
const ACCOMMODATIONS: Record<string, Record<string, Accommodation[]>> = {
  'Paris': {
    'budget': [
      {
        type: 'hostel',
        name: 'Le Village Montmartre',
        description: 'Cozy hostel in the artistic Montmartre district with a rooftop terrace.',
        priceRange: '€',
        forBudgetLevel: 'budget',
        amenities: ['Free WiFi', 'Breakfast available', 'Communal kitchen'],
        bestFor: ['Solo travelers', 'Young couples', 'Backpackers'],
        neighborhood: 'Montmartre'
      },
      {
        type: 'hotel',
        name: 'Ibis Budget Paris La Villette',
        description: 'Modern budget hotel near Parc de la Villette and Cité des Sciences.',
        priceRange: '€',
        forBudgetLevel: 'budget',
        amenities: ['Free WiFi', 'Air conditioning', '24-hour reception'],
        bestFor: ['Budget travelers', 'Short stays', 'Business travelers'],
        neighborhood: 'La Villette'
      }
    ],
    'moderate': [
      {
        type: 'hotel',
        name: 'Hotel Bastille Spéria',
        description: 'Contemporary hotel in the trendy Marais district, close to many attractions.',
        priceRange: '€€',
        forBudgetLevel: 'moderate',
        amenities: ['Free WiFi', 'Air conditioning', 'Room service', 'Concierge'],
        bestFor: ['Couples', 'Culture enthusiasts', 'Shopping lovers'],
        neighborhood: 'Le Marais'
      },
      {
        type: 'apartment',
        name: 'Citadines Les Halles',
        description: 'Serviced apartments in central Paris with kitchen facilities.',
        priceRange: '€€',
        forBudgetLevel: 'moderate',
        amenities: ['Free WiFi', 'Kitchenette', 'Laundry facilities', 'Fitness center'],
        bestFor: ['Families', 'Extended stays', 'Independent travelers'],
        neighborhood: 'Les Halles'
      }
    ],
    'luxury': [
      {
        type: 'hotel',
        name: 'Le Meurice',
        description: 'Historic palace hotel with opulent decor and Michelin-starred restaurant.',
        priceRange: '€€€€',
        forBudgetLevel: 'luxury',
        amenities: ['Spa', 'Fine dining', 'Concierge service', 'Luxury toiletries'],
        bestFor: ['Luxury travelers', 'Special occasions', 'Gourmands'],
        neighborhood: '1st Arrondissement'
      }
    ]
  },
  'Rome': {
    'budget': [
      {
        type: 'hostel',
        name: 'The Yellow Hostel',
        description: 'Lively hostel with bar and events, walking distance from Termini Station.',
        priceRange: '€',
        forBudgetLevel: 'budget',
        amenities: ['Free WiFi', 'Bar', 'Tours & activities', '24-hour reception'],
        bestFor: ['Solo travelers', 'Party-goers', 'Backpackers'],
        neighborhood: 'Termini'
      }
    ],
    'moderate': [
      {
        type: 'hotel',
        name: 'Hotel Forum Roma',
        description: 'Charming hotel with terrace overlooking the Roman Forum.',
        priceRange: '€€',
        forBudgetLevel: 'moderate',
        amenities: ['Free WiFi', 'Rooftop terrace', 'Airport shuttle', 'Bar'],
        bestFor: ['History enthusiasts', 'Couples', 'First-time visitors'],
        neighborhood: 'Monti'
      }
    ],
    'luxury': [
      {
        type: 'hotel',
        name: 'Hotel de Russie',
        description: 'Luxury hotel with beautiful gardens between Piazza del Popolo and the Spanish Steps.',
        priceRange: '€€€€',
        forBudgetLevel: 'luxury',
        amenities: ['Spa', 'Garden', 'Fine dining', 'Concierge service'],
        bestFor: ['Luxury travelers', 'Celebrities', 'Special occasions'],
        neighborhood: 'Campo Marzio'
      }
    ]
  }
};

// Default accommodations for cities not in the list
const DEFAULT_ACCOMMODATIONS: Record<string, Accommodation[]> = {
  'budget': [
    {
      type: 'hostel',
      name: 'Central City Hostel',
      description: 'Affordable hostel in the city center with basic amenities.',
      priceRange: '€',
      forBudgetLevel: 'budget',
      amenities: ['Free WiFi', 'Shared kitchen', 'Lockers'],
      bestFor: ['Backpackers', 'Solo travelers', 'Budget travelers']
    },
    {
      type: 'hotel',
      name: 'Budget City Hotel',
      description: 'No-frills hotel with clean rooms at affordable rates.',
      priceRange: '€',
      forBudgetLevel: 'budget',
      amenities: ['Free WiFi', 'Basic breakfast', '24-hour reception'],
      bestFor: ['Budget travelers', 'Short stays', 'Business travelers']
    }
  ],
  'moderate': [
    {
      type: 'hotel',
      name: 'Comfy City Hotel',
      description: 'Mid-range hotel with comfortable rooms and good service.',
      priceRange: '€€',
      forBudgetLevel: 'moderate',
      amenities: ['Free WiFi', 'Breakfast buffet', 'Room service', 'Air conditioning'],
      bestFor: ['Couples', 'Business travelers', 'Families']
    },
    {
      type: 'apartment',
      name: 'City Center Apartments',
      description: 'Well-equipped apartments in central location.',
      priceRange: '€€',
      forBudgetLevel: 'moderate',
      amenities: ['Free WiFi', 'Kitchen', 'Laundry facilities', 'Living area'],
      bestFor: ['Families', 'Extended stays', 'Groups']
    }
  ],
  'luxury': [
    {
      type: 'hotel',
      name: 'Grand City Hotel',
      description: 'Upscale hotel with elegant rooms and premium services.',
      priceRange: '€€€',
      forBudgetLevel: 'luxury',
      amenities: ['Free WiFi', 'Fine dining', 'Spa', 'Concierge service'],
      bestFor: ['Luxury travelers', 'Special occasions', 'Business executives']
    }
  ]
};

// Map of city names to GetYourGuide location ID codes
const getYourGuideLocationIds: Record<string, string> = {
  'Barcelona': '45',
  'Paris': '16',
  'Rome': '33',
  'Amsterdam': '36',
  'Berlin': '17',
  'London': '1',
  'Venice': '105',
  'Prague': '10212',
  'Madrid': '51',
  'Florence': '43',
  'Vienna': '39',
  'Athens': '496',
  'Lisbon': '94',
  'Budapest': '25',
  'Dublin': '55',
  'Zurich': '105',
  'Brussels': '108',
  'Munich': '1316',
  'Milan': '87',
};

export default function SmartTripAssistant({ trip }: SmartTripAssistantProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [budgetLevel, setBudgetLevel] = useState<'budget' | 'moderate' | 'luxury'>('moderate');
  
  // State for API data
  const [weatherData, setWeatherData] = useState<Record<string, any>>({});
  const [budgetData, setBudgetData] = useState<any>(null);
  const [accommodationsData, setAccommodationsData] = useState<Record<string, any[]>>({});
  const [attractionsData, setAttractionsData] = useState<Record<string, any[]>>({});
  const [activitiesData, setActivitiesData] = useState<Record<string, any[]>>({});
  
  // Loading states
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [isLoadingBudget, setIsLoadingBudget] = useState(false);
  const [isLoadingAccommodations, setIsLoadingAccommodations] = useState(false);
  const [isLoadingAttractions, setIsLoadingAttractions] = useState(false);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);

  // Set up effect to fetch data when the trip changes or expandedSection changes
  useEffect(() => {
    if (!trip || !trip.stops || trip.stops.length === 0) return;
    
    // Only fetch data for the currently expanded section
    if (expandedSection === 'weather' && !weatherData) {
      fetchWeatherData();
    } else if (expandedSection === 'budget' && !budgetData) {
      fetchBudgetData();
    } else if (expandedSection === 'accommodations' && Object.keys(accommodationsData).length === 0) {
      fetchAccommodationsData();
    } else if (expandedSection === 'attractions' && Object.keys(attractionsData).length === 0) {
      fetchAttractionsData();
    } else if (expandedSection === 'activities' && Object.keys(activitiesData).length === 0) {
      fetchActivitiesData();
    }
  }, [expandedSection, trip]);

  // Fetch weather data for all stops
  const fetchWeatherData = async () => {
    if (!trip.stops || trip.stops.length === 0) return;
    
    setIsLoadingWeather(true);
    
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
      setIsLoadingWeather(false);
    }
  };

  // Fetch budget data
  const fetchBudgetData = async () => {
    if (!trip.stops || trip.stops.length === 0) return;
    
    setIsLoadingBudget(true);
    
    try {
      // Calculate budget based on trip details
      const budgetParams = {
        stops: trip.stops.map(stop => {
          const city = cities.find(c => c.id === stop.cityId);
          return {
            city: city ? city.name : '',
            country: city ? city.country : '',
            nights: stop.nights || 0
          };
        }),
        budgetLevel,
        travelers: typeof trip.travelers === 'number' ? trip.travelers : 1
      };
      
      // Try to get real budget data
      const realBudgetData = await getTripBudget(budgetParams);
      if (realBudgetData) {
        setBudgetData(realBudgetData);
        return;
      }
      
      // Fallback to local calculation
      setBudgetData(calculateBudget());
    } catch (error: any) {
      console.error('Error fetching budget data:', error);
      setBudgetData(calculateBudget());
    } finally {
      setIsLoadingBudget(false);
    }
  };

  // Fetch accommodations data
  const fetchAccommodationsData = async () => {
    if (!trip.stops || trip.stops.length === 0) return;
    
    setIsLoadingAccommodations(true);
    
    const newAccommodationsData: Record<string, ApiAccommodation[]> = {};
    
    try {
      // Only fetch accommodations for non-stopover cities
      const stopsWithAccommodation = trip.stops.filter(stop => !stop.isStopover);
      
      for (const stop of stopsWithAccommodation) {
        const city = cities.find(c => c.id === stop.cityId);
        if (!city) continue;
        
        try {
          // Calculate check-in and check-out dates
          const checkIn = stop.arrivalDate;
          
          // For check-out, find the next stop's arrival date or use default nights
          let checkOut = '';
          const stopIndex = trip.stops.findIndex(s => s.cityId === stop.cityId && s.arrivalDate === stop.arrivalDate);
          if (stopIndex >= 0 && stopIndex < trip.stops.length - 1) {
            checkOut = trip.stops[stopIndex + 1].arrivalDate;
          } else {
            // If it's the last stop, use nights to calculate
            const checkInDate = new Date(checkIn);
            checkInDate.setDate(checkInDate.getDate() + (stop.nights || 1));
            checkOut = checkInDate.toISOString().split('T')[0];
          }
          
          // Get travelers count
          const adults = trip.travelers && Array.isArray(trip.travelers) ? trip.travelers.length : 1;
          
          // Set price range based on budget level
          let priceMin = 0;
          let priceMax = 1000;
          
          if (budgetLevel === 'budget') {
            priceMax = 80;
          } else if (budgetLevel === 'moderate') {
            priceMin = 60;
            priceMax = 150;
          } else if (budgetLevel === 'luxury') {
            priceMin = 130;
          }
          
          const accommodations = await getAccommodations({
            cityName: city.name,
            checkIn,
            checkOut,
            adults,
            priceMin,
            priceMax,
            limit: 5
          });
          
          newAccommodationsData[city.name] = accommodations;
        } catch (error) {
          console.error(`Error fetching accommodations for ${city.name}:`, error);
          // Use fallback data
        }
      }
      
      setAccommodationsData(prev => ({ ...prev, ...newAccommodationsData }));
    } catch (error) {
      console.error('Error fetching accommodations data:', error);
    } finally {
      setIsLoadingAccommodations(false);
    }
  };

  // Fetch attractions data
  const fetchAttractionsData = async () => {
    if (!trip.stops || trip.stops.length === 0) return;
    
    setIsLoadingAttractions(true);
    
    const newAttractionsData: Record<string, ApiAttraction[]> = {};
    
    try {
      for (const stop of trip.stops) {
        const city = cities.find(c => c.id === stop.cityId);
        if (!city) continue;
        
        try {
          const categories = ['museums', 'landmarks', 'nature', 'entertainment'];
          
          const attractions = await getAttractions({
            cityName: city.name,
            categories,
            limit: 10
          });
          
          newAttractionsData[city.name] = attractions;
        } catch (error) {
          console.error(`Error fetching attractions for ${city.name}:`, error);
          // Use fallback data
        }
      }
      
      setAttractionsData(prev => ({ ...prev, ...newAttractionsData }));
    } catch (error) {
      console.error('Error fetching attractions data:', error);
    } finally {
      setIsLoadingAttractions(false);
    }
  };

  // Add this new function to fetch activities from GetYourGuide
  const fetchActivitiesData = async () => {
    if (!trip || !trip.stops || trip.stops.length === 0) return;
    
    setIsLoadingActivities(true);
    
    try {
      const activities: Record<string, any[]> = {};
      
      for (const stop of trip.stops) {
        if (stop.isStopover) continue; // Skip stopovers
        
        const city = cities.find(c => c.id === stop.cityId);
        if (!city) continue;
        
        // Get the dates for this stop
        const arrivalDate = stop.arrivalDate;
        let departureDate;
        
        try {
          // Calculate departure date if it's not provided but we have nights
          if (stop.departureDate) {
            departureDate = stop.departureDate;
          } else if (stop.arrivalDate && stop.nights) {
            const arrivalDateTime = new Date(stop.arrivalDate);
            
            // Verify arrival date is valid
            if (!isNaN(arrivalDateTime.getTime())) {
              // Add nights to get the departure date
              const departureDateObj = new Date(arrivalDateTime.getTime() + stop.nights * 24 * 60 * 60 * 1000);
              departureDate = departureDateObj.toISOString().split('T')[0];
            } else {
              console.warn(`Invalid arrival date: ${stop.arrivalDate}, using only arrival date for activities`);
              departureDate = undefined;
            }
          } else {
            departureDate = undefined;
          }
        } catch (error) {
          console.warn(`Error calculating departure date: ${error}`, error);
          departureDate = undefined;
        }
        
        // Get activities from GetYourGuide
        const cityActivities = await getActivities(city.name, 5, arrivalDate, departureDate);
        activities[city.name] = cityActivities;
      }
      
      setActivitiesData(activities);
    } catch (error) {
      console.error('Error fetching GetYourGuide activities:', error);
    } finally {
      setIsLoadingActivities(false);
    }
  };

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // Calculate the budget for the trip
  const calculateBudget = () => {
    if (!trip || !trip.stops || trip.stops.length === 0) return null;
    
    const stops = trip.stops;
    const nights = stops.reduce((total, stop) => total + (stop.isStopover ? 0 : (stop.nights || 1)), 0);
    const citiesCount = stops.length;
    const travelDays = stops.filter(stop => !stop.isStopover).length - 1 + (stops[0].isStopover ? 1 : 0) + (stops[stops.length - 1].isStopover ? 1 : 0);
    
    // Different cost categories based on budget level
    const accommodationCosts = {
      budget: 50,
      moderate: 100,
      luxury: 200
    };
    
    const foodCosts = {
      budget: 30,
      moderate: 50,
      luxury: 100
    };
    
    const activityCosts = {
      budget: 20,
      moderate: 40,
      luxury: 80
    };
    
    const transportCosts = {
      budget: 30,
      moderate: 50,
      luxury: 100
    };
    
    // Calculate costs based on budget level
    const accommodation = accommodationCosts[budgetLevel] * nights;
    const food = foodCosts[budgetLevel] * (nights + travelDays);
    const activities = activityCosts[budgetLevel] * citiesCount;
    const transport = transportCosts[budgetLevel] * travelDays;
    
    const totalCost = accommodation + food + activities + transport;
    
    return {
      totalCost,
      accommodation,
      food,
      activities,
      transport,
      details: {
        nights,
        cities: citiesCount,
        travelDays
      }
    };
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

  // Format currency
  const formatCurrency = (amount: number) => {
    return `€${Math.round(amount)}`;
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
    
    return WEATHER_DATA[region][month as keyof typeof WEATHER_DATA[typeof region]];
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
    if (avgTemp < 5) {
      packingAdvice = 'Pack heavy winter clothes, gloves, scarf, and waterproof boots.';
    } else if (avgTemp < 12) {
      packingAdvice = 'Pack warm clothes with layers, a good jacket, and a waterproof outer layer.';
    } else if (avgTemp < 18) {
      packingAdvice = 'Pack layers, light jacket, and some warmer options for evenings.';
    } else if (avgTemp < 24) {
      packingAdvice = 'Pack light clothes, but bring a light jacket for evenings and some rain protection.';
    } else {
      packingAdvice = 'Pack light summer clothes, sun protection, and perhaps a very light jacket for evenings.';
    }
    
    return {
      weatherByStop,
      extremeWeather,
      avgTemp,
      packingAdvice
    };
  };

  // Calculate train pass recommendations
  const calculateTrainPass = () => {
    if (!trip || !trip.stops || trip.stops.length < 2) return null;
    
    // Count number of travel days (connections between cities)
    const travelDays = trip.stops.length - 1;
    
    // Count number of countries visited
    const countries = new Set<string>();
    trip.stops.forEach(stop => {
      const city = cities.find(c => c.id === stop.cityId);
      if (city) {
        countries.add(city.country);
      }
    });
    
    // Figure out total trip duration in days
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    const tripDuration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Determine age category (using adult as default)
    const ageCategory = 'adult';
    
    // Calculate individual ticket costs (from budget estimation)
    const budgetEstimation = calculateBudget();
    const individualTicketCost = budgetEstimation?.transport || 0;
    
    // Find suitable pass options
    const suitablePasses = [];
    
    // For 5 or more travel days, consider a Global Pass
    if (travelDays >= 5) {
      // 5 days in 1 month
      if (travelDays <= 5 && tripDuration <= 30) {
        suitablePasses.push({
          name: 'Global Pass - 5 days in 1 month',
          price: RAIL_PASSES['Global Pass']['5 days in 1 month'][ageCategory],
          savings: individualTicketCost - RAIL_PASSES['Global Pass']['5 days in 1 month'][ageCategory],
          recommended: true
        });
      }
      
      // 7 days in 1 month
      if (travelDays <= 7 && tripDuration <= 30) {
        suitablePasses.push({
          name: 'Global Pass - 7 days in 1 month',
          price: RAIL_PASSES['Global Pass']['7 days in 1 month'][ageCategory],
          savings: individualTicketCost - RAIL_PASSES['Global Pass']['7 days in 1 month'][ageCategory],
          recommended: travelDays > 5
        });
      }
      
      // 10 days in 2 months
      if (travelDays <= 10 && tripDuration <= 60) {
        suitablePasses.push({
          name: 'Global Pass - 10 days in 2 months',
          price: RAIL_PASSES['Global Pass']['10 days in 2 months'][ageCategory],
          savings: individualTicketCost - RAIL_PASSES['Global Pass']['10 days in 2 months'][ageCategory],
          recommended: travelDays > 7
        });
      }
      
      // Continuous passes for intensive travel
      if (tripDuration <= 15 && travelDays > 7) {
        suitablePasses.push({
          name: 'Global Pass - 15 consecutive days',
          price: RAIL_PASSES['Global Pass']['15 consecutive days'][ageCategory],
          savings: individualTicketCost - RAIL_PASSES['Global Pass']['15 consecutive days'][ageCategory],
          recommended: tripDuration > 10 && travelDays > tripDuration / 2
        });
      }
      
      if (tripDuration <= 30 && travelDays > 10) {
        suitablePasses.push({
          name: 'Global Pass - 1 month continuous',
          price: RAIL_PASSES['Global Pass']['1 month continuous'][ageCategory],
          savings: individualTicketCost - RAIL_PASSES['Global Pass']['1 month continuous'][ageCategory],
          recommended: tripDuration > 20 && travelDays > tripDuration / 2
        });
      }
    }
    
    // Sort by savings (best value first)
    suitablePasses.sort((a, b) => b.savings - a.savings);
    
    return {
      travelDays,
      countriesCount: countries.size,
      countriesList: Array.from(countries),
      tripDuration,
      individualTicketCost,
      suitablePasses
    };
  };

  // Get top attractions for the trip
  const getAttractionRecommendations = () => {
    if (!trip || !trip.stops || trip.stops.length === 0) return null;
    
    const recommendationsByCity = trip.stops.map(stop => {
      const city = cities.find(c => c.id === stop.cityId);
      if (!city) return null;
      
      // Calculate how many days the traveler has in this city
      const days = stop.isStopover ? 0.5 : (stop.nights || 1);
      
      // Calculate how many hours available for sightseeing (assuming 8 hours per day)
      const hoursAvailable = days * 8;
      
      // Try to use real attractions data if available
      const cityAttractions = attractionsData[city.name] || [];
      
      if (cityAttractions.length > 0) {
        // Sort by rating (highest first)
        const sortedAttractions = [...cityAttractions].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        
        // Fit attractions into available time (estimate 2 hours per attraction as average)
        let remainingHours = hoursAvailable;
        const recommendedAttractions = [];
        const additionalAttractions = [];
        
        for (const attraction of sortedAttractions) {
          // Estimate 2 hours per attraction as a default
          const avgTime = 2;
          
          if (remainingHours >= avgTime) {
            recommendedAttractions.push({
              name: attraction.name,
              description: attraction.description || '',
              timeNeeded: '2',
              category: attraction.type,
              rating: attraction.rating || 4.0,
              mustSee: attraction.tags.some((tag: string) => tag.toLowerCase().includes('popular') || tag.toLowerCase().includes('must see')),
              avgTime
            });
            remainingHours -= avgTime;
          } else {
            additionalAttractions.push({
              name: attraction.name,
              description: attraction.description || '',
              timeNeeded: '2',
              category: attraction.type,
              rating: attraction.rating || 4.0,
              mustSee: false,
              avgTime
            });
          }
        }
        
        return {
          city: city.name,
          country: city.country,
          days,
          hoursAvailable,
          recommendedAttractions,
          additionalAttractions
        };
      }
      
      // Fall back to original mock data if no real data
      const mockAttractions = TOP_ATTRACTIONS[city.name] || DEFAULT_ATTRACTIONS;
      
      // Sort attractions by rating and must-see status
      const sortedAttractions = [...mockAttractions].sort((a, b) => {
        if (a.mustSee && !b.mustSee) return -1;
        if (!a.mustSee && b.mustSee) return 1;
        return b.rating - a.rating;
      });
      
      // Fit attractions into available time
      let remainingHours = hoursAvailable;
      const recommendedAttractions = [];
      const additionalAttractions = [];
      
      for (const attraction of sortedAttractions) {
        // Parse time range (e.g., "2-3" becomes average 2.5)
        const timeRange = attraction.timeNeeded.split('-').map(Number);
        const avgTime = timeRange.length === 1 ? timeRange[0] : (timeRange[0] + timeRange[1]) / 2;
        
        if (remainingHours >= avgTime) {
          recommendedAttractions.push({
            ...attraction,
            avgTime
          });
          remainingHours -= avgTime;
        } else {
          additionalAttractions.push({
            ...attraction,
            avgTime
          });
        }
      }
      
      return {
        city: city.name,
        country: city.country,
        days,
        hoursAvailable,
        recommendedAttractions,
        additionalAttractions
      };
    }).filter(Boolean) as Array<{
      city: string;
      country: string;
      days: number;
      hoursAvailable: number;
      recommendedAttractions: Array<any>;
      additionalAttractions: Array<any>;
    }>;
    
    return recommendationsByCity;
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'museum':
        return <GlobeEuropeAfricaIcon className="h-4 w-4 text-purple-500" />;
      case 'landmark':
        return <PhotoIcon className="h-4 w-4 text-blue-500" />;
      case 'historical':
        return <HomeIcon className="h-4 w-4 text-amber-500" />;
      case 'park':
        return <SunIcon className="h-4 w-4 text-green-500" />;
      case 'entertainment':
        return <TicketIcon className="h-4 w-4 text-pink-500" />;
      default:
        return <PhotoIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get accommodation suggestions using the real accommodations data
  const getAccommodationSuggestions = () => {
    if (!trip || !trip.stops || trip.stops.length === 0) return null;
    
    return trip.stops
      .filter(stop => !stop.isStopover) // Only suggest accommodations for overnight stays
      .map(stop => {
        const city = cities.find(c => c.id === stop.cityId);
        if (!city) return null;
        
        // Try to use real accommodations data if available
        if (accommodationsData[city.name] && accommodationsData[city.name].length > 0) {
          const apiAccommodations = accommodationsData[city.name];
          
          // Transform API accommodations to the format needed by the component
          const suggestions = apiAccommodations.map(acc => {
            // Determine budget level based on price
            let forBudgetLevel: 'budget' | 'moderate' | 'luxury' | ('budget' | 'moderate' | 'luxury')[];
            let priceRange = '';
            
            if (acc.price.amount < 60) {
              forBudgetLevel = 'budget';
              priceRange = '€';
            } else if (acc.price.amount < 130) {
              forBudgetLevel = 'moderate';
              priceRange = '€€';
            } else {
              forBudgetLevel = 'luxury';
              priceRange = acc.price.amount < 200 ? '€€€' : '€€€€';
            }
            
            return {
              type: acc.type,
              name: acc.name,
              description: acc.address,
              priceRange,
              forBudgetLevel,
              amenities: acc.amenities,
              bestFor: acc.type === 'hostel' 
                ? ['Solo travelers', 'Budget travelers'] 
                : (acc.type === 'apartment' 
                  ? ['Families', 'Extended stays'] 
                  : ['Couples', 'Business travelers']),
              neighborhood: acc.address.split(',')[0]
            };
          });
          
          // Calculate number of people if available
          const numTravelers = trip.travelers && Array.isArray(trip.travelers) ? trip.travelers.length : 1;
          const stayType = numTravelers === 1 ? 'solo' : (numTravelers === 2 ? 'couple' : 'group');
          
          return {
            city: city.name,
            country: city.country,
            nights: stop.nights || 1,
            suggestions,
            stayType
          };
        }
        
        // Fall back to original accommodation suggestions
        const cityAccommodations = ACCOMMODATIONS[city.name];
        let suggestions: Accommodation[] = [];
        
        if (cityAccommodations) {
          suggestions = cityAccommodations[budgetLevel] || [];
          
          // If no specific accommodations for this budget level, try to get others
          if (suggestions.length === 0) {
            if (budgetLevel === 'budget' && cityAccommodations['moderate']) {
              suggestions = cityAccommodations['moderate'].filter(a => 
                a.priceRange.length <= 2 || 
                (typeof a.forBudgetLevel === 'string' ? a.forBudgetLevel === 'budget' : a.forBudgetLevel.includes('budget')));
            } else if (budgetLevel === 'luxury' && cityAccommodations['moderate']) {
              suggestions = cityAccommodations['moderate'].filter(a => 
                a.priceRange.length >= 3 || 
                (typeof a.forBudgetLevel === 'string' ? a.forBudgetLevel === 'luxury' : a.forBudgetLevel.includes('luxury')));
            }
          }
        }
        
        // If still no suggestions, use default accommodations
        if (suggestions.length === 0) {
          suggestions = DEFAULT_ACCOMMODATIONS[budgetLevel] || [];
        }
        
        // Calculate number of people if available
        const numTravelers = trip.travelers && Array.isArray(trip.travelers) ? trip.travelers.length : 1;
        const stayType = numTravelers === 1 ? 'solo' : (numTravelers === 2 ? 'couple' : 'group');
        
        return {
          city: city.name,
          country: city.country,
          nights: stop.nights || 1,
          suggestions,
          stayType
        };
      })
      .filter(Boolean) as Array<{
        city: string;
        country: string;
        nights: number;
        suggestions: any[];
        stayType: string;
      }>;
  };
  
  // Get accommodation type icon
  const getAccommodationIcon = (type: string) => {
    switch (type) {
      case 'hotel':
        return <BuildingOfficeIcon className="h-4 w-4 text-blue-500" />;
      case 'hostel':
        return <UserGroupIcon className="h-4 w-4 text-green-500" />;
      case 'apartment':
        return <HomeIcon className="h-4 w-4 text-amber-500" />;
      case 'guesthouse':
        return <HomeIcon className="h-4 w-4 text-purple-500" />;
      default:
        return <BuildingOfficeIcon className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Format price range display
  const getPriceDisplay = (priceRange: string) => {
    // Count the number of € characters in the string
    const priceLevel = priceRange ? 
      priceRange.split('').filter(char => char === '€').length : 0;
    
    return (
      <div className="flex items-center">
        {Array.from({ length: 4 }).map((_, i) => (
          <CurrencyEuroIcon 
            key={i} 
            className={`h-3.5 w-3.5 ${i < priceLevel ? 'text-amber-500' : 'text-gray-200'}`} 
          />
        ))}
      </div>
    );
  };

  const budget = calculateBudget();
  const weatherAdvice = getWeatherAdvice();
  const trainPassAdvice = calculateTrainPass();
  const attractionRecommendations = getAttractionRecommendations();
  const accommodationSuggestions = getAccommodationSuggestions();

  // Format tag display
  const getTagDisplay = (tag: string) => {
    return (
      <span 
        key={tag} 
        className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full mr-1 mb-1"
      >
        {tag}
      </span>
    );
  };

  // Add a helper function to map country names to country codes
  const getActivityCountry = (country: string): string => {
    const countryMap: Record<string, string> = {
      'Spain': 'spain',
      'France': 'france',
      'Italy': 'italy',
      'Germany': 'germany',
      'Netherlands': 'netherlands',
      'United Kingdom': 'united-kingdom',
      'Portugal': 'portugal',
      'Greece': 'greece',
      'Austria': 'austria',
      'Switzerland': 'switzerland',
      'Belgium': 'belgium',
      'Czech Republic': 'czech-republic',
      'Hungary': 'hungary',
      'Sweden': 'sweden',
      'Denmark': 'denmark',
      'Norway': 'norway',
      'Finland': 'finland',
      'Poland': 'poland',
      'Ireland': 'ireland',
      'Croatia': 'croatia'
    };
    
    return countryMap[country] || '';
  };

  // Add the date formatting function
  const formatDateForGetYourGuide = (dateString: string): string => {
    if (!dateString) return '';
    
    try {
      // Check if the date string is valid
      const date = new Date(dateString);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.warn(`Invalid date string in SmartTripAssistant: ${dateString}, using today's date as fallback`);
        // Use current date as fallback
        const today = new Date();
        return today.toISOString().split('T')[0]; // Returns YYYY-MM-DD
      }
      
      return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    } catch (error) {
      console.warn(`Error formatting date in SmartTripAssistant: ${dateString}, using today's date as fallback`, error);
      // Use current date as fallback
      const today = new Date();
      return today.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-4">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-[#264653]">Smart Trip Assistant</h2>
        <p className="text-sm text-gray-500">Intelligent suggestions to enhance your trip</p>
      </div>
      
      {/* Budget Estimation */}
      <div className="border-b border-gray-200">
        <button 
          className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection('budget')}
        >
          <div className="flex items-center">
            <BanknotesIcon className="h-5 w-5 text-[#06D6A0] mr-2" />
            <span className="font-medium text-[#264653]">Budget Estimation</span>
          </div>
          {expandedSection === 'budget' ? 
            <ChevronUpIcon className="h-5 w-5 text-gray-400" /> : 
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          }
        </button>
        
        {expandedSection === 'budget' && (
          <div className="p-4 bg-gray-50">
            {/* Budget Level Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Travel Style</label>
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button 
                  onClick={() => setBudgetLevel('budget')}
                  className={`flex-1 py-2 text-sm font-medium ${budgetLevel === 'budget' 
                    ? 'bg-[#06D6A0] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Budget
                </button>
                <button 
                  onClick={() => setBudgetLevel('moderate')}
                  className={`flex-1 py-2 text-sm font-medium ${budgetLevel === 'moderate' 
                    ? 'bg-[#06D6A0] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Mid-range
                </button>
                <button 
                  onClick={() => setBudgetLevel('luxury')}
                  className={`flex-1 py-2 text-sm font-medium ${budgetLevel === 'luxury' 
                    ? 'bg-[#06D6A0] text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  Luxury
                </button>
              </div>
            </div>
            
            {budget ? (
              <div>
                <div className="mb-4">
                  <div className="text-2xl font-bold text-[#264653] text-center">
                    {formatCurrency(budget.totalCost)}
                  </div>
                  <div className="text-sm text-gray-500 text-center">
                    Estimated total for {trip.travelers && Array.isArray(trip.travelers) ? trip.travelers.length : 1} {(trip.travelers && Array.isArray(trip.travelers) ? trip.travelers.length : 1) === 1 ? 'person' : 'people'}
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Accommodation:</span>
                    <span className="font-medium">{formatCurrency(budget.accommodation)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Food:</span>
                    <span className="font-medium">{formatCurrency(budget.food)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Attractions:</span>
                    <span className="font-medium">{formatCurrency(budget.activities)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Transport:</span>
                    <span className="font-medium">{formatCurrency(budget.transport)}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
                    <span className="font-medium text-gray-700">Total:</span>
                    <span className="font-bold text-[#264653]">{formatCurrency(budget.totalCost)}</span>
                  </div>
                </div>
                
                {/* Budget breakdown */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Trip Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Nights:</span>
                      <span className="font-medium">{budget.details.nights}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Cities:</span>
                      <span className="font-medium">{budget.details.cities}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Travel days:</span>
                      <span className="font-medium">{budget.details.travelDays}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Add some stops to your trip to see a budget estimate.</p>
            )}
          </div>
        )}
      </div>
      
      {/* Weather Forecast */}
      <div className="border-b border-gray-200">
        <button 
          className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection('weather')}
        >
          <div className="flex items-center">
            <CloudIcon className="h-5 w-5 text-[#06D6A0] mr-2" />
            <span className="font-medium text-[#264653]">Weather Forecast</span>
          </div>
          {expandedSection === 'weather' ? 
            <ChevronUpIcon className="h-5 w-5 text-gray-400" /> : 
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          }
        </button>
        
        {expandedSection === 'weather' && weatherAdvice && (
          <div className="p-4 bg-gray-50">
            <div className="mb-4">
              <h3 className="font-medium text-[#264653] mb-2">Expected Weather During Your Trip</h3>
              
              <div className="space-y-4 mb-6">
                {weatherAdvice.weatherByStop.map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                    <div>
                      <div className="font-medium">{item.city}</div>
                      <div className="text-sm text-gray-500">{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-right mr-3">
                        <div className="font-bold">
                          {item.weather ? (
                            'temp' in item.weather ? (
                              typeof item.weather.temp === 'number' 
                                ? item.weather.temp 
                                : (item.weather.temp && typeof item.weather.temp === 'object' && 'day' in item.weather.temp 
                                    ? item.weather.temp.day 
                                    : 0)
                            ) : ((item.weather as any).temp || 0)
                          ) : 0}°C
                        </div>
                        <div className="text-sm capitalize">{item.weather?.condition || ''}</div>
                      </div>
                      {getWeatherIcon(item.weather?.icon || 'cloud')}
                    </div>
                  </div>
                ))}
              </div>
              
              {weatherAdvice.extremeWeather.length > 0 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                  <div className="flex">
                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2" />
                    <div>
                      <p className="font-medium text-yellow-700">Weather Advisory</p>
                      <ul className="mt-1 text-sm text-yellow-700 list-disc list-inside">
                        {weatherAdvice.extremeWeather.map((item, index) => (
                          <li key={index}>
                            {item.city} - {item.weather?.condition || ''} conditions with {
                              item.weather ? (
                                'rainLevel' in item.weather 
                                  ? item.weather.rainLevel 
                                  : ('rain' in item.weather ? item.weather.rain : 'unknown')
                              ) : 'unknown'
                            } chance of rain
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Packing Recommendation</h4>
                <p className="text-blue-700">{weatherAdvice.packingAdvice}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Train Pass Calculator */}
      <div className="border-b border-gray-200">
        <button 
          className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection('trainpass')}
        >
          <div className="flex items-center">
            <TicketIcon className="h-5 w-5 text-[#06D6A0] mr-2" />
            <span className="font-medium text-[#264653]">Train Pass Calculator</span>
          </div>
          {expandedSection === 'trainpass' ? 
            <ChevronUpIcon className="h-5 w-5 text-gray-400" /> : 
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          }
        </button>
        
        {expandedSection === 'trainpass' && trainPassAdvice && (
          <div className="p-4 bg-gray-50">
            <div className="mb-4">
              <h3 className="font-medium text-[#264653] mb-2">Train Pass Analysis</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500">Travel Days</div>
                  <div className="text-xl font-bold text-[#06D6A0]">{trainPassAdvice.travelDays}</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500">Countries</div>
                  <div className="text-xl font-bold text-[#06D6A0]">{trainPassAdvice.countriesCount}</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500">Trip Duration</div>
                  <div className="text-xl font-bold text-[#06D6A0]">{trainPassAdvice.tripDuration} days</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500">Individual Tickets</div>
                  <div className="text-xl font-bold text-[#06D6A0]">{formatCurrency(trainPassAdvice.individualTicketCost)}</div>
                </div>
              </div>
              
              <h4 className="font-medium text-[#264653] mb-2">Countries Visited</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {trainPassAdvice.countriesList.map((country, index) => (
                  <span key={index} className="bg-[#06D6A0]/10 text-[#06D6A0] px-2 py-1 rounded-full text-sm">
                    {country}
                  </span>
                ))}
              </div>
              
              <h4 className="font-medium text-[#264653] mb-2">Recommended Rail Passes</h4>
              
              {trainPassAdvice.suitablePasses.length > 0 ? (
                <div className="space-y-3">
                  {trainPassAdvice.suitablePasses.map((pass, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg shadow-sm border ${pass.recommended ? 'border-[#06D6A0] bg-[#06D6A0]/5' : 'border-gray-200 bg-white'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-[#264653]">{pass.name}</div>
                          <div className="text-sm text-gray-500">Price: {formatCurrency(pass.price)}</div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${pass.savings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {pass.savings > 0 ? 'Save ' + formatCurrency(pass.savings) : 'Costs ' + formatCurrency(-pass.savings) + ' more'}
                          </div>
                          {pass.recommended && (
                            <div className="mt-1 text-xs bg-[#06D6A0] text-white px-2 py-0.5 rounded-full inline-block">
                              Recommended
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="bg-blue-50 p-4 rounded-lg mt-4">
                    <h4 className="font-medium text-blue-800 mb-2">Rail Pass Benefits</h4>
                    <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
                      <li>Flexibility to change travel plans without buying new tickets</li>
                      <li>Skip ticket lines at most stations</li>
                      <li>Free or discounted travel on some scenic routes and ferries</li>
                      <li>Access to lounges in major stations (1st class passes)</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                  <p className="text-gray-500">Individual tickets are likely more economical for your trip.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Attraction Recommendations */}
      <div className="border-b border-gray-200">
        <button 
          className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection('attractions')}
        >
          <div className="flex items-center">
            <PhotoIcon className="h-5 w-5 text-[#06D6A0] mr-2" />
            <span className="font-medium text-[#264653]">Attraction Recommendations</span>
          </div>
          {expandedSection === 'attractions' ? 
            <ChevronUpIcon className="h-5 w-5 text-gray-400" /> : 
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          }
        </button>
        
        {expandedSection === 'attractions' && attractionRecommendations && attractionRecommendations.length > 0 && (
          <div className="p-4 bg-gray-50">
            <div className="mb-4">
              <h3 className="font-medium text-[#264653] mb-2">Top Attractions For Your Trip</h3>
              
              <div className="space-y-6">
                {attractionRecommendations.map((cityRec, cityIndex) => (
                  <div key={cityIndex} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-[#264653]">{cityRec.city}, {cityRec.country}</h4>
                        <div className="text-sm text-gray-500 flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {cityRec.days < 1 ? 'Stopover' : `${cityRec.days} ${cityRec.days === 1 ? 'day' : 'days'} available`}
                        </div>
                      </div>
                      {cityRec.days < 1 ? (
                        <div className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          Limited Time
                        </div>
                      ) : cityRec.days <= 2 ? (
                        <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Quick Visit
                        </div>
                      ) : (
                        <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Extended Stay
                        </div>
                      )}
                    </div>
                    
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Recommended Attractions</h5>
                    {cityRec.recommendedAttractions.length > 0 ? (
                      <div className="space-y-2 mb-4">
                        {cityRec.recommendedAttractions.map((attraction, attrIndex) => (
                          <div key={attrIndex} className="flex justify-between items-start p-2 border-b border-gray-100">
                            <div className="flex-1">
                              <div className="flex items-center">
                                {getCategoryIcon(attraction.category)}
                                <span className="ml-2 font-medium">{attraction.name}</span>
                                {attraction.mustSee && (
                                  <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-800 text-xs rounded">
                                    Must See
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 mt-1">{attraction.description}</p>
                            </div>
                            <div className="flex items-center ml-4 text-sm">
                              <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-gray-600">{attraction.timeNeeded} hrs</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm italic mb-4">Not enough time for attractions.</p>
                    )}
                    
                    {cityRec.additionalAttractions.length > 0 && (
                      <>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">If You Have More Time</h5>
                        <div className="space-y-2">
                          {cityRec.additionalAttractions.slice(0, 3).map((attraction, attrIndex) => (
                            <div key={attrIndex} className="flex justify-between items-start p-2 border-b border-gray-100">
                              <div className="flex-1">
                                <div className="flex items-center">
                                  {getCategoryIcon(attraction.category)}
                                  <span className="ml-2 font-medium">{attraction.name}</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">{attraction.description}</p>
                              </div>
                              <div className="flex items-center ml-4 text-sm">
                                <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                                <span className="text-gray-600">{attraction.timeNeeded} hrs</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg mt-6">
                <h4 className="font-medium text-blue-800 mb-2">Planning Tip</h4>
                <p className="text-sm text-blue-700">
                  Consider purchasing "skip-the-line" tickets for popular attractions to maximize your time.
                  Many museums offer reduced or free entry on certain days of the month.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* GetYourGuide Activities */}
      <div className="border-b border-gray-200">
        <button 
          className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection('activities')}
        >
          <div className="flex items-center">
            <TicketIcon className="h-5 w-5 text-[#06D6A0] mr-2" />
            <span className="font-medium text-[#264653]">Bookable Activities</span>
          </div>
          {expandedSection === 'activities' ? 
            <ChevronUpIcon className="h-5 w-5 text-gray-400" /> : 
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          }
        </button>
        
        {expandedSection === 'activities' && (
          <div className="p-4 bg-gray-50">
            {isLoadingActivities ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#06D6A0]"></div>
              </div>
            ) : (
              <div>
                <h3 className="font-medium text-[#264653] mb-4">Book Experiences with GetYourGuide</h3>
                
                {trip && trip.stops && trip.stops.length > 0 ? (
                  <div className="space-y-6">
                    {trip.stops
                      .filter(stop => !stop.isStopover)
                      .map(stop => {
                        const city = cities.find(c => c.id === stop.cityId);
                        if (!city) return null;
                        
                        const cityActivities = activitiesData[city.name] || [];
                        
                        return (
                          <div key={`activity-${stop.cityId}-${stop.arrivalDate}`} className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-medium text-[#264653]">{city.name}, {city.country}</h4>
                                <div className="text-sm text-gray-500">
                                  {stop.nights} {stop.nights === 1 ? 'night' : 'nights'} · Popular experiences
                                </div>
                              </div>
                            </div>
                            
                            {cityActivities.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                {cityActivities.map((activity, index) => (
                                  <div key={activity.id} className="border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="aspect-[4/3] relative">
                                      <img 
                                        src={activity.image || `https://via.placeholder.com/400x300?text=${encodeURIComponent(activity.title)}`}
                                        alt={activity.title}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="p-3">
                                      <h5 className="font-medium text-[#264653] mb-1 line-clamp-2">{activity.title}</h5>
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center text-sm text-amber-500">
                                          {'★'.repeat(Math.round(activity.rating))}
                                          <span className="text-gray-500 ml-1">({activity.reviewCount})</span>
                                        </div>
                                        <div className="text-sm text-gray-500">{activity.duration}</div>
                                      </div>
                                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{activity.description}</p>
                                      <div className="flex items-center justify-between">
                                        <div className="font-bold text-[#264653]">
                                          From {activity.price.amount} {activity.price.currency}
                                        </div>
                                        <a 
                                          href={activity.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="px-3 py-1 bg-[#06D6A0] text-white text-sm rounded-full hover:bg-[#06D6A0]/90 transition-colors"
                                        >
                                          Book Now
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="p-4 text-center text-gray-500">
                                <p className="mb-2">Loading activities for {city.name}...</p>
                                <p className="text-xs text-gray-400 mb-4">Note: Some activities show placeholder data while waiting for API approval</p>
                                <div 
                                  className="mt-4"
                                  dangerouslySetInnerHTML={{ 
                                    __html: getActivityWidgetHtml(city.name, 4, stop.arrivalDate)
                                  }}
                                />
                              </div>
                            )}
                            
                            <div className="mt-2 text-center">
                              <a 
                                href={`https://www.getyourguide.com/s/?q=${encodeURIComponent(city.name)}&date=${stop.arrivalDate ? formatDateForGetYourGuide(stop.arrivalDate) : ''}&partner_id=${process.env.NEXT_PUBLIC_GETYOURGUIDE_PARTNER_ID || 'QUGIHFI'}`}
                                target="_blank"
                                rel="noopener noreferrer" 
                                className="text-[#06D6A0] hover:underline text-sm font-medium"
                              >
                                See all {city.name} activities on GetYourGuide →
                              </a>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Add some stops to your trip to see bookable activities.</p>
                )}
                
                <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <img 
                      src="https://cdn.getyourguide.com/tf/assets/static/logos/gyg-logo.svg" 
                      alt="GetYourGuide" 
                      className="h-5 mr-2"
                    />
                    <h4 className="font-medium text-blue-800">GetYourGuide Benefits</h4>
                  </div>
                  <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
                    <li>24/7 customer service in multiple languages</li>
                    <li>Free cancellation up to 24 hours before most activities</li>
                    <li>Skip-the-line tickets to popular attractions</li>
                    <li>Verified customer reviews and ratings</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Accommodation Suggestions */}
      <div className="border-b border-gray-200">
        <button 
          className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
          onClick={() => toggleSection('accommodations')}
        >
          <div className="flex items-center">
            <HomeIcon className="h-5 w-5 text-[#06D6A0] mr-2" />
            <span className="font-medium text-[#264653]">Accommodation Suggestions</span>
          </div>
          {expandedSection === 'accommodations' ? 
            <ChevronUpIcon className="h-5 w-5 text-gray-400" /> : 
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          }
        </button>
        
        {expandedSection === 'accommodations' && accommodationSuggestions && accommodationSuggestions.length > 0 && (
          <div className="p-4 bg-gray-50">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-[#264653]">Where to Stay</h3>
                
                <div className="flex items-center space-x-2 bg-white rounded-lg p-1 border border-gray-200">
                  <button 
                    onClick={() => setBudgetLevel('budget')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      budgetLevel === 'budget' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Budget
                  </button>
                  <button 
                    onClick={() => setBudgetLevel('moderate')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      budgetLevel === 'moderate' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Moderate
                  </button>
                  <button 
                    onClick={() => setBudgetLevel('luxury')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      budgetLevel === 'luxury' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Luxury
                  </button>
                </div>
              </div>
              
              <div className="space-y-6">
                {accommodationSuggestions.map((citySuggestion, cityIndex) => (
                  <div key={cityIndex} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-[#264653]">{citySuggestion.city}, {citySuggestion.country}</h4>
                        <div className="text-sm text-gray-500 flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {citySuggestion.nights} {citySuggestion.nights === 1 ? 'night' : 'nights'} stay
                        </div>
                      </div>
                    </div>
                    
                    {citySuggestion.suggestions.length > 0 ? (
                      <div className="space-y-3">
                        {citySuggestion.suggestions.map((accommodation, accIndex) => (
                          <div key={accIndex} className="border border-gray-100 rounded-md p-3 hover:border-gray-300 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center">
                                {getAccommodationIcon(accommodation.type)}
                                <span className="ml-2 font-medium">{accommodation.name}</span>
                              </div>
                              {getPriceDisplay(accommodation.priceRange)}
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-2">{accommodation.description}</p>
                            
                            {accommodation.neighborhood && (
                              <div className="flex items-center text-xs text-gray-500 mb-2">
                                <MapPinIcon className="h-3.5 w-3.5 mr-1" />
                                <span>{accommodation.neighborhood}</span>
                              </div>
                            )}
                            
                            <div className="mt-2">
                              <div className="flex flex-wrap gap-1 mb-2">
                                {accommodation.amenities.slice(0, 4).map((amenity: string, i: number) => (
                                  <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                                    {amenity}
                                  </span>
                                ))}
                              </div>
                              
                              <div className="text-xs text-gray-500">
                                Best for: {accommodation.bestFor.join(', ')}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm italic">No specific accommodations found for this destination.</p>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg mt-6">
                <h4 className="font-medium text-blue-800 mb-2">Booking Tips</h4>
                <p className="text-sm text-blue-700">
                  Consider booking accommodations well in advance, especially during peak tourist seasons.
                  Many properties offer free cancellation closer to your arrival date.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 