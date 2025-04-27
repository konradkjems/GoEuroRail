import axios from 'axios';
import { getCachedData, setCachedData } from '../cache';
import { getBookingAccommodations } from './bookingComService';

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
  try {
    // Create a cache key based on the search parameters
    const cacheKey = `accommodations:${params.cityName}:${params.checkIn}-${params.checkOut}:${params.adults}:${params.rooms || 1}:${params.priceMin || 0}-${params.priceMax || 1000}`;
    
    // Check if we have cached data
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      console.log(`Using cached accommodation data for ${params.cityName}`);
      return cachedData;
    }
    
    // Try to fetch from Booking.com API first (preferred source)
    try {
      const bookingData = await getBookingAccommodations(params);
      if (bookingData && bookingData.length > 0) {
        console.log(`Using Booking.com data for ${params.cityName}`);
        // Cache the results
        setCachedData(cacheKey, bookingData, CACHE_TTL);
        return bookingData;
      }
    } catch (bookingError) {
      console.error(`Error fetching from Booking.com: ${bookingError}`);
      // Continue to try RapidAPI
    }
    
    // If Booking.com fails or returns no data, try RapidAPI
    try {
      const data = await fetchAccommodationsFromAPI(params);
      // Cache the results
      setCachedData(cacheKey, data, CACHE_TTL);
      return data;
    } catch (rapidApiError) {
      console.error(`Error fetching from RapidAPI: ${rapidApiError}`);
      // If both APIs fail, use fallback mock data
      return getFallbackAccommodations(params);
    }
  } catch (error) {
    console.error(`Error fetching accommodations for ${params.cityName}:`, error);
    // Fallback to mock data if all APIs fail
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
    // Get appropriate hotel image based on type and stars
    const imageUrl = getHotelImageUrl(hotel);
    
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
      images: [imageUrl],
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
 * Get appropriate hotel image based on type and stars
 */
function getHotelImageUrl(hotel: any): string {
  const type = getAccommodationType(hotel);
  let stars = 0;
  
  if (hotel.starRating) {
    stars = parseFloat(hotel.starRating);
  }
  
  // Select image based on accommodation type and stars
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
  // More realistic mock data with better variety
  const mockCities: Record<string, Accommodation[]> = {
    // Vienna accommodations
    'vienna': [
      {
        id: '1',
        name: 'XuBa ApartmentRooms Messe Wien Prater',
        type: 'apartment',
        stars: 4,
        address: 'Prater Street 123, Vienna, Austria',
        latitude: 48.2167,
        longitude: 16.3833,
        price: {
          amount: 216.00,
          currency: 'EUR'
        },
        images: ['/hotel-images/hotel-room-moderate.jpg'],
        rating: 8.8,
        reviewCount: 245,
        amenities: ['Wi-Fi', 'Kitchen', 'Air conditioning', 'Non-smoking rooms'],
        url: 'https://www.booking.com'
      },
      {
        id: '2',
        name: 'Jaz in the City Vienna',
        type: 'hotel',
        stars: 4,
        address: 'Windmühlgasse 28, Vienna, Austria',
        latitude: 48.2100,
        longitude: 16.3700,
        price: {
          amount: 369.00,
          currency: 'EUR'
        },
        images: ['/hotel-images/hotel-room-luxary.jpg'],
        rating: 9.0,
        reviewCount: 530,
        amenities: ['Wi-Fi', 'Fitness center', 'Bar', 'Restaurant', '24-hour front desk'],
        url: 'https://www.booking.com'
      },
      {
        id: '3',
        name: 'Florum Hotel',
        type: 'hotel',
        stars: 3,
        address: 'Neubaugasse, Vienna, Austria',
        latitude: 48.2120,
        longitude: 16.3650,
        price: {
          amount: 274.78,
          currency: 'EUR'
        },
        images: ['/hotel-images/hotel-room-moderate.jpg'],
        rating: 7.5,
        reviewCount: 326,
        amenities: ['Wi-Fi', 'Breakfast', 'Non-smoking rooms'],
        url: 'https://www.booking.com'
      },
      {
        id: '4',
        name: 'Holiday Inn - the niu, Franz Vienna by IHG',
        type: 'hotel',
        stars: 3,
        address: 'Mariahilferstrasse, Vienna, Austria',
        latitude: 48.2080,
        longitude: 16.3720,
        price: {
          amount: 174.95,
          currency: 'EUR'
        },
        images: ['/hotel-images/hotel-room-moderate.jpg'],
        rating: 8.2,
        reviewCount: 468,
        amenities: ['Wi-Fi', 'Parking', 'Restaurant', 'Bar', 'Air conditioning'],
        url: 'https://www.booking.com'
      },
      {
        id: '5',
        name: 'Superbude Wien Prater',
        type: 'hostel',
        stars: 3,
        address: 'Praterstrasse, Vienna, Austria',
        latitude: 48.2140,
        longitude: 16.3730,
        price: {
          amount: 269.95,
          currency: 'EUR'
        },
        images: ['/hotel-images/hostel-room.jpg'],
        rating: 8.9,
        reviewCount: 512,
        amenities: ['Wi-Fi', 'Shared kitchen', 'Bar', 'Game room'],
        url: 'https://www.booking.com'
      },
      {
        id: '6',
        name: 'The Hoxton Vienna',
        type: 'hotel',
        stars: 4,
        address: 'Stephansplatz, Vienna, Austria',
        latitude: 48.2050,
        longitude: 16.3770,
        price: {
          amount: 418.00,
          currency: 'EUR'
        },
        images: ['/hotel-images/hotel-room-luxary.jpg'],
        rating: 8.4,
        reviewCount: 218,
        amenities: ['Wi-Fi', 'Restaurant', 'Bar', 'Terrace', 'Fitness center'],
        url: 'https://www.booking.com'
      },
    ],
    // Paris accommodations
    'paris': [
      {
        id: '7',
        name: 'Hôtel Eiffel Blomet',
        type: 'hotel',
        stars: 4,
        address: 'Rue Blomet, Paris, France',
        latitude: 48.8426,
        longitude: 2.3026,
        price: {
          amount: 338.00,
          currency: 'EUR'
        },
        images: ['/hotel-images/hotel-room-luxary.jpg'],
        rating: 8.6,
        reviewCount: 324,
        amenities: ['Wi-Fi', 'Pool', 'Spa', 'Bar', 'Breakfast'],
        url: 'https://www.booking.com'
      },
      {
        id: '8',
        name: 'The People - Paris Belleville',
        type: 'hostel',
        stars: 3,
        address: 'Belleville, Paris, France',
        latitude: 48.8730,
        longitude: 2.3789,
        price: {
          amount: 184.00,
          currency: 'EUR'
        },
        images: ['/hotel-images/hostel-room.jpg'],
        rating: 8.4,
        reviewCount: 876,
        amenities: ['Wi-Fi', 'Bar', 'Terrace', 'Shared kitchen'],
        url: 'https://www.booking.com'
      },
      {
        id: '9',
        name: 'CitizenM Paris Gare de Lyon',
        type: 'hotel',
        stars: 4,
        address: 'Gare de Lyon, Paris, France',
        latitude: 48.8456,
        longitude: 2.3741,
        price: {
          amount: 279.00,
          currency: 'EUR'
        },
        images: ['/hotel-images/hotel-room-moderate.jpg'],
        rating: 8.9,
        reviewCount: 753,
        amenities: ['Wi-Fi', 'Bar', '24-hour front desk', 'Restaurant'],
        url: 'https://www.booking.com'
      },
    ],
    // Amsterdam accommodations
    'amsterdam': [
      {
        id: '10',
        name: 'The Social Hub Amsterdam City',
        type: 'hotel',
        stars: 4,
        address: 'Wibautstraat, Amsterdam, Netherlands',
        latitude: 52.3675,
        longitude: 4.9041,
        price: {
          amount: 244.00,
          currency: 'EUR'
        },
        images: ['/hotel-images/hotel-room-moderate.jpg'],
        rating: 8.4,
        reviewCount: 647,
        amenities: ['Wi-Fi', 'Fitness center', 'Restaurant', 'Bar'],
        url: 'https://www.booking.com'
      },
      {
        id: '11',
        name: 'ClinkNOORD Hostel',
        type: 'hostel',
        stars: 2,
        address: 'Noord, Amsterdam, Netherlands',
        latitude: 52.3838,
        longitude: 4.9016,
        price: {
          amount: 129.00,
          currency: 'EUR'
        },
        images: ['/hotel-images/hostel-room.jpg'],
        rating: 8.6,
        reviewCount: 1254,
        amenities: ['Wi-Fi', 'Bar', 'Shared kitchen', 'Library'],
        url: 'https://www.booking.com'
      },
    ],
    // Default accommodations for other cities
    'default': [
      {
        id: 'default1',
        name: 'City Center Hotel',
        type: 'hotel',
        stars: 3,
        address: 'Main Street, City Center',
        latitude: 48.2082,
        longitude: 16.3738,
        price: {
          amount: 185.00,
          currency: 'EUR'
        },
        images: ['/hotel-images/hotel-room-moderate.jpg'],
        rating: 8.2,
        reviewCount: 362,
        amenities: ['Wi-Fi', 'Breakfast', '24-hour front desk'],
        url: 'https://www.booking.com'
      },
      {
        id: 'default2',
        name: 'Traveler\'s Hostel',
        type: 'hostel',
        stars: 2,
        address: 'Backpacker Street, Near Train Station',
        latitude: 48.2062,
        longitude: 16.3758,
        price: {
          amount: 75.00,
          currency: 'EUR'
        },
        images: ['/hotel-images/hostel-room.jpg'],
        rating: 7.8,
        reviewCount: 845,
        amenities: ['Wi-Fi', 'Shared kitchen', 'Shared lounge'],
        url: 'https://www.booking.com'
      },
      {
        id: 'default3',
        name: 'Luxury Plaza Hotel',
        type: 'hotel',
        stars: 5,
        address: 'Luxury Avenue, City Center',
        latitude: 48.2092,
        longitude: 16.3728,
        price: {
          amount: 350.00,
          currency: 'EUR'
        },
        images: ['/hotel-images/hotel-room-luxary.jpg'],
        rating: 9.2,
        reviewCount: 478,
        amenities: ['Wi-Fi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Fitness center'],
        url: 'https://www.booking.com'
      }
    ]
  };
  
  // Normalize city name for matching
  const normalizedCityName = params.cityName.toLowerCase().trim();
  
  // Try to match the city name
  let accommodations: Accommodation[] = [];
  
  // Check if we have data for this specific city
  if (normalizedCityName in mockCities) {
    accommodations = mockCities[normalizedCityName];
  } else {
    // Try to find partial matches
    const cityKeys = Object.keys(mockCities);
    const matchedCity = cityKeys.find(city => 
      city !== 'default' && normalizedCityName.includes(city) || city.includes(normalizedCityName)
    );
    
    if (matchedCity) {
      accommodations = mockCities[matchedCity];
    } else {
      // Fall back to default accommodations
      accommodations = mockCities.default;
    }
  }
  
  // Apply filters
  let filtered = accommodations;
  
  // Price filter
  if (params.priceMin !== undefined || params.priceMax !== undefined) {
    filtered = filtered.filter(acc => {
      if (params.priceMin !== undefined && acc.price.amount < params.priceMin) return false;
      if (params.priceMax !== undefined && acc.price.amount > params.priceMax) return false;
      return true;
    });
  }
  
  // Accommodation type filter
  if (params.accommodationType !== undefined && params.accommodationType.length > 0) {
    filtered = filtered.filter(acc => params.accommodationType!.includes(acc.type));
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
      images: [getAccommodationImageByType(getAccommodationTypeFromDetails(property), property.starRating)],
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

/**
 * Select appropriate image based on accommodation type and stars
 */
function getAccommodationImageByType(type: 'hotel' | 'hostel' | 'apartment' | 'guesthouse', starRating?: string): string {
  const stars = starRating ? parseFloat(starRating) : 0;
  
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