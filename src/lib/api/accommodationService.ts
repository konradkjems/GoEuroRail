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
  console.log(`Generating fallback accommodations for "${params.cityName}"`);
  
  // Lowercase the city name to standardize comparisons
  const cityNameLower = params.cityName.toLowerCase().trim();
  console.log(`Standardized city name: "${cityNameLower}"`);
  
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
  
  // Check if we have predefined mock data for this city
  console.log(`Checking for predefined mock data among ${Object.keys(mockCities).length} mock cities`);
  for (const [key, accommodations] of Object.entries(mockCities)) {
    console.log(`  Comparing "${cityNameLower}" with mock city "${key}"`);
    if (cityNameLower.includes(key) || key.includes(cityNameLower)) {
      console.log(`✓ Match found! Using predefined data for "${key}"`);
      return accommodations;
    }
  }
  
  // If we don't have predefined mock data for this city, generate some
  console.log(`No predefined mock data for "${params.cityName}", generating dynamic mock data`);
  
  // Get approximate coordinates for the city
  const cityCoordinates = getCityCoordinates(params.cityName);
  console.log(`Using coordinates for "${params.cityName}":`, cityCoordinates);
  
  // Generate 5-8 random accommodations around those coordinates
  const numAccommodations = 5 + Math.floor(Math.random() * 4); // 5 to 8 accommodations
  const generatedAccommodations: Accommodation[] = [];
  
  const accommodationTypes: Array<'hotel' | 'hostel' | 'apartment' | 'guesthouse'> = ['hotel', 'hostel', 'apartment', 'guesthouse'];
  const hotelPrefixes = ['Grand', 'Royal', 'Imperial', 'Central', 'City', 'Park', 'Plaza', 'Comfort', 'Premier'];
  const hotelSuffixes = ['Hotel', 'Inn', 'Suites', 'Lodge', 'House', 'Residence', 'Palace'];
  const hostelPrefixes = ['Backpackers', 'Budget', 'Travelers', 'Friendly', 'Happy', 'Urban'];
  const hostelSuffixes = ['Hostel', 'House', 'City', 'Hub', 'Lounge', 'Haven'];
  const apartmentPrefixes = ['Modern', 'Luxury', 'City', 'Central', 'Cozy', 'Spacious'];
  const apartmentSuffixes = ['Apartments', 'Suites', 'Lofts', 'Studios', 'Stays', 'Views'];
  const guesthousePrefixes = ['Tranquil', 'Quiet', 'Family', 'Charming', 'Historic', 'Traditional'];
  const guesthouseSuffixes = ['Guesthouse', 'B&B', 'House', 'Cottage', 'Rooms', 'Retreat'];
  
  const amenitiesList = [
    'Wi-Fi', 'Breakfast', 'Air conditioning', 'Non-smoking rooms', 'Restaurant', 
    'Bar', '24-hour front desk', 'Fitness center', 'Spa', 'Terrace', 'Pool',
    'Parking', 'Free parking', 'Garden', 'Shared kitchen', 'Laundry', 'TV',
    'Elevator', 'Soundproof rooms', 'Family rooms', 'Airport shuttle'
  ];
  
  for (let i = 0; i < numAccommodations; i++) {
    const type = accommodationTypes[Math.floor(Math.random() * accommodationTypes.length)];
    
    // Create name based on type
    let namePrefix, nameSuffix;
    switch (type) {
      case 'hotel':
        namePrefix = hotelPrefixes[Math.floor(Math.random() * hotelPrefixes.length)];
        nameSuffix = hotelSuffixes[Math.floor(Math.random() * hotelSuffixes.length)];
        break;
      case 'hostel':
        namePrefix = hostelPrefixes[Math.floor(Math.random() * hostelPrefixes.length)];
        nameSuffix = hostelSuffixes[Math.floor(Math.random() * hostelSuffixes.length)];
        break;
      case 'apartment':
        namePrefix = apartmentPrefixes[Math.floor(Math.random() * apartmentPrefixes.length)];
        nameSuffix = apartmentSuffixes[Math.floor(Math.random() * apartmentSuffixes.length)];
        break;
      case 'guesthouse':
        namePrefix = guesthousePrefixes[Math.floor(Math.random() * guesthousePrefixes.length)];
        nameSuffix = guesthouseSuffixes[Math.floor(Math.random() * guesthouseSuffixes.length)];
        break;
    }
    
    // Random location variation (within ~1-2km)
    const latVariation = (Math.random() - 0.5) * 0.02;
    const lngVariation = (Math.random() - 0.5) * 0.02;
    
    // Random price based on accommodation type
    let basePrice;
    switch (type) {
      case 'hotel':
        basePrice = 150 + Math.floor(Math.random() * 250);
        break;
      case 'hostel':
        basePrice = 50 + Math.floor(Math.random() * 100);
        break;
      case 'apartment':
        basePrice = 100 + Math.floor(Math.random() * 200);
        break;
      case 'guesthouse':
        basePrice = 80 + Math.floor(Math.random() * 150);
        break;
    }
    
    // Random star rating (2-5 for hotels, 1-3 for hostels, 2-4 for apartments, 1-3 for guesthouses)
    let stars;
    switch (type) {
      case 'hotel':
        stars = 2 + Math.floor(Math.random() * 4);
        break;
      case 'hostel':
        stars = 1 + Math.floor(Math.random() * 3);
        break;
      case 'apartment':
        stars = 2 + Math.floor(Math.random() * 3);
        break;
      case 'guesthouse':
        stars = 1 + Math.floor(Math.random() * 3);
        break;
    }
    
    // Random rating (6.5-9.5)
    const rating = 6.5 + Math.random() * 3;
    
    // Random review count (50-1000)
    const reviewCount = 50 + Math.floor(Math.random() * 950);
    
    // Select 3-8 random amenities
    const numAmenities = 3 + Math.floor(Math.random() * 6);
    const shuffledAmenities = [...amenitiesList].sort(() => 0.5 - Math.random());
    const selectedAmenities = shuffledAmenities.slice(0, numAmenities);
    
    // Image based on type
    let image;
    switch (type) {
      case 'hotel':
        image = stars >= 4 
          ? '/hotel-images/hotel-room-luxary.jpg' 
          : '/hotel-images/hotel-room-moderate.jpg';
        break;
      case 'hostel':
        image = '/hotel-images/hostel-room.jpg';
        break;
      case 'apartment':
        image = '/hotel-images/hotel-room-moderate.jpg';
        break;
      case 'guesthouse':
        image = '/hotel-images/hotel-room-moderate.jpg';
        break;
    }
    
    // Create the accommodation object
    generatedAccommodations.push({
      id: `generated-${i + 1}`,
      name: `${namePrefix} ${params.cityName} ${nameSuffix}`,
      type,
      stars,
      address: `${Math.floor(Math.random() * 150) + 1} Main Street, ${params.cityName}`,
      latitude: cityCoordinates.lat + latVariation,
      longitude: cityCoordinates.lng + lngVariation,
      price: {
        amount: basePrice,
        currency: 'EUR'
      },
      images: [image],
      rating,
      reviewCount,
      amenities: selectedAmenities,
      url: 'https://www.booking.com'
    });
  }
  
  return generatedAccommodations;
}

// Helper function to get coordinates for common cities or estimate them
function getCityCoordinates(cityName: string): { lat: number, lng: number } {
  // Lowercase the city name to standardize comparisons
  const cityNameLower = cityName.toLowerCase().trim();
  console.log(`Getting coordinates for "${cityNameLower}"`);
  
  // Common city coordinates (expanded list)
  const cityCoordinates: {[key: string]: {lat: number, lng: number}} = {
    'vienna': { lat: 48.2082, lng: 16.3738 },
    'paris': { lat: 48.8566, lng: 2.3522 },
    'amsterdam': { lat: 52.3676, lng: 4.9041 },
    'berlin': { lat: 52.5200, lng: 13.4050 },
    'rome': { lat: 41.9028, lng: 12.4964 },
    'barcelona': { lat: 41.3851, lng: 2.1734 },
    'london': { lat: 51.5074, lng: -0.1278 },
    'prague': { lat: 50.0755, lng: 14.4378 },
    'budapest': { lat: 47.4979, lng: 19.0402 },
    'munich': { lat: 48.1351, lng: 11.5820 },
    'zurich': { lat: 47.3769, lng: 8.5417 },
    'copenhagen': { lat: 55.6761, lng: 12.5683 },
    'stockholm': { lat: 59.3293, lng: 18.0686 },
    'oslo': { lat: 59.9139, lng: 10.7522 },
    'helsinki': { lat: 60.1699, lng: 24.9384 },
    'madrid': { lat: 40.4168, lng: -3.7038 },
    'lisbon': { lat: 38.7223, lng: -9.1393 },
    'athens': { lat: 37.9838, lng: 23.7275 },
    'istanbul': { lat: 41.0082, lng: 28.9784 },
    'warsaw': { lat: 52.2297, lng: 21.0122 },
    'milan': { lat: 45.4642, lng: 9.1900 },
    'naples': { lat: 40.8518, lng: 14.2681 },
    'venice': { lat: 45.4408, lng: 12.3155 },
    'florence': { lat: 43.7696, lng: 11.2558 },
    'cannes': { lat: 43.5528, lng: 7.0174 },
    'nice': { lat: 43.7102, lng: 7.2620 },
    'marseille': { lat: 43.2965, lng: 5.3698 },
    'lyon': { lat: 45.7640, lng: 4.8357 },
    'hamburg': { lat: 53.5511, lng: 9.9937 },
    'frankfurt': { lat: 50.1109, lng: 8.6821 },
    'brussels': { lat: 50.8503, lng: 4.3517 },
    'geneva': { lat: 46.2044, lng: 6.1432 },
    'ljubljana': { lat: 46.0569, lng: 14.5058 },
    'dubrovnik': { lat: 42.6507, lng: 18.0944 },
    'split': { lat: 43.5081, lng: 16.4402 },
    'zagreb': { lat: 45.8150, lng: 15.9819 },
    'belgrade': { lat: 44.7866, lng: 20.4489 },
    'bucharest': { lat: 44.4268, lng: 26.1025 },
    'sofia': { lat: 42.6977, lng: 23.3219 },
    'bratislava': { lat: 48.1486, lng: 17.1077 },
    'salzburg': { lat: 47.8095, lng: 13.0550 },
    'innsbruck': { lat: 47.2692, lng: 11.4041 },
    'dublin': { lat: 53.3498, lng: -6.2603 },
    'edinburgh': { lat: 55.9533, lng: -3.1883 },
    'glasgow': { lat: 55.8642, lng: -4.2518 },
    'manchester': { lat: 53.4808, lng: -2.2426 },
    'liverpool': { lat: 53.4084, lng: -2.9916 },
    'bordeaux': { lat: 44.8378, lng: -0.5792 },
    'porto': { lat: 41.1579, lng: -8.6291 },
    'seville': { lat: 37.3891, lng: -5.9845 },
    'valencia': { lat: 39.4699, lng: -0.3763 },
    'malaga': { lat: 36.7213, lng: -4.4213 },
    'krakow': { lat: 50.0647, lng: 19.9450 },
    'gdansk': { lat: 54.3520, lng: 18.6466 },
    'riga': { lat: 56.9496, lng: 24.1052 },
    'tallinn': { lat: 59.4370, lng: 24.7536 },
    'vilnius': { lat: 54.6872, lng: 25.2797 }
  };
  
  // Check for exact match
  if (cityCoordinates[cityNameLower]) {
    console.log(`Found exact match for "${cityNameLower}"`);
    return cityCoordinates[cityNameLower];
  }
  
  // Check for partial match
  console.log(`Checking for partial matches among ${Object.keys(cityCoordinates).length} cities`);
  for (const [key, coords] of Object.entries(cityCoordinates)) {
    if (cityNameLower.includes(key) || key.includes(cityNameLower)) {
      console.log(`Found partial match: "${cityNameLower}" matches with "${key}"`);
      return coords;
    }
  }
  
  // Extract city from string like "Vienna, Austria" or "Hotels in Vienna"
  console.log(`No direct match found, trying to extract city from parts of "${cityNameLower}"`);
  const cityParts = cityNameLower.split(/[,\s]+/);
  console.log(`City parts:`, cityParts);
  
  for (const part of cityParts) {
    if (part.length > 3) { // Only check parts with meaningful length
      console.log(`Checking part: "${part}"`);
      for (const [key, coords] of Object.entries(cityCoordinates)) {
        if (part === key || key.includes(part) || part.includes(key)) {
          console.log(`Found match with part "${part}" and city "${key}"`);
          return coords;
        }
      }
    }
  }
  
  // Default to Europe center if city not recognized
  console.log(`No match found for "${cityName}" in coordinate lookup, using default`);
  return { lat: 48.8566, lng: 9.0 }; // Central Europe
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
  } else if (type === 'hotel') {
    if (stars >= 4.5) {
      return '/hotel-images/hotel-room-luxary.jpg';
    } else {
      return '/hotel-images/hotel-room-moderate.jpg';
    }
  } else {
    // apartments, guesthouses or default - use moderate hotel room
    return '/hotel-images/hotel-room-moderate.jpg';
  }
} 