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
    // For now, we'll focus on Vienna to match the screenshot
    const requestBody = {
      city: params.cityName,
      arrival_date: checkIn,
      departure_date: checkOut,
      room_qty: params.rooms || 1,
      guest_qty: params.adults,
      affiliate_id: BOOKING_AFFILIATE_ID,
      api_key: BOOKING_API_KEY
    };
    
    // Use Vienna accommodation data for now since we don't have real API access
    return getViennaAccommodations(params.cityName);
  } catch (error) {
    console.error('Error fetching from Booking.com API:', error);
    return [];
  }
}

/**
 * Get hardcoded Vienna accommodation data to match the screenshot
 * In a real implementation, this would be replaced with actual API data
 */
function getViennaAccommodations(cityName: string): Accommodation[] {
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