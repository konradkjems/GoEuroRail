import axios from 'axios';
import { getCachedData, setCachedData } from '../cache';
import { Accommodation, AccommodationSearchParams } from './accommodationService';

// API configuration
const MAKCORPS_API_KEY = process.env.NEXT_PUBLIC_MAKCORPS_API_KEY || 'free_demo';
const BASE_URL = 'https://api.makcorps.com';

// Cache settings (24 hours by default)
const CACHE_TTL = Number(process.env.CACHE_TTL_HOTELS) || 86400;

// Define interfaces for API responses
interface MakCorpsApiResponse {
  hotels?: any[];
  [key: string]: any;
}

interface CityMappingResponse {
  id: string;
  name: string;
  country: string;
  [key: string]: any;
}

/**
 * Get accommodations for a specific location and date range using MakCorps API
 */
export async function getMakCorpsAccommodations(params: AccommodationSearchParams): Promise<Accommodation[]> {
  try {
    // Create a cache key based on the search parameters
    const cacheKey = `makcorps:accommodations:${params.cityName}:${params.checkIn}-${params.checkOut}:${params.adults}:${params.rooms || 1}:${params.priceMin || 0}-${params.priceMax || 1000}`;
    
    // Check if we have cached data
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      console.log(`Using cached MakCorps accommodation data for ${params.cityName}`);
      return cachedData;
    }
    
    // If no cached data, fetch from API
    const data = await fetchMakCorpsAccommodations(params);
    
    // Cache the results
    setCachedData(cacheKey, data, CACHE_TTL);
    
    return data;
  } catch (error) {
    console.error(`Error fetching MakCorps accommodations for ${params.cityName}:`, error);
    // Return empty array if API fails - fallback to accommodationService mock data
    return [];
  }
}

/**
 * Fetch accommodations from MakCorps API
 */
async function fetchMakCorpsAccommodations(params: AccommodationSearchParams): Promise<Accommodation[]> {
  try {
    // We need to get the destination ID/city ID first
    const cityId = await getCityId(params.cityName);
    
    if (!cityId) {
      console.error(`Could not find city ID for ${params.cityName}`);
      return [];
    }
    
    // Format dates as required by MakCorps API: YYYY-MM-DD
    const checkIn = params.checkIn;
    const checkOut = params.checkOut;
    
    // Make the API call for hotels in this city
    const url = `${BASE_URL}/free/city/${cityId}/${checkIn}/${checkOut}?key=${MAKCORPS_API_KEY}`;
    const response = await axios.get<MakCorpsApiResponse>(url);
    
    // Ensure we have a valid response with hotels
    if (!response.data) {
      console.log(`No data found for ${params.cityName}`);
      return [];
    }
    
    // Type guard to check if response.data.hotels exists and is an array
    const hotels = response.data.hotels || [];
    if (hotels.length === 0) {
      console.log(`No hotels found in ${params.cityName} for the specified dates`);
      return [];
    }
    
    // Transform API response to our Accommodation format
    return transformMakCorpsData(hotels, params.cityName);
  } catch (error) {
    console.error('Error fetching hotels from MakCorps:', error);
    return [];
  }
}

/**
 * Get city ID for a city name from MakCorps API
 */
async function getCityId(cityName: string): Promise<string | null> {
  const cacheKey = `makcorps:cityId:${cityName}`;
  
  // Check cache first
  const cachedId = getCachedData(cacheKey);
  if (cachedId) {
    return cachedId;
  }
  
  try {
    // For Vienna, manually use the city ID since this is for a demo
    if (cityName.toLowerCase().includes('vienna') || cityName.toLowerCase().includes('wien')) {
      const viennaCityId = '1903417'; // Vienna city ID
      setCachedData(cacheKey, viennaCityId, 30 * 24 * 60 * 60); // Cache for 30 days
      return viennaCityId;
    }
    
    // For other cities, we would need to use the mapping API
    // https://api.makcorps.com/mapping/city?name={cityName}&key={apiKey}
    const url = `${BASE_URL}/mapping/city?name=${encodeURIComponent(cityName)}&key=${MAKCORPS_API_KEY}`;
    const response = await axios.get<CityMappingResponse[]>(url);
    
    // Type guard to check if response.data exists and has data
    if (!response.data) {
      return null;
    }
    
    // Check if data is an array with at least one item
    if (Array.isArray(response.data) && response.data.length > 0) {
      const cityId = response.data[0].id;
      // Cache city ID for a month
      setCachedData(cacheKey, cityId, 30 * 24 * 60 * 60);
      return cityId;
    }
    
    return null;
  } catch (error) {
    console.error(`Error getting city ID for ${cityName}:`, error);
    return null;
  }
}

/**
 * Transform MakCorps API response to our data structure
 */
function transformMakCorpsData(hotels: any[], cityName: string): Accommodation[] {
  return hotels.map(hotel => {
    // Extract prices from all available OTAs
    const priceDetails = extractBestPrice(hotel.prices);
    
    // Get appropriate hotel image based on type and stars
    const type = mapHotelType(hotel);
    const imageUrl = getHotelImageByType(type, hotel.stars || 3);
    
    return {
      id: hotel.hotel_id || `mak-${hotel.id}`,
      name: hotel.name,
      type: type,
      stars: hotel.stars || 3,
      address: hotel.address || `${cityName}, Austria`,
      latitude: parseFloat(hotel.latitude) || 48.2082,
      longitude: parseFloat(hotel.longitude) || 16.3738,
      price: {
        amount: priceDetails.price,
        currency: priceDetails.currency || 'EUR'
      },
      images: [imageUrl],
      rating: hotel.rating ? parseFloat(hotel.rating) : undefined,
      reviewCount: hotel.reviews || 0,
      amenities: hotel.amenities || ['Wi-Fi', 'Breakfast'],
      url: priceDetails.url || '#'
    };
  });
}

/**
 * Extract the best price from all available OTAs
 */
function extractBestPrice(prices: any): { price: number; currency: string; url: string } {
  if (!prices || !Array.isArray(prices) || prices.length === 0) {
    return { price: 200, currency: 'EUR', url: '#' };
  }
  
  // Filter out any invalid prices and sort by price
  const validPrices = prices
    .filter(p => p && p.price && typeof p.price === 'number' && p.price > 0)
    .sort((a, b) => a.price - b.price);
  
  if (validPrices.length === 0) {
    return { price: 200, currency: 'EUR', url: '#' };
  }
  
  const bestDeal = validPrices[0];
  return {
    price: bestDeal.price,
    currency: bestDeal.currency || 'EUR',
    url: bestDeal.url || '#'
  };
}

/**
 * Map hotel type based on available data
 */
function mapHotelType(hotel: any): 'hotel' | 'hostel' | 'apartment' | 'guesthouse' {
  if (!hotel.type) {
    return 'hotel';  // Default
  }
  
  const type = hotel.type.toLowerCase();
  
  if (type.includes('hostel')) {
    return 'hostel';
  } else if (type.includes('apartment') || type.includes('flat')) {
    return 'apartment';
  } else if (type.includes('guesthouse') || type.includes('bed and breakfast') || type.includes('b&b')) {
    return 'guesthouse';
  } else {
    return 'hotel';
  }
}

/**
 * Select appropriate image based on accommodation type and stars
 */
function getHotelImageByType(type: 'hotel' | 'hostel' | 'apartment' | 'guesthouse', stars: number): string {
  if (type === 'hostel') {
    return '/hotel-images/hostel-room.jpg';
  } else if (type === 'hotel' || type === 'guesthouse') {
    if (stars >= 4.5) {
      return '/hotel-images/hotel-room-luxary.jpg';
    } else {
      return '/hotel-images/hotel-room-moderate.jpg';
    }
  } else {
    // apartments or default
    return '/hotel-images/hotel-room-moderate.jpg';
  }
} 