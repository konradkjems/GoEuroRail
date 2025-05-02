import axios from 'axios';
import { getCachedData, setCachedData } from '../cache';
import { Accommodation, AccommodationSearchParams } from './accommodationService';
import { getHotelImages } from './viennaHotelImages';

// API configuration
const BOOKING_AFFILIATE_ID = process.env.NEXT_PUBLIC_BOOKING_AFFILIATE_ID || 'your-affiliate-id';
const BOOKING_API_KEY = process.env.NEXT_PUBLIC_BOOKING_API_KEY || 'your-api-key';
const BASE_URL = 'https://distribution-xml.booking.com/json';

// Cache settings (24 hours by default)
const CACHE_TTL = Number(process.env.CACHE_TTL_HOTELS) || 86400;

/**
 * Get accommodations from Booking.com
 */
export async function getBookingAccommodations(params: AccommodationSearchParams): Promise<Accommodation[]> {
  try {
    // Create a cache key based on the search parameters
    const cacheKey = `booking:accommodations:${params.cityName}:${params.checkIn}-${params.checkOut}:${params.adults}:${params.rooms || 1}:${params.priceMin || 0}-${params.priceMax || 1000}`;
    
    // Check if we have cached data
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      console.log(`Using cached Booking.com data for ${params.cityName}`);
      return cachedData;
    }
    
    // If no cached data, fetch from API
    const data = await fetchBookingAccommodations(params);
    
    // Cache the results
    setCachedData(cacheKey, data, CACHE_TTL);
    
    return data;
  } catch (error) {
    console.error(`Error fetching Booking.com accommodations for ${params.cityName}:`, error);
    // Return empty array if API fails - fallback to accommodationService mock data
    return [];
  }
}

/**
 * Fetch accommodations from Booking.com API
 * Note: This is a simplified implementation assuming Booking.com's API structure
 * You'll need to adjust this based on the actual API documentation provided by Booking.com
 */
async function fetchBookingAccommodations(params: AccommodationSearchParams): Promise<Accommodation[]> {
  try {
    // Format check-in and check-out dates for Booking.com's API
    const checkIn = params.checkIn;
    const checkOut = params.checkOut;
    
    // For a real implementation, we'd follow Booking.com's API documentation
    // For now, we'll use multi-city mock data
    const requestBody = {
      city: params.cityName,
      arrival_date: checkIn,
      departure_date: checkOut,
      room_qty: params.rooms || 1,
      guest_qty: params.adults,
      affiliate_id: BOOKING_AFFILIATE_ID,
      api_key: BOOKING_API_KEY
    };
    
    // Use multi-city accommodation data with the requested city
    return getMultiCityAccommodations(params.cityName);
  } catch (error) {
    console.error('Error fetching from Booking.com API:', error);
    return [];
  }
}

/**
 * Get multi-city accommodation data 
 * Dynamically adjusts data to match the requested city
 */
function getMultiCityAccommodations(cityName: string): Accommodation[] {
  // Normalize city name for matching
  const normalizedCityName = cityName.toLowerCase().trim();
  
  // Coordinates for different cities
  const cityCoordinates: {[key: string]: {lat: number, lng: number, country: string}} = {
    'vienna': { lat: 48.2082, lng: 16.3738, country: 'Austria' },
    'paris': { lat: 48.8566, lng: 2.3522, country: 'France' },
    'amsterdam': { lat: 52.3676, lng: 4.9041, country: 'Netherlands' },
    'berlin': { lat: 52.5200, lng: 13.4050, country: 'Germany' },
    'rome': { lat: 41.9028, lng: 12.4964, country: 'Italy' },
    'barcelona': { lat: 41.3851, lng: 2.1734, country: 'Spain' },
    'london': { lat: 51.5074, lng: -0.1278, country: 'UK' },
    'prague': { lat: 50.0755, lng: 14.4378, country: 'Czech Republic' },
    'budapest': { lat: 47.4979, lng: 19.0402, country: 'Hungary' },
    'munich': { lat: 48.1351, lng: 11.5820, country: 'Germany' },
    'zurich': { lat: 47.3769, lng: 8.5417, country: 'Switzerland' },
    'copenhagen': { lat: 55.6761, lng: 12.5683, country: 'Denmark' },
    'stockholm': { lat: 59.3293, lng: 18.0686, country: 'Sweden' },
    'oslo': { lat: 59.9139, lng: 10.7522, country: 'Norway' },
    'helsinki': { lat: 60.1699, lng: 24.9384, country: 'Finland' },
    'madrid': { lat: 40.4168, lng: -3.7038, country: 'Spain' },
    'lisbon': { lat: 38.7223, lng: -9.1393, country: 'Portugal' },
    'athens': { lat: 37.9838, lng: 23.7275, country: 'Greece' },
    'istanbul': { lat: 41.0082, lng: 28.9784, country: 'Turkey' },
    'warsaw': { lat: 52.2297, lng: 21.0122, country: 'Poland' },
    'milan': { lat: 45.4642, lng: 9.1900, country: 'Italy' },
    'naples': { lat: 40.8518, lng: 14.2681, country: 'Italy' },
    'venice': { lat: 45.4408, lng: 12.3155, country: 'Italy' },
    'florence': { lat: 43.7696, lng: 11.2558, country: 'Italy' }
  };
  
  // Famous streets in each city - used to make addresses more realistic
  const cityStreets: {[key: string]: string[]} = {
    'vienna': ['Kärntner Straße', 'Mariahilfer Straße', 'Graben', 'Ringstrasse', 'Praterstrasse'],
    'paris': ['Champs-Élysées', 'Rue de Rivoli', 'Boulevard Saint-Germain', 'Rue Montorgueil', 'Avenue Montaigne'],
    'amsterdam': ['Damrak', 'Kalverstraat', 'Prinsengracht', 'Rozengracht', 'Singel'],
    'berlin': ['Kurfürstendamm', 'Unter den Linden', 'Friedrichstraße', 'Karl-Marx-Allee', 'Potsdamer Platz'],
    'rome': ['Via del Corso', 'Via Veneto', 'Via Condotti', 'Via Nazionale', 'Via Appia Antica'],
    'barcelona': ['La Rambla', 'Passeig de Gràcia', 'Avinguda Diagonal', 'Carrer de Sants', 'Carrer de Balmes'],
    'london': ['Oxford Street', 'Regent Street', 'Baker Street', 'Bond Street', 'Carnaby Street'],
    'prague': ['Wenceslas Square', 'Na Příkopě', 'Pařížská', 'Národní', 'Nerudova'],
    'default': ['Main Street', 'High Street', 'Market Square', 'Station Road', 'Central Avenue']
  };
  
  // Common hotel names that can be used in any city
  const hotelChains = [
    'Hilton', 'Marriott', 'Radisson', 'Sheraton', 'Holiday Inn', 
    'Ibis', 'Novotel', 'Mövenpick', 'InterContinental', 'NH Hotels',
    'Best Western', 'Mercure', 'Crowne Plaza', 'Four Seasons', 'Hyatt'
  ];
  
  // Local hotel name patterns for each city
  const localHotelNames: {[key: string]: string[]} = {
    'vienna': ['Vienna Palace', 'Imperial Vienna', 'Sacher', 'Mozart Grand', 'Belvedere House'],
    'paris': ['Paris Elegance', 'Seine View', 'Louvre Luxe', 'Montmartre Lodge', 'Eiffel Prestige'],
    'amsterdam': ['Canal House', 'Tulip Inn', 'Windmill View', 'Old Amsterdam', 'Dutch Quarter'],
    'berlin': ['Berlin Mitte', 'Checkpoint', 'Brandenburg Gate Inn', 'Unter den Linden', 'Alexanderplatz'],
    'rome': ['Roman Forum', 'Vatican View', 'Colosseum Plaza', 'Trevi House', 'Trastevere'],
    'default': ['City Center', 'Central Plaza', 'Downtown', 'Old Town', 'Grand Hotel']
  };
  
  // Template hotel data to modify
  const templateHotels = [
    {
      id: 'template-1',
      name: 'HOTEL_NAME_PLACEHOLDER',
      type: 'hotel',
      stars: 4,
      address: 'STREET_PLACEHOLDER, CITY_PLACEHOLDER, COUNTRY_PLACEHOLDER',
      latitude: 0,
      longitude: 0,
      price: { amount: 216.00, currency: 'EUR' },
      rating: 8.8,
      reviewCount: 245,
      amenities: ['Wi-Fi', 'Kitchen', 'Air conditioning', 'Non-smoking rooms']
    },
    {
      id: 'template-2',
      name: 'HOTEL_NAME_PLACEHOLDER',
      type: 'hotel',
      stars: 4,
      address: 'STREET_PLACEHOLDER, CITY_PLACEHOLDER, COUNTRY_PLACEHOLDER',
      latitude: 0,
      longitude: 0,
      price: { amount: 369.00, currency: 'EUR' },
      rating: 9.0,
      reviewCount: 530,
      amenities: ['Wi-Fi', 'Fitness center', 'Bar', 'Restaurant', '24-hour front desk']
    },
    {
      id: 'template-3',
      name: 'HOTEL_NAME_PLACEHOLDER',
      type: 'hostel',
      stars: 3,
      address: 'STREET_PLACEHOLDER, CITY_PLACEHOLDER, COUNTRY_PLACEHOLDER',
      latitude: 0,
      longitude: 0,
      price: { amount: 174.95, currency: 'EUR' },
      rating: 8.2,
      reviewCount: 468,
      amenities: ['Wi-Fi', 'Shared kitchen', 'Bar', 'Game room']
    },
    {
      id: 'template-4',
      name: 'HOTEL_NAME_PLACEHOLDER',
      type: 'hotel',
      stars: 5,
      address: 'STREET_PLACEHOLDER, CITY_PLACEHOLDER, COUNTRY_PLACEHOLDER',
      latitude: 0, 
      longitude: 0,
      price: { amount: 418.00, currency: 'EUR' },
      rating: 8.4,
      reviewCount: 218,
      amenities: ['Wi-Fi', 'Restaurant', 'Bar', 'Terrace', 'Fitness center']
    },
    {
      id: 'template-5',
      name: 'HOTEL_NAME_PLACEHOLDER',
      type: 'apartment',
      stars: 3,
      address: 'STREET_PLACEHOLDER, CITY_PLACEHOLDER, COUNTRY_PLACEHOLDER',
      latitude: 0,
      longitude: 0,
      price: { amount: 255.56, currency: 'EUR' },
      rating: 8.5,
      reviewCount: 362,
      amenities: ['Wi-Fi', 'Breakfast', 'Air conditioning', 'Bar']
    }
  ];
  
  // Find the proper city
  let cityData;
  let matchedCityName = '';
  
  // Try direct match first
  if (cityCoordinates[normalizedCityName]) {
    cityData = cityCoordinates[normalizedCityName];
    matchedCityName = normalizedCityName;
  } else {
    // Try partial matching
    for (const [city, coords] of Object.entries(cityCoordinates)) {
      if (normalizedCityName.includes(city) || city.includes(normalizedCityName)) {
        cityData = coords;
        matchedCityName = city;
        break;
      }
    }
  }
  
  // Default to Vienna if no match found
  if (!cityData) {
    console.log(`No city match found for: ${normalizedCityName}, using Vienna data`);
    cityData = cityCoordinates['vienna'];
    matchedCityName = 'vienna';
  }
  
  // Capitalize first letter of matched city name
  const displayCity = matchedCityName.charAt(0).toUpperCase() + matchedCityName.slice(1);
  
  // Get streets for this city
  const streets = cityStreets[matchedCityName] || cityStreets['default'];
  
  // Get local hotel names for this city
  const localNames = localHotelNames[matchedCityName] || localHotelNames['default'];
  
  // Generate 8 hotels for the requested city
  return templateHotels.map((template, index) => {
    // Create a deep copy of the template
    const hotel = JSON.parse(JSON.stringify(template));
    
    // Set offsets to create a cluster of hotels
    const latOffset = (index - 2) * 0.003;
    const lngOffset = (index - 2) * 0.004;
    
    // Set the coordinates
    hotel.latitude = cityData.lat + latOffset;
    hotel.longitude = cityData.lng + lngOffset;
    
    // Select a random street
    const street = streets[Math.floor(Math.random() * streets.length)];
    
    // Create a random street number
    const streetNumber = Math.floor(Math.random() * 150) + 1;
    
    // Set hotel name (50% chain hotels, 50% local hotels)
    if (Math.random() > 0.5) {
      // Use a chain hotel name
      const chain = hotelChains[Math.floor(Math.random() * hotelChains.length)];
      hotel.name = `${chain} ${displayCity}`;
    } else {
      // Use a local hotel name
      const localName = localNames[Math.floor(Math.random() * localNames.length)];
      hotel.name = `${localName} ${Math.random() > 0.7 ? displayCity : ''}`;
    }
    
    // Set the address
    hotel.address = `${street} ${streetNumber}, ${displayCity}, ${cityData.country}`;
    
    // Set a unique ID
    hotel.id = `${matchedCityName}-${hotel.type}-${index + 1}`;
    
    // Price variations
    const priceAdjustment = 0.9 + (Math.random() * 0.4); // Adjust by 0.9-1.3
    hotel.price.amount = Math.round(hotel.price.amount * priceAdjustment);
    
    // Set appropriate image based on hotel type and star rating
    hotel.images = [getHotelImageByType(hotel.type, hotel.stars)];
    
    return hotel;
  });
}

/**
 * Get hardcoded Vienna accommodation data to match the screenshot
 * This is kept for backward compatibility
 */
function getViennaAccommodations(cityName: string): Accommodation[] {
  // If request is specifically for Vienna, use the original data
  if (cityName.toLowerCase().includes('vienna')) {
    const viennaHotels = [
      {
        id: 'jaz-1',
        name: 'Jaz in the City Vienna',
        type: 'hotel',
        stars: 4,
        address: 'Windmühlgasse 28, Vienna, Austria',
        latitude: 48.2100,
        longitude: 16.3700,
        price: { amount: 369.00, currency: 'EUR' },
        rating: 9.0,
        reviewCount: 530,
        amenities: ['Wi-Fi', 'Fitness center', 'Bar', 'Restaurant', '24-hour front desk']
      },
      {
        id: 'xuba-1',
        name: 'XuBa ApartmentRooms Messe Wien Prater',
        type: 'apartment',
        stars: 4,
        address: 'Prater Street 123, Vienna, Austria',
        latitude: 48.2167,
        longitude: 16.3833,
        price: { amount: 216.00, currency: 'EUR' },
        rating: 8.8,
        reviewCount: 245,
        amenities: ['Wi-Fi', 'Kitchen', 'Air conditioning', 'Non-smoking rooms']
      },
      {
        id: 'florum-1',
        name: 'Florum Hotel',
        type: 'hotel',
        stars: 3,
        address: 'Neubaugasse, Vienna, Austria',
        latitude: 48.2120,
        longitude: 16.3650,
        price: { amount: 274.78, currency: 'EUR' },
        rating: 7.5,
        reviewCount: 326,
        amenities: ['Wi-Fi', 'Breakfast', 'Non-smoking rooms']
      },
      {
        id: 'holiday-1',
        name: 'Holiday Inn - the niu, Franz Vienna by IHG',
        type: 'hotel',
        stars: 3,
        address: 'Mariahilferstrasse, Vienna, Austria',
        latitude: 48.2080,
        longitude: 16.3720,
        price: { amount: 174.95, currency: 'EUR' },
        rating: 8.2,
        reviewCount: 468,
        amenities: ['Wi-Fi', 'Parking', 'Restaurant', 'Bar', 'Air conditioning']
      },
      {
        id: 'superbude-1',
        name: 'Superbude Wien Prater',
        type: 'hostel',
        stars: 3, 
        address: 'Praterstrasse, Vienna, Austria',
        latitude: 48.2140,
        longitude: 16.3730,
        price: { amount: 269.95, currency: 'EUR' },
        rating: 8.9,
        reviewCount: 512,
        amenities: ['Wi-Fi', 'Shared kitchen', 'Bar', 'Game room']
      },
      {
        id: 'hoxton-1',
        name: 'The Hoxton Vienna',
        type: 'hotel',
        stars: 4,
        address: 'Stephansplatz, Vienna, Austria',
        latitude: 48.2050,
        longitude: 16.3770,
        price: { amount: 418.00, currency: 'EUR' },
        rating: 8.4,
        reviewCount: 218,
        amenities: ['Wi-Fi', 'Restaurant', 'Bar', 'Terrace', 'Fitness center']
      },
      {
        id: 'hilton-1',
        name: 'Hilton Vienna Waterfront',
        type: 'hotel',
        stars: 5,
        address: 'Donaukanal, Vienna, Austria',
        latitude: 48.2200,
        longitude: 16.3800,
        price: { amount: 316.96, currency: 'EUR' },
        rating: 8.2,
        reviewCount: 478,
        amenities: ['Wi-Fi', 'Pool', 'Restaurant', 'Bar', 'Fitness center']
      },
      {
        id: 'austria-1',
        name: 'Austria Trend Hotel Doppio',
        type: 'hotel',
        stars: 4,
        address: 'Rennweg, Vienna, Austria',
        latitude: 48.1900,
        longitude: 16.3900,
        price: { amount: 255.56, currency: 'EUR' },
        rating: 8.5,
        reviewCount: 362,
        amenities: ['Wi-Fi', 'Breakfast', 'Air conditioning', 'Bar']
      }
    ];

    // Map the hardcoded data to the Accommodation interface
    return viennaHotels.map(hotel => {
      const images = getHotelImageByType(hotel.type as 'hotel' | 'hostel' | 'apartment' | 'guesthouse', hotel.stars);
      const bookingUrl = `https://www.booking.com/hotel/${hotel.id}.html?aid=${BOOKING_AFFILIATE_ID}`;
      
      return {
        id: hotel.id,
        name: hotel.name,
        type: hotel.type as 'hotel' | 'hostel' | 'apartment' | 'guesthouse',
        stars: hotel.stars,
        address: hotel.address,
        latitude: hotel.latitude,
        longitude: hotel.longitude,
        price: hotel.price,
        images: [images],
        rating: hotel.rating,
        reviewCount: hotel.reviewCount,
        amenities: hotel.amenities,
        url: bookingUrl
      };
    });
  } else {
    // For other cities, use the multi-city function
    return getMultiCityAccommodations(cityName);
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