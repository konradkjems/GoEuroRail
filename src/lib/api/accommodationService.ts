import axios from 'axios';
import { getCachedData, setCachedData } from '../cache';

// API configuration
const RAPIDAPI_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || 'your_default_rapidapi_key';
const RAPIDAPI_HOST = process.env.NEXT_PUBLIC_RAPIDAPI_HOST || 'hotels4.p.rapidapi.com';
const BASE_URL = `https://${RAPIDAPI_HOST}`;

// Cache settings (24 hours by default)
const CACHE_TTL = Number(process.env.CACHE_TTL_HOTELS) || 86400;

/**
 * Accommodation data structure
 */
export interface Accommodation {
  id: string;
  name: string;
  type: 'hotel' | 'hostel' | 'apartment' | 'guesthouse';
  stars?: number;
  address: string;
  latitude: number;
  longitude: number;
  price: {
    amount: number;
    currency: string;
  };
  images: string[];
  rating?: number;
  reviewCount?: number;
  amenities: string[];
  url?: string;
}

/**
 * Search parameters for accommodation
 */
export interface AccommodationSearchParams {
  cityName: string;
  checkIn: string;  // YYYY-MM-DD format
  checkOut: string; // YYYY-MM-DD format
  adults: number;
  rooms?: number;
  priceMin?: number;
  priceMax?: number;
  starRating?: number[];
  accommodationType?: string[];
  limit?: number;
}

/**
 * HotelsResponse interface for API response type
 */
interface HotelsResponse {
  data: {
    body: {
      searchResults: {
        results: Array<any>; // Hotel object is complex, using any for brevity
      }
    }
  }
}

/**
 * PropertyDetailsResponse interface for API response type
 */
interface PropertyDetailsResponse {
  data: {
    body: {
      propertyDescription: {
        name: string;
        starRating?: string;
        address: {
          fullAddress: string;
        };
        propertyLocation: {
          latitude: number;
          longitude: number;
        };
        featuredPrice?: {
          currentPrice: {
            plain: string;
            currencyCode: string;
          };
        };
        images: {
          hotelImages: Array<{
            baseUrl: string;
          }>;
        };
        guestReviews?: {
          brands?: {
            rating?: string;
            total?: number;
          };
        };
        amenities: {
          topAmenities: {
            items: Array<{
              text: string;
            }>;
          };
        };
        accommodationType?: string;
      }
    }
  }
}

/**
 * Get accommodations for a specific location and date range
 */
export async function getAccommodations(params: AccommodationSearchParams): Promise<Accommodation[]> {
  // Create a cache key based on search parameters
  const cacheKey = `accommodations:${params.cityName}:${params.checkIn}-${params.checkOut}:${params.adults}:${params.rooms || 1}:${params.priceMin || 0}-${params.priceMax || 1000}`;
  
  // Check if we have cached data
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    console.log(`Using cached accommodation data for ${params.cityName}`);
    return cachedData;
  }
  
  try {
    const data = await fetchAccommodationsFromAPI(params);
    
    // Cache the data
    setCachedData(cacheKey, data, CACHE_TTL);
    
    return data;
  } catch (error) {
    console.error(`Error fetching accommodations for ${params.cityName}:`, error);
    // Fall back to mock data if API fails
    return getFallbackAccommodations(params);
  }
}

/**
 * Fetch accommodations from RapidAPI Hotels
 */
async function fetchAccommodationsFromAPI(params: AccommodationSearchParams): Promise<Accommodation[]> {
  // First, we need to get the destination ID
  const destinationId = await getDestinationId(params.cityName);
  
  if (!destinationId) {
    throw new Error(`Could not find destination ID for ${params.cityName}`);
  }
  
  // Now we can search for hotels
  const options = {
    method: 'GET',
    url: `${BASE_URL}/properties/list`,
    params: {
      destinationId: destinationId,
      pageNumber: '1',
      pageSize: params.limit?.toString() || '25',
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      adults1: params.adults.toString(),
      sortOrder: 'PRICE',
      locale: 'en_US',
      currency: 'EUR'
    },
    headers: {
      'X-RapidAPI-Key': RAPIDAPI_KEY,
      'X-RapidAPI-Host': RAPIDAPI_HOST
    }
  };
  
  const response = await axios.request(options);
  
  // Transform API response to our data structure
  return transformHotelData(response.data as HotelsResponse);
}

/**
 * Get destination ID for a city name
 */
async function getDestinationId(cityName: string): Promise<string | null> {
  const cacheKey = `destination:${cityName}`;
  
  // Check cache first
  const cachedId = getCachedData(cacheKey);
  if (cachedId) {
    return cachedId;
  }
  
  const options = {
    method: 'GET',
    url: `${BASE_URL}/locations/v2/search`,
    params: { query: cityName, locale: 'en_US', currency: 'EUR' },
    headers: {
      'X-RapidAPI-Key': RAPIDAPI_KEY,
      'X-RapidAPI-Host': RAPIDAPI_HOST
    }
  };
  
  try {
    const response = await axios.request(options);
    
    // Define the response type
    interface LocationsResponse {
      suggestions: Array<{
        group: string;
        entities: Array<{
          destinationId: string;
          type: string;
          name: string;
        }>;
      }>;
    }
    
    const data = response.data as LocationsResponse;
    const suggestions = data.suggestions;
    
    // Find the 'CITY' type suggestion
    for (const group of suggestions) {
      if (group.group === 'CITY_GROUP') {
        for (const entity of group.entities) {
          if (entity.type === 'CITY') {
            // Cache this ID for longer (7 days) as it rarely changes
            setCachedData(cacheKey, entity.destinationId, 7 * 24 * 60 * 60);
            return entity.destinationId;
          }
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting destination ID:', error);
    return null;
  }
}

/**
 * Transform API response to our data structure
 */
function transformHotelData(apiResponse: HotelsResponse): Accommodation[] {
  const results = apiResponse.data.body.searchResults.results;
  
  return results.map((hotel: any) => {
    // Get the best image URL or placeholder
    const images = hotel.optimizedThumbUrls ? 
      [hotel.optimizedThumbUrls.srpDesktop] : 
      ['/images/hotel-placeholder.jpg'];
    
    // Extract amenities when available  
    const amenities = hotel.amenities ? 
      hotel.amenities.map((amenity: any) => amenity.name) : 
      [];
    
    // Extract star rating
    let stars;
    if (hotel.starRating) {
      // API might return string like '4.0' or number
      stars = parseFloat(hotel.starRating);
    }
    
    return {
      id: hotel.id,
      name: hotel.name,
      type: getAccommodationType(hotel),
      stars: stars,
      address: `${hotel.address.streetAddress || ''}, ${hotel.address.locality || ''}, ${hotel.address.postalCode || ''}`,
      latitude: hotel.coordinate ? hotel.coordinate.lat : 0,
      longitude: hotel.coordinate ? hotel.coordinate.lon : 0,
      price: {
        amount: hotel.ratePlan?.price?.current ? 
          parseFloat(hotel.ratePlan.price.current.replace(/[^0-9.]/g, '')) : 
          0,
        currency: hotel.ratePlan?.price?.current ? 
          hotel.ratePlan.price.current.replace(/[0-9.]/g, '').trim() : 
          'EUR'
      },
      images: images,
      rating: hotel.guestReviews?.rating ? parseFloat(hotel.guestReviews.rating) : undefined,
      reviewCount: hotel.guestReviews?.total || 0,
      amenities: amenities,
      url: hotel.optimizedThumbUrls?.srpDesktop ? 
        `https://hotels.com/ho${hotel.id}` : 
        undefined
    };
  });
}

/**
 * Determine accommodation type from hotel data
 */
function getAccommodationType(hotel: any): 'hotel' | 'hostel' | 'apartment' | 'guesthouse' {
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
 * Fallback accommodation data when API fails
 */
function getFallbackAccommodations(params: AccommodationSearchParams): Accommodation[] {
  // Determine price tier based on city
  const highPriceCities = ['Paris', 'London', 'Amsterdam', 'Zurich', 'Venice', 'Milan', 'Copenhagen'];
  const midPriceCities = ['Berlin', 'Madrid', 'Barcelona', 'Rome', 'Vienna', 'Munich', 'Brussels'];
  
  let priceMultiplier = 1;
  if (highPriceCities.includes(params.cityName)) {
    priceMultiplier = 1.5;
  } else if (midPriceCities.includes(params.cityName)) {
    priceMultiplier = 1.2;
  }
  
  // Create fallback data
  const accommodations: Accommodation[] = [
    {
      id: 'hotel-1',
      name: `${params.cityName} Grand Hotel`,
      type: 'hotel',
      stars: 4,
      address: `123 Main Street, ${params.cityName}`,
      latitude: 0,
      longitude: 0,
      price: {
        amount: Math.round(120 * priceMultiplier),
        currency: 'EUR'
      },
      images: ['/images/hotel-placeholder.jpg'],
      rating: 8.4,
      reviewCount: 253,
      amenities: ['Free WiFi', 'Restaurant', 'Bar', 'Fitness Center', 'Non-smoking Rooms']
    },
    {
      id: 'hotel-2',
      name: `Central ${params.cityName} Hotel`,
      type: 'hotel',
      stars: 3,
      address: `45 Central Avenue, ${params.cityName}`,
      latitude: 0,
      longitude: 0,
      price: {
        amount: Math.round(85 * priceMultiplier),
        currency: 'EUR'
      },
      images: ['/images/hotel-placeholder.jpg'],
      rating: 7.9,
      reviewCount: 187,
      amenities: ['Free WiFi', 'Restaurant', 'Non-smoking Rooms']
    },
    {
      id: 'hostel-1',
      name: `${params.cityName} Central Hostel`,
      type: 'hostel',
      address: `78 Backpacker Street, ${params.cityName}`,
      latitude: 0,
      longitude: 0,
      price: {
        amount: Math.round(30 * priceMultiplier),
        currency: 'EUR'
      },
      images: ['/images/hostel-placeholder.jpg'],
      rating: 8.1,
      reviewCount: 420,
      amenities: ['Free WiFi', 'Shared Kitchen', 'Laundry', 'Lockers']
    },
    {
      id: 'apartment-1',
      name: `${params.cityName} City Apartments`,
      type: 'apartment',
      address: `92 Residential Lane, ${params.cityName}`,
      latitude: 0,
      longitude: 0,
      price: {
        amount: Math.round(100 * priceMultiplier),
        currency: 'EUR'
      },
      images: ['/images/apartment-placeholder.jpg'],
      rating: 9.0,
      reviewCount: 86,
      amenities: ['Free WiFi', 'Kitchen', 'Washing Machine', 'Air Conditioning']
    },
    {
      id: 'guesthouse-1',
      name: `${params.cityName} Cozy Guesthouse`,
      type: 'guesthouse',
      address: `15 Quiet Street, ${params.cityName}`,
      latitude: 0,
      longitude: 0,
      price: {
        amount: Math.round(65 * priceMultiplier),
        currency: 'EUR'
      },
      images: ['/images/guesthouse-placeholder.jpg'],
      rating: 8.7,
      reviewCount: 124,
      amenities: ['Free WiFi', 'Breakfast', 'Garden', 'Terrace']
    }
  ];
  
  // Apply filters if provided
  let filtered = accommodations;
  
  if (params.priceMin !== undefined) {
    filtered = filtered.filter(acc => acc.price.amount >= params.priceMin!);
  }
  
  if (params.priceMax !== undefined) {
    filtered = filtered.filter(acc => acc.price.amount <= params.priceMax!);
  }
  
  if (params.starRating !== undefined && params.starRating.length > 0) {
    filtered = filtered.filter(acc => acc.stars !== undefined && params.starRating!.includes(Math.floor(acc.stars)));
  }
  
  if (params.accommodationType !== undefined && params.accommodationType.length > 0) {
    filtered = filtered.filter(acc => params.accommodationType!.includes(acc.type));
  }
  
  // Apply limit
  if (params.limit !== undefined && params.limit > 0) {
    filtered = filtered.slice(0, params.limit);
  }
  
  return filtered;
}

/**
 * Get details for a specific accommodation by ID
 */
export async function getAccommodationDetails(id: string): Promise<Accommodation | null> {
  const cacheKey = `accommodation:${id}`;
  
  // Check cache first
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  try {
    const options = {
      method: 'GET',
      url: `${BASE_URL}/properties/get-details`,
      params: {
        id: id,
        locale: 'en_US',
        currency: 'EUR'
      },
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    };
    
    const response = await axios.request(options);
    const data = response.data as PropertyDetailsResponse;
    
    // Transform API response to our data structure
    const property = data.data.body.propertyDescription;
    
    const accommodation: Accommodation = {
      id: id,
      name: property.name,
      type: getAccommodationTypeFromDetails(property),
      stars: property.starRating ? parseFloat(property.starRating) : undefined,
      address: `${property.address.fullAddress}`,
      latitude: property.propertyLocation.latitude,
      longitude: property.propertyLocation.longitude,
      price: {
        amount: property.featuredPrice ? parseFloat(property.featuredPrice.currentPrice.plain.replace(/[^0-9.]/g, '')) : 0,
        currency: property.featuredPrice ? property.featuredPrice.currentPrice.currencyCode : 'EUR'
      },
      images: property.images.hotelImages.slice(0, 5).map((img) => img.baseUrl.replace('{size}', 'z')),
      rating: property.guestReviews?.brands?.rating ? parseFloat(property.guestReviews.brands.rating) : undefined,
      reviewCount: property.guestReviews?.brands?.total || 0,
      amenities: property.amenities.topAmenities.items.map((item) => item.text),
      url: `https://hotels.com/ho${id}`
    };
    
    // Cache the data for 24 hours
    setCachedData(cacheKey, accommodation, CACHE_TTL);
    
    return accommodation;
  } catch (error) {
    console.error(`Error fetching accommodation details for ${id}:`, error);
    return null;
  }
}

/**
 * Determine accommodation type from property details
 */
function getAccommodationTypeFromDetails(property: any): 'hotel' | 'hostel' | 'apartment' | 'guesthouse' {
  if (property.accommodationType) {
    const type = property.accommodationType.toLowerCase();
    
    if (type.includes('hostel')) {
      return 'hostel';
    } else if (type.includes('apartment') || type.includes('flat')) {
      return 'apartment';
    } else if (type.includes('guesthouse') || type.includes('bed and breakfast') || type.includes('b&b')) {
      return 'guesthouse';
    }
  }
  
  return 'hotel';  // Default
} 