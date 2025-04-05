import axios from 'axios';
import { getCachedData, setCachedData } from '../cache';

// API configuration for TripAdvisor Scraper API from RapidAPI
const RAPIDAPI_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_TRIPADVISOR_KEY || 'your_default_rapidapi_key';
const TRIPADVISOR_API_HOST = 'tripadvisor-scraper.p.rapidapi.com';
const BASE_URL = 'https://tripadvisor-scraper.p.rapidapi.com';

// Cache settings (24 hours by default)
const CACHE_TTL = Number(process.env.CACHE_TTL_ATTRACTIONS) || 86400;

/**
 * Attraction data structure
 */
export interface Attraction {
  id: string;
  name: string;
  type: string; // museum, landmark, etc.
  description?: string;
  address: string;
  latitude: number;
  longitude: number;
  rating?: number;
  reviewCount?: number;
  imageUrl?: string;
  price?: {
    level: 'free' | 'inexpensive' | 'moderate' | 'expensive' | 'very expensive';
    from?: number;
    to?: number;
    currency?: string;
  };
  openingHours?: {
    open: boolean;
    periods?: {
      open: string;
      close: string;
      day: number;
    }[];
    weekdayText?: string[];
  };
  url?: string;
  tags: string[];
  durationHint?: string;
}

/**
 * Search parameters for attractions
 */
export interface AttractionSearchParams {
  cityName: string;
  latitude?: number;
  longitude?: number;
  radius?: number;  // in km
  categories?: string[];
  limit?: number;
}

/**
 * Get attractions for a specific location
 */
export async function getAttractions(params: AttractionSearchParams): Promise<Attraction[]> {
  // Create a cache key based on search parameters
  const cacheKey = `attractions:${params.cityName}:${params.categories?.join(',') || 'all'}:${params.limit || 20}`;
  
  // Check if we have cached data
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    console.log(`Using cached attractions data for ${params.cityName}`);
    return cachedData;
  }
  
  try {
    // Fetch attractions directly using city name
    const attractions = await fetchAttractionsFromAPI(params);
    
    // Cache the data
    setCachedData(cacheKey, attractions, CACHE_TTL);
    
    return attractions;
  } catch (error) {
    console.error(`Error fetching attractions for ${params.cityName}:`, error);
    // Fall back to mock data if API fails
    return getFallbackAttractions(params);
  }
}

/**
 * Fetch attractions from TripAdvisor Scraper API
 */
async function fetchAttractionsFromAPI(params: AttractionSearchParams): Promise<Attraction[]> {
  try {
    // Map our category names to TripAdvisor's categories
    const categoryMapping: Record<string, string> = {
      'museums': 'Museums',
      'landmarks': 'Landmarks',
      'nature': 'Nature & Parks',
      'entertainment': 'Fun & Games',
      'shopping': 'Shopping',
      'food': 'Food & Drink',
      'nightlife': 'Nightlife'
    };
    
    // Default to attractions if no categories specified
    const categoriesToQuery = params.categories && params.categories.length > 0
      ? params.categories.map(cat => categoryMapping[cat.toLowerCase()] || 'Landmarks')
      : ['Landmarks', 'Museums'];
    
    const allAttractions: Attraction[] = [];
    
    // Use the search endpoint to find attractions in the city
    const response = await axios.get(`${BASE_URL}/search/attractions`, {
      params: {
        location: params.cityName,
        filters: categoriesToQuery.join(','),
        limit: params.limit || 20,
        offset: 0,
        currency: 'EUR'
      },
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': TRIPADVISOR_API_HOST
      }
    });
    
    // Define type for attraction search response
    interface AttractionSearchResponse {
      data: {
        results: Array<{
          id: string;
          name: string;
          rating?: number;
          review_count?: number;
          booking_info?: {
            price?: string;
          };
          address?: string;
          image?: {
            url: string;
          };
          category?: {
            name: string;
            subcategory?: Array<{
              name: string;
            }>;
          };
          distance_string?: string;
          rank_badge?: string;
          attraction_types?: string[];
          url?: string;
          website?: string;
          description?: string;
        }>;
      };
    }
    
    const data = response.data as AttractionSearchResponse;
    
    if (data && data.data && data.data.results) {
      // Process each attraction and get detailed info
      for (const item of data.data.results) {
        // Only get details for the first 5 items to avoid too many requests
        let attractionDetails = null;
        if (allAttractions.length < 5) {
          try {
            attractionDetails = await getAttractionDetails(item.id);
          } catch (error) {
            console.error(`Failed to get details for attraction ${item.id}:`, error);
          }
        }
        
        if (attractionDetails) {
          allAttractions.push(attractionDetails);
        } else {
          // If we couldn't get details, use basic info from search results
          allAttractions.push(transformSearchResult(item, params.cityName));
        }
        
        // Stop if we've reached the limit
        if (allAttractions.length >= (params.limit || 20)) {
          break;
        }
      }
    }
    
    // Sort by rating (highest first)
    return allAttractions.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } catch (error) {
    console.error('Error fetching attractions:', error);
    throw error;
  }
}

/**
 * Transform search result to our Attraction interface
 */
function transformSearchResult(item: any, cityName: string): Attraction {
  // Determine type based on attraction_types or category
  let type = 'landmark';
  
  if (item.attraction_types && item.attraction_types.length > 0) {
    // Map attraction types to our types
    const attractionTypeMap: Record<string, string> = {
      'Museum': 'museum',
      'Historical Site': 'landmark',
      'Park': 'nature',
      'Garden': 'nature',
      'Theater': 'entertainment',
      'Shopping': 'shopping',
      'Bar': 'nightlife',
      'Restaurant': 'food'
    };
    
    for (const aType of item.attraction_types) {
      if (attractionTypeMap[aType]) {
        type = attractionTypeMap[aType];
        break;
      }
    }
  } else if (item.category && item.category.name) {
    // Use category name as fallback
    const categoryName = item.category.name.toLowerCase();
    if (categoryName.includes('museum')) type = 'museum';
    else if (categoryName.includes('nature') || categoryName.includes('park')) type = 'nature';
    else if (categoryName.includes('entertainment') || categoryName.includes('fun')) type = 'entertainment';
    else if (categoryName.includes('shop')) type = 'shopping';
    else if (categoryName.includes('food') || categoryName.includes('restaurant')) type = 'food';
    else if (categoryName.includes('night') || categoryName.includes('bar')) type = 'nightlife';
  }
  
  // Extract price level
  let price: Attraction['price'] = { level: 'moderate' };
  
  if (item.booking_info && item.booking_info.price) {
    const priceStr = item.booking_info.price;
    if (priceStr.includes('$')) {
      const dollarSigns = (priceStr.match(/\$/g) || []).length;
      if (dollarSigns === 1) price.level = 'inexpensive';
      else if (dollarSigns === 2) price.level = 'moderate';
      else if (dollarSigns === 3) price.level = 'expensive';
      else if (dollarSigns >= 4) price.level = 'very expensive';
    } else if (priceStr.toLowerCase().includes('free')) {
      price.level = 'free';
    }
  }
  
  // Generate tags from subcategories and attraction types
  const tags: string[] = [];
  
  if (item.attraction_types) {
    tags.push(...item.attraction_types);
  }
  
  if (item.category && item.category.subcategory) {
    item.category.subcategory.forEach((sub: any) => {
      if (sub.name) tags.push(sub.name);
    });
  }
  
  // Create the attraction object
  return {
    id: item.id || `attraction-${Math.random().toString(36).substr(2, 9)}`,
    name: item.name,
    type,
    description: item.description || "",
    address: item.address || `${cityName}`,
    latitude: 0, // Will be filled by actual data if available
    longitude: 0, // Will be filled by actual data if available
    rating: item.rating,
    reviewCount: item.review_count,
    imageUrl: item.image?.url || '',
    price,
    url: item.url || item.website || '',
    tags: Array.from(new Set(tags)), // Remove duplicates
    durationHint: item.distance_string || ''
  };
}

/**
 * Get detailed information for a specific attraction
 */
async function getAttractionDetails(attractionId: string): Promise<Attraction | null> {
  try {
    const response = await axios.get(`${BASE_URL}/attraction`, {
      params: {
        id: attractionId,
        currency: 'EUR'
      },
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': TRIPADVISOR_API_HOST
      }
    });
    
    // Define type for attraction details response
    interface AttractionDetailsResponse {
      data: {
        id: string;
        name: string;
        description?: string;
        rating?: number;
        review_count?: number;
        photo?: {
          images: {
            large: {
              url: string;
            };
          };
        };
        address_obj?: {
          street1?: string;
          city?: string;
          country?: string;
        };
        address?: string;
        latitude?: number;
        longitude?: number;
        hours?: {
          weekday_text?: string[];
        };
        price_level?: string;
        price?: string;
        website?: string;
        category?: {
          name: string;
        };
        subcategory?: Array<{
          name: string;
        }>;
        trip_types?: Array<{
          name: string;
        }>;
        ranking_data?: {
          ranking_string?: string;
        };
        suggested_duration?: string;
        web_url?: string;
      };
    }
    
    const data = response.data as AttractionDetailsResponse;
    
    if (!data || !data.data) {
      return null;
    }
    
    const details = data.data;
    
    // Determine type based on category
    let type = 'landmark';
    if (details.category) {
      const categoryName = details.category.name.toLowerCase();
      if (categoryName.includes('museum')) type = 'museum';
      else if (categoryName.includes('nature') || categoryName.includes('park')) type = 'nature';
      else if (categoryName.includes('entertainment') || categoryName.includes('fun')) type = 'entertainment';
      else if (categoryName.includes('shop')) type = 'shopping';
      else if (categoryName.includes('food') || categoryName.includes('restaurant')) type = 'food';
      else if (categoryName.includes('night') || categoryName.includes('bar')) type = 'nightlife';
    }
    
    // Determine price level
    let price: Attraction['price'] = { level: 'moderate' };
    if (details.price_level) {
      const priceLevel = details.price_level.trim();
      if (priceLevel === '$') price.level = 'inexpensive';
      else if (priceLevel === '$$') price.level = 'moderate';
      else if (priceLevel === '$$$') price.level = 'expensive';
      else if (priceLevel === '$$$$') price.level = 'very expensive';
      else if (priceLevel.toLowerCase().includes('free')) price.level = 'free';
    }
    
    // Extract tags
    const tags: string[] = [];
    
    // Add subcategories as tags
    if (details.subcategory) {
      details.subcategory.forEach(sub => {
        if (sub.name) tags.push(sub.name);
      });
    }
    
    // Add trip types as tags
    if (details.trip_types) {
      details.trip_types.forEach(tripType => {
        if (tripType.name) tags.push(tripType.name);
      });
    }
    
    // Construct address
    let address = details.address || '';
    if (!address && details.address_obj) {
      const parts = [
        details.address_obj.street1,
        details.address_obj.city,
        details.address_obj.country
      ].filter(Boolean);
      address = parts.join(', ');
    }
    
    // Create the attraction object
    return {
      id: details.id,
      name: details.name,
      type,
      description: details.description || '',
      address,
      latitude: details.latitude || 0,
      longitude: details.longitude || 0,
      rating: details.rating,
      reviewCount: details.review_count,
      imageUrl: details.photo?.images?.large?.url || '',
      price,
      openingHours: details.hours ? {
        open: true,
        weekdayText: details.hours.weekday_text
      } : undefined,
      url: details.web_url || details.website || '',
      tags: Array.from(new Set(tags)), // Remove duplicates
      durationHint: details.suggested_duration || ''
    };
  } catch (error) {
    console.error(`Error fetching attraction details for ID ${attractionId}:`, error);
    return null;
  }
}

/**
 * Fallback attractions data when API fails
 */
function getFallbackAttractions(params: AttractionSearchParams): Attraction[] {
  // Define common attractions by category for popular European cities
  const popularAttractions: Record<string, Attraction[]> = {
    'Paris': [
      {
        id: 'paris-1',
        name: 'Eiffel Tower',
        type: 'landmark',
        description: 'Iconic tower offering breathtaking views of Paris',
        address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France',
        latitude: 48.8584,
        longitude: 2.2945,
        rating: 4.6,
        reviewCount: 140356,
        imageUrl: '/images/eiffel-tower.jpg',
        price: { level: 'moderate', from: 16, to: 25, currency: 'EUR' },
        url: 'https://www.toureiffel.paris/en',
        tags: ['Landmark', 'Monument', 'Observation Deck']
      },
      {
        id: 'paris-2',
        name: 'Louvre Museum',
        type: 'museum',
        description: 'World-renowned art museum home to the Mona Lisa',
        address: 'Rue de Rivoli, 75001 Paris, France',
        latitude: 48.8606,
        longitude: 2.3376,
        rating: 4.7,
        reviewCount: 95287,
        imageUrl: '/images/louvre.jpg',
        price: { level: 'moderate', from: 15, to: 17, currency: 'EUR' },
        url: 'https://www.louvre.fr/en',
        tags: ['Museum', 'Art', 'History']
      },
      {
        id: 'paris-3',
        name: 'Notre-Dame Cathedral',
        type: 'landmark',
        description: 'Medieval Catholic cathedral on the Île de la Cité',
        address: '6 Parvis Notre-Dame - Pl. Jean-Paul II, 75004 Paris, France',
        latitude: 48.8530,
        longitude: 2.3499,
        rating: 4.7,
        reviewCount: 71005,
        imageUrl: '/images/notre-dame.jpg',
        price: { level: 'free' },
        tags: ['Cathedral', 'Church', 'Gothic Architecture']
      }
    ],
    'London': [
      {
        id: 'london-1',
        name: 'British Museum',
        type: 'museum',
        description: 'World-class collection of artifacts from around the globe',
        address: 'Great Russell St, London WC1B 3DG, UK',
        latitude: 51.5194,
        longitude: -0.1269,
        rating: 4.8,
        reviewCount: 72406,
        imageUrl: '/images/british-museum.jpg',
        price: { level: 'free' },
        url: 'https://www.britishmuseum.org/',
        tags: ['Museum', 'History', 'Art']
      },
      {
        id: 'london-2',
        name: 'Tower of London',
        type: 'landmark',
        description: 'Historic castle housing the Crown Jewels',
        address: 'Tower Hill, London EC3N 4AB, UK',
        latitude: 51.5081,
        longitude: -0.0759,
        rating: 4.6,
        reviewCount: 65942,
        imageUrl: '/images/tower-of-london.jpg',
        price: { level: 'expensive', from: 25, to: 30, currency: 'GBP' },
        url: 'https://www.hrp.org.uk/tower-of-london/',
        tags: ['Castle', 'History', 'Royal']
      }
    ],
    'Rome': [
      {
        id: 'rome-1',
        name: 'Colosseum',
        type: 'landmark',
        description: 'Iconic ancient Roman amphitheater',
        address: 'Piazza del Colosseo, 1, 00184 Roma RM, Italy',
        latitude: 41.8902,
        longitude: 12.4922,
        rating: 4.7,
        reviewCount: 87354,
        imageUrl: '/images/colosseum.jpg',
        price: { level: 'moderate', from: 16, to: 22, currency: 'EUR' },
        url: 'https://www.il-colosseo.it/en/',
        tags: ['Monument', 'Ancient', 'Roman Empire']
      },
      {
        id: 'rome-2',
        name: 'Vatican Museums',
        type: 'museum',
        description: 'World-famous museum complex in Vatican City',
        address: 'Viale Vaticano, 00165 Roma RM, Italy',
        latitude: 41.9062,
        longitude: 12.4534,
        rating: 4.6,
        reviewCount: 38291,
        imageUrl: '/images/vatican-museums.jpg',
        price: { level: 'moderate', from: 17, to: 21, currency: 'EUR' },
        url: 'http://www.museivaticani.va/content/museivaticani/en.html',
        tags: ['Museum', 'Art', 'Religious']
      }
    ],
    'Amsterdam': [
      {
        id: 'amsterdam-1',
        name: 'Anne Frank House',
        type: 'museum',
        description: 'Biographical museum dedicated to Anne Frank',
        address: 'Prinsengracht 263-267, 1016 GV Amsterdam, Netherlands',
        latitude: 52.3752,
        longitude: 4.8840,
        rating: 4.5,
        reviewCount: 62748,
        imageUrl: '/images/anne-frank.jpg',
        price: { level: 'inexpensive', from: 10, to: 14, currency: 'EUR' },
        url: 'https://www.annefrank.org/en/',
        tags: ['Museum', 'History', 'World War II']
      },
      {
        id: 'amsterdam-2',
        name: 'Van Gogh Museum',
        type: 'museum',
        description: 'Museum housing the largest collection of Van Gogh\'s works',
        address: 'Museumplein 6, 1071 DJ Amsterdam, Netherlands',
        latitude: 52.3584,
        longitude: 4.8810,
        rating: 4.6,
        reviewCount: 45198,
        imageUrl: '/images/van-gogh.jpg',
        price: { level: 'moderate', from: 19, to: 19, currency: 'EUR' },
        url: 'https://www.vangoghmuseum.nl/en',
        tags: ['Museum', 'Art', 'Painting']
      }
    ]
  };
  
  // Generic attractions for any city not in our database
  const genericAttractions: Record<string, Attraction[]> = {
    'museum': [
      {
        id: 'generic-museum-1',
        name: `${params.cityName} National Museum`,
        type: 'museum',
        description: `Main museum showcasing ${params.cityName}'s history and culture`,
        address: `Museum Street, ${params.cityName}`,
        latitude: 0,
        longitude: 0,
        rating: 4.3,
        reviewCount: 2184,
        price: { level: 'moderate', from: 10, to: 15, currency: 'EUR' },
        tags: ['Museum', 'History', 'Culture']
      },
      {
        id: 'generic-museum-2',
        name: `${params.cityName} Art Gallery`,
        type: 'museum',
        description: 'Contemporary art museum with rotating exhibitions',
        address: `Art Street 45, ${params.cityName}`,
        latitude: 0,
        longitude: 0,
        rating: 4.1,
        reviewCount: 892,
        price: { level: 'inexpensive', from: 5, to: 10, currency: 'EUR' },
        tags: ['Museum', 'Art', 'Contemporary']
      }
    ],
    'landmark': [
      {
        id: 'generic-landmark-1',
        name: `${params.cityName} Cathedral`,
        type: 'landmark',
        description: `Historic cathedral in the center of ${params.cityName}`,
        address: `Cathedral Square, ${params.cityName}`,
        latitude: 0,
        longitude: 0,
        rating: 4.5,
        reviewCount: 3267,
        price: { level: 'free' },
        tags: ['Cathedral', 'Church', 'Architecture']
      },
      {
        id: 'generic-landmark-2',
        name: `${params.cityName} Castle`,
        type: 'landmark',
        description: 'Medieval castle with panoramic views of the city',
        address: `Castle Hill, ${params.cityName}`,
        latitude: 0,
        longitude: 0,
        rating: 4.4,
        reviewCount: 2651,
        price: { level: 'moderate', from: 8, to: 12, currency: 'EUR' },
        tags: ['Castle', 'History', 'Medieval']
      }
    ],
    'nature': [
      {
        id: 'generic-nature-1',
        name: `${params.cityName} City Park`,
        type: 'nature',
        description: 'Large urban park with walking paths and gardens',
        address: `Park Avenue, ${params.cityName}`,
        latitude: 0,
        longitude: 0,
        rating: 4.6,
        reviewCount: 1845,
        price: { level: 'free' },
        tags: ['Park', 'Nature', 'Recreation']
      },
      {
        id: 'generic-nature-2',
        name: `${params.cityName} Botanical Gardens`,
        type: 'nature',
        description: 'Diverse collection of plant species from around the world',
        address: `Botanical Street 12, ${params.cityName}`,
        latitude: 0,
        longitude: 0,
        rating: 4.2,
        reviewCount: 932,
        price: { level: 'inexpensive', from: 3, to: 6, currency: 'EUR' },
        tags: ['Garden', 'Nature', 'Botanical']
      }
    ],
    'food': [
      {
        id: 'generic-food-1',
        name: `${params.cityName} Central Market`,
        type: 'food',
        description: 'Indoor market with local food specialties and produce',
        address: `Market Street, ${params.cityName}`,
        latitude: 0,
        longitude: 0,
        rating: 4.4,
        reviewCount: 1654,
        price: { level: 'inexpensive' },
        tags: ['Market', 'Food', 'Local Cuisine']
      }
    ],
    'entertainment': [
      {
        id: 'generic-entertainment-1',
        name: `${params.cityName} Opera House`,
        type: 'entertainment',
        description: 'Historic venue for opera and classical music performances',
        address: `Opera Square 1, ${params.cityName}`,
        latitude: 0,
        longitude: 0,
        rating: 4.7,
        reviewCount: 1234,
        price: { level: 'expensive', from: 30, to: 100, currency: 'EUR' },
        tags: ['Opera', 'Music', 'Performance']
      }
    ]
  };
  
  // Try to find attractions for the specific city
  let cityAttractions = popularAttractions[params.cityName] || [];
  
  // If not enough attractions, add generic ones based on requested categories
  if (cityAttractions.length < (params.limit || 5)) {
    // Determine which generic categories to include
    const categoriesToInclude: string[] = [];
    
    if (params.categories && params.categories.length > 0) {
      // Include only requested categories
      categoriesToInclude.push(...params.categories);
    } else {
      // If no categories specified, include all
      categoriesToInclude.push('museum', 'landmark', 'nature', 'food', 'entertainment');
    }
    
    // Add generic attractions from each category
    for (const category of categoriesToInclude) {
      if (genericAttractions[category]) {
        cityAttractions = [...cityAttractions, ...genericAttractions[category]];
      }
    }
  }
  
  // Apply limit if specified
  if (params.limit) {
    cityAttractions = cityAttractions.slice(0, params.limit);
  }
  
  return cityAttractions;
} 