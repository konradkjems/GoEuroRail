/**
 * Collection of hotel images for Vienna to use as fallbacks
 * Base64 images compressed as basic placeholders but would be real URLs in production
 */

interface HotelImageMap {
  [hotelName: string]: string[];
}

// Base64 placeholders for hotel images with different colors for each hotel
const HOTEL_PLACEHOLDERS = {
  jaz: '/hotel-placeholder.jpg',
  xuba: '/hotel-placeholder.jpg',
  florum: '/hotel-placeholder.jpg',
  holiday: '/hotel-placeholder.jpg',
  superbude: '/hotel-placeholder.jpg',
  hoxton: '/hotel-placeholder.jpg',
  default: '/hotel-placeholder.jpg'
};

export const viennaHotelImages: HotelImageMap = {
  // Map of hotel names (lowercase) to image URLs
  "jaz in the city vienna": [
    HOTEL_PLACEHOLDERS.jaz
  ],
  "xuba apartmentrooms messe wien prater": [
    HOTEL_PLACEHOLDERS.xuba
  ],
  "florum hotel": [
    HOTEL_PLACEHOLDERS.florum
  ],
  "holiday inn": [
    HOTEL_PLACEHOLDERS.holiday
  ],
  "superbude wien prater": [
    HOTEL_PLACEHOLDERS.superbude
  ],
  "the hoxton vienna": [
    HOTEL_PLACEHOLDERS.hoxton
  ],
  // Fallback for any other hotel
  "default": [
    HOTEL_PLACEHOLDERS.default
  ]
};

/**
 * Get images for a hotel by name, using fuzzy matching
 * @param hotelName The name of the hotel
 * @returns Array of image URLs
 */
export function getHotelImages(hotelName: string): string[] {
  if (!hotelName) return viennaHotelImages.default;
  
  const normalizedName = hotelName.toLowerCase();
  
  // Try exact match first
  if (viennaHotelImages[normalizedName]) {
    return viennaHotelImages[normalizedName];
  }
  
  // Try fuzzy match
  for (const [key, images] of Object.entries(viennaHotelImages)) {
    if (key !== 'default' && (normalizedName.includes(key) || key.includes(normalizedName))) {
      return images;
    }
  }
  
  // Return default if no match
  return viennaHotelImages.default;
} 