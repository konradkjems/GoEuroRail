import React, { useState, useEffect, useCallback } from 'react';
import { FormTrip, FormTripStop, City } from "@/types";
import { cities } from "@/lib/cities";
import AIItineraryGenerator from './AIItineraryGenerator';
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
  ArrowTrendingUpIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  SparklesIcon,
  InformationCircleIcon
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
  // State for budget level
  const [budgetLevel, setBudgetLevel] = useState<'budget' | 'moderate' | 'luxury'>('moderate');
  
  // State for weather data
  const [weatherData, setWeatherData] = useState<Record<string, WeatherForecast>>({});
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  
  // State for budget data
  const [budgetData, setBudgetData] = useState<any>(null);
  const [isLoadingBudget, setIsLoadingBudget] = useState(false);
  
  // State for accommodations data
  const [accommodationsData, setAccommodationsData] = useState<Record<string, ApiAccommodation[]>>({});
  const [isLoadingAccommodations, setIsLoadingAccommodations] = useState(false);
  
  // State for attractions data
  const [attractionsData, setAttractionsData] = useState<Record<string, ApiAttraction[]>>({});
  const [isLoadingAttractions, setIsLoadingAttractions] = useState(false);
  
  // State for activities data
  const [activitiesData, setActivitiesData] = useState<Record<string, any>>({});
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);

  // State for managing which sections are open
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    weather: true,
    budget: false,
    accommodation: false,
    attractions: false,
    railPass: false,
    activities: false,
    aiItinerary: false // Add this new section
  });
  
  // Add new states for AI itinerary
  const [itineraryMarkdown, setItineraryMarkdown] = useState<string>('');
  const [isGeneratingItinerary, setIsGeneratingItinerary] = useState(false);
  const [itineraryError, setItineraryError] = useState<string | null>(null);
  const [itineraryGenerated, setItineraryGenerated] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Set up effect to fetch data when the trip changes or openSections changes
  useEffect(() => {
    if (!trip || !trip.stops || trip.stops.length === 0) return;
    
    // Fetch data for sections that are open and don't have data yet
    if (openSections.weather && Object.keys(weatherData).length === 0) {
      fetchWeatherData();
    }
    
    if (openSections.budget && !budgetData) {
      fetchBudgetData();
    }
    
    if (openSections.accommodation && Object.keys(accommodationsData).length === 0) {
      fetchAccommodationsData();
    }
    
    if (openSections.attractions && Object.keys(attractionsData).length === 0) {
      fetchAttractionsData();
    }
    
    if (openSections.activities && Object.keys(activitiesData).length === 0) {
      fetchActivitiesData();
    }
  }, [openSections, trip, weatherData, budgetData, accommodationsData, attractionsData, activitiesData]);

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

  // Update the toggleSection function to use openSections
  const toggleSection = (section: string) => {
    setOpenSections({
      ...openSections,
      [section]: !openSections[section]
    });
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

  // Add function to generate the AI itinerary
  const generateAIItinerary = async () => {
    try {
      setIsGeneratingItinerary(true);
      setItineraryError(null);
      
      // Prepare the data for the AI
      const budgetLevel = calculateBudget();
      
      // Collect attractions for each city in the trip
      const tripAttractions: Record<string, any[]> = {};
      trip.stops.forEach(stop => {
        const city = cities.find(c => c.id === stop.cityId);
        if (city) {
          const cityName = city.name;
          tripAttractions[cityName] = TOP_ATTRACTIONS[cityName] || DEFAULT_ATTRACTIONS;
        }
      });
      
      // Collect weather info for each city
      const tripWeather: Record<string, any> = {};
      trip.stops.forEach(stop => {
        const city = cities.find(c => c.id === stop.cityId);
        if (city) {
          const cityName = city.name;
          tripWeather[cityName] = getWeatherForStop(stop);
        }
      });
      
      // Call the API to generate the itinerary
      const response = await fetch('/api/ai/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trip,
          attractions: tripAttractions,
          weather: tripWeather,
          budgetLevel,
          additionalNotes: additionalNotes.trim() || undefined
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate itinerary');
      }
      
      const data = await response.json();
      setItineraryMarkdown(data.itinerary);
      setItineraryGenerated(true);
    } catch (error) {
      console.error('Error generating itinerary:', error);
      setItineraryError('Failed to generate the itinerary. Please try again later.');
    } finally {
      setIsGeneratingItinerary(false);
    }
  };
  
  // Add function to download the itinerary
  const downloadItinerary = () => {
    if (!itineraryMarkdown) return;
    
    // Create a blob with the markdown content
    const blob = new Blob([itineraryMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary download link
    const a = document.createElement('a');
    a.href = url;
    a.download = `${trip.name || 'Trip'}_Itinerary.md`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Add function to reset the itinerary
  const resetItinerary = () => {
    setItineraryMarkdown('');
    setItineraryGenerated(false);
    setAdditionalNotes('');
  };

  return (
    <div className="p-4 space-y-6">
      <div className="text-xl font-semibold text-[#264653] mb-2">Smart Trip Assistant</div>
      <p className="text-gray-600 text-sm mb-4">
        Get personalized recommendations and insights for your trip based on your itinerary.
      </p>
      
      {/* Weather Information */}
      <div className="border rounded-lg overflow-hidden">
        <div
          className="flex justify-between items-center p-4 bg-white cursor-pointer"
          onClick={() => toggleSection('weather')}
        >
          <div className="flex items-center space-x-2">
            <CloudIcon className="h-5 w-5 text-[#06D6A0]" />
            <h3 className="font-medium text-[#264653]">Weather & Packing</h3>
          </div>
          <ChevronDownIcon
            className={`h-5 w-5 text-gray-500 transition-transform ${openSections.weather ? 'rotate-180' : ''}`}
          />
        </div>
        
        {openSections.weather && (
          <div className="p-4 bg-gray-50 border-t">
            {isLoadingWeather ? (
              <div className="flex justify-center py-6">
                <svg className="animate-spin h-6 w-6 text-[#06D6A0]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              <>
                <h4 className="font-medium text-[#264653] mb-3">Weather forecast for your trip:</h4>
                
                <div className="space-y-4 mb-6">
                  {trip.stops.map((stop, idx) => {
                    const city = cities.find(c => c.id === stop.cityId);
                    const weather = getWeatherForStop(stop);
                    
                    if (!city || !weather) return null;
                    
                    // Get max temperature
                    const maxTemp = typeof weather.temp === 'object' && weather.temp.max !== undefined 
                      ? Math.round(weather.temp.max) 
                      : (typeof weather.temp === 'number' ? Math.round(weather.temp) : 'N/A');

                    // Get min temperature
                    const minTemp = typeof weather.temp === 'object' && weather.temp.min !== undefined 
                      ? Math.round(weather.temp.min) 
                      : 'N/A';

                    // Current/day temperature
                    const dayTemp = typeof weather.temp === 'object' && weather.temp.day !== undefined 
                      ? Math.round(weather.temp.day) 
                      : (typeof weather.temp === 'number' ? Math.round(weather.temp) : 'N/A');
                    
                    return (
                      <div key={idx} className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="p-3">
                          {/* Header with city and date */}
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-medium text-lg text-[#264653]">{city.name}</div>
                              <div className="text-sm text-gray-600">{stop.arrivalDate}</div>
                            </div>
                            <div className="flex items-center">
                              {getWeatherIcon(weather)}
                              <div className="text-sm ml-1 text-gray-700">{weather.condition || 'Unknown'}</div>
                            </div>
                          </div>
                          
                          {/* Temperature display */}
                          <div className="flex justify-between items-center">
                            <div className="text-4xl font-bold text-[#2A9D8F]">
                              {maxTemp}°C
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-gray-600 flex items-center">
                                <ChevronDownIcon className="h-3 w-3 text-blue-500 inline" />
                                <span>Min: {minTemp !== 'N/A' ? `${minTemp}°C` : 'N/A'}</span>
                              </div>
                              <div className="text-xs text-gray-600 flex items-center mt-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Feels like: {typeof weather.temp === 'object' && weather.temp.day !== undefined ? `${Math.round(weather.temp.day)}°C` : (dayTemp !== 'N/A' ? `${dayTemp}°C` : 'N/A')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Additional weather details */}
                        <div className="px-3 py-2 bg-gray-50 text-xs text-gray-600 grid grid-cols-2 gap-2">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                            </svg>
                            <span>Humidity: {weather.humidity !== undefined ? `${weather.humidity}%` : 'N/A'}</span>
                          </div>
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                            <span>Wind: {weather.wind_speed !== undefined ? `${Math.round(weather.wind_speed * 3.6)} km/h` : 'N/A'}</span>
                          </div>
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span>UV: {weather.uvi !== undefined ? getUVIndexDescription(weather.uvi) : 'N/A'}</span>
                          </div>
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M12 3v18" />
                            </svg>
                            <span>Rain: {weather.rainLevel || 'none'}</span>
                          </div>
                        </div>
                        
                        {/* Fallback data indicator */}
                        {weather.isFromFallback && (
                          <div className="text-center py-1 bg-amber-50 text-amber-700 text-xs border-t border-amber-100">
                            <InformationCircleIcon className="h-3 w-3 inline mr-1" />
                            Estimated weather data
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {weatherAdvice && (
                  <div className="mt-4">
                    <h4 className="font-medium text-[#264653] mb-2">Packing Recommendation:</h4>
                    <div className="p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
                      {weatherAdvice.packingAdvice}
                    </div>
                    
                    {weatherAdvice.extremeWeather.length > 0 && (
                      <div className="mt-3 p-3 bg-amber-50 text-amber-700 rounded-lg text-sm">
                        <div className="font-medium mb-1">Weather Alerts:</div>
                        <ul className="list-disc ml-4">
                          {weatherAdvice.extremeWeather.map((item, idx) => (
                            <li key={idx}>
                              {item.city} ({item.date}): {item.weather?.condition || 'Extreme weather'} 
                              {item.weather?.temp && ` (${typeof item.weather.temp === 'number' ? Math.round(item.weather.temp) : Math.round(item.weather.temp.day)}°C)`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Budget Estimation */}
      <div className="border rounded-lg overflow-hidden">
        <div
          className="flex justify-between items-center p-4 bg-white cursor-pointer"
          onClick={() => toggleSection('budget')}
        >
          <div className="flex items-center space-x-2">
            <BanknotesIcon className="h-5 w-5 text-[#06D6A0]" />
            <h3 className="font-medium text-[#264653]">Budget Calculator</h3>
          </div>
          <ChevronDownIcon
            className={`h-5 w-5 text-gray-500 transition-transform ${openSections.budget ? 'rotate-180' : ''}`}
          />
        </div>
        
        {openSections.budget && (
          <div className="p-4 bg-gray-50 border-t">
            {isLoadingBudget ? (
              <div className="flex justify-center py-6">
                <svg className="animate-spin h-6 w-6 text-[#06D6A0]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : budget ? (
              <>
            <div className="mb-4">
                  <h4 className="font-medium text-[#264653] mb-3">Budget Level:</h4>
                  <div className="flex space-x-2">
                <button 
                      className={`px-3 py-2 rounded-lg text-sm ${budgetLevel === 'budget' ? 'bg-[#06D6A0] text-white' : 'bg-gray-100 text-gray-700'}`}
                  onClick={() => setBudgetLevel('budget')}
                >
                  Budget
                </button>
                <button 
                      className={`px-3 py-2 rounded-lg text-sm ${budgetLevel === 'moderate' ? 'bg-[#06D6A0] text-white' : 'bg-gray-100 text-gray-700'}`}
                  onClick={() => setBudgetLevel('moderate')}
                >
                      Moderate
                </button>
                <button 
                      className={`px-3 py-2 rounded-lg text-sm ${budgetLevel === 'luxury' ? 'bg-[#06D6A0] text-white' : 'bg-gray-100 text-gray-700'}`}
                  onClick={() => setBudgetLevel('luxury')}
                >
                  Luxury
                </button>
              </div>
            </div>
            
                <h4 className="font-medium text-[#264653] mb-3">Estimated Trip Cost:</h4>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total</span>
                      <span className="text-xl font-bold text-[#264653]">{formatCurrency(budget.totalCost)}</span>
                  </div>
                </div>
                
                  <div className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Accommodation</span>
                        <span>{formatCurrency(budget.accommodation)}</span>
                  </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Food & Drinks</span>
                        <span>{formatCurrency(budget.food)}</span>
                  </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Activities & Attractions</span>
                        <span>{formatCurrency(budget.activities)}</span>
                  </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transportation</span>
                        <span>{formatCurrency(budget.transport)}</span>
                  </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
                  <p>This budget is based on {budget.details.nights} nights in {budget.details.cities} cities with {budget.details.travelDays} travel days.</p>
                    </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">Could not calculate budget for this trip.</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Accommodations */}
      <div className="border rounded-lg overflow-hidden">
        <div
          className="flex justify-between items-center p-4 bg-white cursor-pointer"
          onClick={() => toggleSection('accommodation')}
        >
          <div className="flex items-center space-x-2">
            <HomeIcon className="h-5 w-5 text-[#06D6A0]" />
            <h3 className="font-medium text-[#264653]">Accommodation Suggestions</h3>
          </div>
          <ChevronDownIcon
            className={`h-5 w-5 text-gray-500 transition-transform ${openSections.accommodation ? 'rotate-180' : ''}`}
          />
        </div>
        
        {openSections.accommodation && (
          <div className="p-4 bg-gray-50 border-t">
            {isLoadingAccommodations ? (
              <div className="flex justify-center py-6">
                <svg className="animate-spin h-6 w-6 text-[#06D6A0]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : accommodationSuggestions && accommodationSuggestions.length > 0 ? (
              <div className="space-y-6">
                {accommodationSuggestions.map((cityAccommodation, idx) => (
                  <div key={idx}>
                    <h4 className="font-medium text-[#264653] mb-3">
                      {cityAccommodation.city}, {cityAccommodation.country} ({cityAccommodation.nights} night{cityAccommodation.nights > 1 ? 's' : ''})
                    </h4>
                    
                    <div className="space-y-3">
                      {cityAccommodation.suggestions.slice(0, 3).map((suggestion, suggestionIdx) => (
                        <div key={suggestionIdx} className="bg-white rounded-lg shadow-sm p-4">
                          <div className="flex justify-between items-start">
                    <div>
                              <div className="flex items-center mb-1">
                                {getAccommodationIcon(suggestion.type)}
                                <span className="font-medium ml-1">{suggestion.name}</span>
                    </div>
                              <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                              <div className="flex flex-wrap">
                                {suggestion.amenities.slice(0, 3).map((amenity: string, amenityIdx: number) => (
                                  getTagDisplay(amenity)
                                ))}
                        </div>
                      </div>
                            <div>
                              {getPriceDisplay(suggestion.priceRange)}
                            </div>
                    </div>
                  </div>
                ))}
              </div>
                  </div>
                ))}
                    </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No accommodation suggestions available.</p>
                  </div>
            )}
                </div>
              )}
      </div>
      
      {/* Attractions */}
      <div className="border rounded-lg overflow-hidden">
        <div
          className="flex justify-between items-center p-4 bg-white cursor-pointer"
          onClick={() => toggleSection('attractions')}
        >
          <div className="flex items-center space-x-2">
            <MapPinIcon className="h-5 w-5 text-[#06D6A0]" />
            <h3 className="font-medium text-[#264653]">Top Attractions</h3>
              </div>
          <ChevronDownIcon
            className={`h-5 w-5 text-gray-500 transition-transform ${openSections.attractions ? 'rotate-180' : ''}`}
          />
            </div>
        
        {openSections.attractions && (
          <div className="p-4 bg-gray-50 border-t">
            {isLoadingAttractions ? (
              <div className="flex justify-center py-6">
                <svg className="animate-spin h-6 w-6 text-[#06D6A0]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
          </div>
            ) : attractionRecommendations && attractionRecommendations.length > 0 ? (
              <div className="space-y-6">
                {attractionRecommendations.map((cityAttractions, idx) => (
                  <div key={idx}>
                    <h4 className="font-medium text-[#264653] mb-3">
                      {cityAttractions.city}, {cityAttractions.country} ({cityAttractions.days} day{cityAttractions.days > 1 ? 's' : ''})
                    </h4>
                    
                    <div className="space-y-3 mb-4">
                      <h5 className="text-sm font-medium text-gray-600">Recommended for your time:</h5>
                      {cityAttractions.recommendedAttractions.map((attraction, attrIdx) => (
                        <div key={attrIdx} className="bg-white rounded-lg shadow-sm p-3">
                          <div className="flex items-start">
                            <div className="mt-1 mr-2">
                              {getCategoryIcon(attraction.category)}
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-center">
                                <span className="font-medium">{attraction.name}</span>
                                {attraction.mustSee && (
                                  <span className="ml-2 px-2 py-0.5 text-xs bg-amber-100 text-amber-800 rounded-full">Must See</span>
        )}
      </div>
                              <p className="text-sm text-gray-600 mt-1">{attraction.description}</p>
                              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <div className="flex items-center">
                                  <ClockIcon className="h-3.5 w-3.5 mr-1" />
                                  <span>{attraction.timeNeeded} hours</span>
          </div>
                                <div className="flex items-center">
                                  <StarIcon className="h-3.5 w-3.5 mr-1 text-amber-500" />
                                  <span>{attraction.rating} / 5</span>
                </div>
                </div>
                </div>
                </div>
              </div>
                ))}
              </div>
              
                    {cityAttractions.additionalAttractions.length > 0 && (
                      <>
                        <h5 className="text-sm font-medium text-gray-600 mb-2">Also worth considering:</h5>
                        <div className="space-y-2">
                          {cityAttractions.additionalAttractions.slice(0, 3).map((attraction, attrIdx) => (
                            <div key={attrIdx} className="p-2 bg-white rounded-lg shadow-sm">
                              <div className="flex items-center">
                                <div className="mr-2">
                                  {getCategoryIcon(attraction.category)}
                                </div>
                        <div>
                                  <div className="font-medium text-sm">{attraction.name}</div>
                                  <div className="text-xs text-gray-500 flex items-center">
                                    <ClockIcon className="h-3 w-3 mr-1" />
                                    <span>{attraction.timeNeeded} hours</span>
                                    <StarIcon className="h-3 w-3 ml-2 mr-1 text-amber-500" />
                                    <span>{attraction.rating}</span>
                        </div>
                          </div>
                            </div>
                        </div>
                          ))}
                      </div>
                      </>
                    )}
                    </div>
                  ))}
                </div>
              ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No attraction recommendations available.</p>
                </div>
              )}
          </div>
        )}
      </div>
      
      {/* Rail Pass */}
      <div className="border rounded-lg overflow-hidden">
        <div
          className="flex justify-between items-center p-4 bg-white cursor-pointer"
          onClick={() => toggleSection('railPass')}
        >
          <div className="flex items-center space-x-2">
            <TicketIcon className="h-5 w-5 text-[#06D6A0]" />
            <h3 className="font-medium text-[#264653]">Rail Pass Finder</h3>
          </div>
          <ChevronDownIcon
            className={`h-5 w-5 text-gray-500 transition-transform ${openSections.railPass ? 'rotate-180' : ''}`}
          />
        </div>
        
        {openSections.railPass && (
          <div className="p-4 bg-gray-50 border-t">
            {trainPassAdvice ? (
              <>
                <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                  <h4 className="font-medium text-[#264653] mb-2">Trip Summary</h4>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Countries visited:</span>
                      <span className="font-medium">{trainPassAdvice.countriesCount}</span>
                        </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Travel days:</span>
                      <span className="font-medium">{trainPassAdvice.travelDays}</span>
                      </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trip duration:</span>
                      <span className="font-medium">{trainPassAdvice.tripDuration} days</span>
                        </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Est. cost of point-to-point tickets:</span>
                      <span className="font-medium">{formatCurrency(trainPassAdvice.individualTicketCost)}</span>
                        </div>
                        </div>
                    </div>
                    
                <h4 className="font-medium text-[#264653] mb-3">Recommended Passes</h4>
                
                {trainPassAdvice.suitablePasses.length > 0 ? (
                  <div className="space-y-3">
                    {trainPassAdvice.suitablePasses.map((pass, idx) => (
                      <div 
                        key={idx} 
                        className={`bg-white rounded-lg shadow-sm p-4 border-l-4 ${pass.recommended ? 'border-l-[#06D6A0]' : 'border-l-gray-200'}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{pass.name}</div>
                            <div className="text-sm text-gray-600 mt-1">
                              Price: {formatCurrency(pass.price)}
                              {pass.savings > 0 && (
                                <span className="ml-2 text-green-600">
                                  Save {formatCurrency(pass.savings)}
                                  </span>
                                )}
                              </div>
                            </div>
                          {pass.recommended && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Recommended</span>
                          )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                  <div className="text-sm text-gray-600 p-3 bg-blue-50 rounded-lg">
                    <p>For this trip, individual tickets may be more economical than a rail pass.</p>
                  </div>
                )}
                
                <div className="mt-4 text-xs text-gray-500">
                  <p>Pricing is based on the standard adult fare. Youth (12-27) and senior (60+) discounts may apply.</p>
                        </div>
                      </>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">Could not calculate rail pass recommendations for this trip.</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Activities */}
      <div className="border rounded-lg overflow-hidden">
        <div
          className="flex justify-between items-center p-4 bg-white cursor-pointer"
          onClick={() => toggleSection('activities')}
        >
          <div className="flex items-center space-x-2">
            <TicketIcon className="h-5 w-5 text-[#06D6A0]" />
            <h3 className="font-medium text-[#264653]">Activities & Tours</h3>
          </div>
          <ChevronDownIcon
            className={`h-5 w-5 text-gray-500 transition-transform ${openSections.activities ? 'rotate-180' : ''}`}
          />
        </div>
        
        {openSections.activities && (
          <div className="p-4 bg-gray-50 border-t">
            {isLoadingActivities ? (
              <div className="flex justify-center py-6">
                <svg className="animate-spin h-6 w-6 text-[#06D6A0]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
                  <div className="space-y-6">
                {trip.stops.filter(stop => !stop.isStopover).map((stop, idx) => {
                        const city = cities.find(c => c.id === stop.cityId);
                        if (!city) return null;
                        
                  // Look up GetYourGuide location ID
                  const locationId = getYourGuideLocationIds[city.name];
                        const cityActivities = activitiesData[city.name] || [];
                        
                        return (
                    <div key={idx}>
                      <h4 className="font-medium text-[#264653] mb-3">
                        {city.name}, {city.country}
                      </h4>
                            
                            {cityActivities.length > 0 ? (
                        <div className="space-y-3">
                          {cityActivities.map((activity: any, activityIdx: number) => (
                            <div key={activityIdx} className="bg-white rounded-lg shadow-sm p-4">
                              <div className="font-medium mb-1">{activity.title}</div>
                              <div className="text-sm text-gray-600 mb-2">{activity.description?.substring(0, 100)}...</div>
                              <div className="flex justify-between items-center mt-2">
                                <div className="text-sm font-medium">{activity.price?.formattedValue || 'Price unavailable'}</div>
                                        <a 
                                          href={activity.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                  className="text-sm text-[#06D6A0] hover:underline"
                                        >
                                  View Details
                                        </a>
                                    </div>
                                  </div>
                                ))}
                              </div>
                      ) : locationId ? (
                        <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                          <p className="text-sm text-gray-600 mb-3">Explore top-rated tours and activities in {city.name}:</p>
                          <a 
                            href={`https://www.getyourguide.com/${getActivityCountry(city.country)}-l${locationId}/?partner_id=GOEURAIL`}
                                target="_blank"
                                rel="noopener noreferrer" 
                            className="inline-block px-4 py-2 bg-[#06D6A0] text-white rounded-md text-sm hover:bg-[#05C090]"
                              >
                            Browse Activities on GetYourGuide
                              </a>
                            </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-500">No activities found for {city.name}.</p>
                        </div>
                      )}
                          </div>
                        );
                      })}
                  </div>
            )}
          </div>
        )}
      </div>
      
      {/* AI Itinerary Generator */}
      <div className="border rounded-lg overflow-hidden">
        <div
          className="flex justify-between items-center p-4 bg-white cursor-pointer"
          onClick={() => toggleSection('aiItinerary')}
        >
          <div className="flex items-center space-x-2">
            <SparklesIcon className="h-5 w-5 text-[#06D6A0]" />
            <h3 className="font-medium text-[#264653]">AI Itinerary Generator</h3>
          </div>
          <ChevronDownIcon
            className={`h-5 w-5 text-gray-500 transition-transform ${openSections.aiItinerary ? 'rotate-180' : ''}`}
          />
              </div>
              
        {openSections.aiItinerary && (
          <AIItineraryGenerator
            trip={trip}
            attractions={TOP_ATTRACTIONS}
            getWeatherForStop={getWeatherForStop}
            budgetLevel={budgetLevel}
          />
        )}
      </div>
    </div>
  );
} 