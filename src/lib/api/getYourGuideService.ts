import axios from 'axios';

/**
 * Interface for GetYourGuide Activity
 */
export interface GetYourGuideActivity {
  id: string;
  title: string;
  description: string;
  url: string;
  image: string;
  price: {
    amount: number;
    currency: string;
  };
  rating: number;
  reviewCount: number;
  duration: string;
  categories: string[];
}

/**
 * GetYourGuide API response type
 */
interface GetYourGuideApiResponse {
  activities?: Array<{
    id: string;
    title: string;
    abstract?: string;
    url: string;
    cover_image_url?: string;
    price: {
      amount: string;
      currency: string;
    };
    rating?: {
      average: number;
      count: number;
    };
    duration?: string;
    categories?: string[];
  }>;
}

/**
 * Fallback data for when the API fails
 */
const fallbackActivities: Record<string, GetYourGuideActivity[]> = {
  // Empty initially, will be populated with mock data when needed
};

/**
 * Cache to store API responses
 */
const cache: Record<string, { data: GetYourGuideActivity[]; timestamp: number }> = {};

/**
 * Cache TTL: 24 hours (in milliseconds)
 */
const CACHE_TTL = 24 * 60 * 60 * 1000;

/**
 * Get cached data if it exists and is not expired
 */
const getCachedData = (cacheKey: string) => {
  const cachedItem = cache[cacheKey];
  if (cachedItem && Date.now() - cachedItem.timestamp < CACHE_TTL) {
    return cachedItem.data;
  }
  return null;
};

/**
 * Save data to cache
 */
const saveToCache = (cacheKey: string, data: GetYourGuideActivity[]) => {
  cache[cacheKey] = {
    data,
    timestamp: Date.now(),
  };
};

/**
 * Local image paths for activities (using renamed photos from public folder)
 */
const localImagePaths = {
  eiffelTower: '/Photos/eiffel tower.jpg',       // Eiffel Tower
  museum: '/Photos/musseum.jpg',                 // Museum/Gallery 
  cityWalking: '/Photos/city walking tour.jpg',  // City walking tour
  riverCruise: '/Photos/river cruise.jpg',       // River cruise
  bikeTour: '/Photos/bike tour.jpg',             // Bike tour
  foodTasting: '/Photos/food tasting.jpg'        // Food tasting
};

/**
 * Get activities from GetYourGuide for a specific city
 */
export const getActivities = async (
  city: string,
  limit: number = 5,
  startDate?: string,
  endDate?: string
): Promise<GetYourGuideActivity[]> => {
  const cacheKey = `gyg_${city}_${limit}_${startDate || ''}_${endDate || ''}`;
  
  // Check cache first
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  
  try {
    // Partner API key would be used here with proper auth
    // For now, we'll use a partner widget-friendly approach
    // In production, use direct API access through partner.getyourguide.com
    
    const params: Record<string, any> = {
      number: limit,
      locale: 'en-US',
      currency: 'EUR',
      partner_id: process.env.NEXT_PUBLIC_GETYOURGUIDE_PARTNER_ID || 'QUGIHFI', // Default partner ID if not set
    };
    
    // Add date parameters if provided
    if (startDate) {
      params.date_from = startDate;
    }
    if (endDate) {
      params.date_to = endDate;
    }
    
    const response = await axios.get<GetYourGuideApiResponse>(
      `https://widget.getyourguide.com/v2/city/${encodeURIComponent(city)}`,
      { params }
    );
    
    if (response.data && Array.isArray(response.data.activities)) {
      const activities: GetYourGuideActivity[] = response.data.activities.map((item) => {
        // Format URL with partner ID and dates if available
        let url = item.url;
        // Add partner ID
        url += url.includes('?') ? '&' : '?';
        url += `partner_id=${process.env.NEXT_PUBLIC_GETYOURGUIDE_PARTNER_ID || 'QUGIHFI'}`;
        
        // Add dates if provided
        if (startDate) {
          const formattedStartDate = formatDateForGetYourGuide(startDate);
          url += `&date=${formattedStartDate}&date_from=${formattedStartDate}`;
          
          // If endDate is provided, add it as date_to
          if (endDate) {
            const formattedEndDate = formatDateForGetYourGuide(endDate);
            url += `&date_to=${formattedEndDate}`;
          } else {
            // If no endDate, use startDate as both from and to
            url += `&date_to=${formattedStartDate}`;
          }
        }
        
        return {
          id: item.id,
          title: item.title,
          description: item.abstract || item.title,
          url: url,
          image: item.cover_image_url || '',
          price: {
            amount: parseFloat(item.price.amount),
            currency: item.price.currency,
          },
          rating: item.rating?.average || 0,
          reviewCount: item.rating?.count || 0,
          duration: item.duration || 'Varies',
          categories: item.categories || [],
        };
      });
      
      // Save to cache
      saveToCache(cacheKey, activities);
      return activities;
    }
    
    return getFallbackActivities(city, limit, startDate, endDate);
  } catch (error) {
    console.error('Error fetching GetYourGuide activities:', error);
    return getFallbackActivities(city, limit, startDate, endDate);
  }
};

/**
 * Format a date string to YYYY-MM-DD format for GetYourGuide URLs
 */
const formatDateForGetYourGuide = (dateString: string): string => {
  try {
    // Check if the date string is valid
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date string: ${dateString}, using today's date as fallback`);
      // Use current date as fallback
      const today = new Date();
      return today.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    }
    
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  } catch (error) {
    console.warn(`Error formatting date: ${dateString}, using today's date as fallback`, error);
    // Use current date as fallback
    const today = new Date();
    return today.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  }
};

/**
 * Get fallback activities if API call fails
 */
const getFallbackActivities = (
  city: string, 
  limit: number, 
  startDate?: string, 
  endDate?: string
): GetYourGuideActivity[] => {
  // Return cached fallback if available
  const cacheKey = `fallback_${city}_${limit}_${startDate || ''}_${endDate || ''}`;
  if (fallbackActivities[cacheKey]) {
    return fallbackActivities[cacheKey].slice(0, limit);
  }
  
  // Generate mock data based on city
  const activities: GetYourGuideActivity[] = [];
  
  // City-specific activities with local image paths
  const cityActivities: Record<string, any[]> = {
    'Paris': [
      {
        id: 'paris-eiffel-tower',
        name: 'Eiffel Tower: Skip-the-Line Guided Tour',
        price: 49.99,
        rating: 4.7,
        categories: ['Skip-the-Line Tours', 'Landmarks'],
        searchTerm: 'eiffel-tower-tour',
        image: localImagePaths.eiffelTower
      },
      {
        id: 'paris-louvre',
        name: 'Louvre Museum: Timed Entrance Ticket',
        price: 29.99,
        rating: 4.5,
        categories: ['Museums', 'Skip-the-Line Tours'],
        searchTerm: 'louvre-museum-ticket',
        image: localImagePaths.museum
      },
    ],
    'Rome': [
      {
        id: 'rome-colosseum',
        name: 'Colosseum & Roman Forum: Skip-the-Line Guided Tour',
        price: 54.99,
        rating: 4.8,
        categories: ['Historical Sites', 'Skip-the-Line Tours'],
        searchTerm: 'colosseum-tour',
        image: localImagePaths.cityWalking
      },
      {
        id: 'rome-vatican',
        name: 'Vatican Museums & Sistine Chapel: Skip-the-Line Ticket',
        price: 39.99,
        rating: 4.6,
        categories: ['Museums', 'Religious Sites'],
        searchTerm: 'vatican-museums-ticket',
        image: localImagePaths.museum
      },
    ],
    'Amsterdam': [
      {
        id: 'amsterdam-canal',
        name: 'Amsterdam: Canal Cruise with Audio Guide',
        price: 19.99,
        rating: 4.6,
        categories: ['Cruises', 'Sightseeing Tours'],
        searchTerm: 'canal-cruise',
        image: localImagePaths.riverCruise
      },
      {
        id: 'amsterdam-bike',
        name: 'Amsterdam: City Bike Tour with Local Guide',
        price: 29.99,
        rating: 4.7,
        categories: ['Bike Tours', 'City Tours'],
        searchTerm: 'amsterdam-bike-tour',
        image: localImagePaths.bikeTour
      }
    ],
    'Barcelona': [
      {
        id: 'barcelona-sagrada',
        name: 'Sagrada Familia: Fast-Track Guided Tour',
        price: 49.99,
        rating: 4.8,
        categories: ['Architecture', 'Skip-the-Line Tours'],
        searchTerm: 'sagrada-familia',
        image: localImagePaths.cityWalking
      },
      {
        id: 'barcelona-park',
        name: 'Park Güell: Guided Tour & Skip-the-Line Ticket',
        price: 29.99,
        rating: 4.5,
        categories: ['Parks', 'Skip-the-Line Tours'],
        searchTerm: 'park-guell',
        image: localImagePaths.cityWalking
      }
    ]
  };
  
  // Normalize city name for the activities lookup
  const normalizedCity = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
  
  // Add images to common activities
  const commonActivities = [
    {
      id: 'common-walking-tour',
      name: 'City Walking Tour',
      description: 'Explore the highlights of the city with a knowledgeable local guide',
      duration: '2 hours',
      price: { amount: 15, currency: 'EUR' },
      rating: 4.5,
      categories: ['Walking Tours', 'City Tours'],
      searchTerm: 'walking-tour',
      image: localImagePaths.cityWalking
    },
    {
      id: 'common-food-tasting',
      name: 'Food Tasting Experience',
      description: 'Sample local cuisine and learn about the city\'s culinary traditions',
      duration: '3 hours',
      price: { amount: 45, currency: 'EUR' },
      rating: 4.6,
      categories: ['Food & Drinks', 'Cultural Tours'],
      searchTerm: 'food-tour',
      image: localImagePaths.foodTasting
    },
    {
      id: 'common-museum-pass',
      name: 'Skip-the-Line Museum Pass',
      description: 'Enjoy priority access to top museums and attractions',
      duration: 'Valid for 24 hours',
      price: { amount: 30, currency: 'EUR' },
      rating: 4.4,
      categories: ['Museums', 'Skip-the-Line Tours'],
      searchTerm: 'museum-pass',
      image: localImagePaths.museum
    },
    {
      id: 'common-bike-tour',
      name: 'Bike Tour',
      description: 'See more of the city on this guided bike tour of main attractions',
      duration: '3 hours',
      price: { amount: 28, currency: 'EUR' },
      rating: 4.7,
      categories: ['Bike Tours', 'Outdoor Activities'],
      searchTerm: 'bike-tour',
      image: localImagePaths.bikeTour
    },
    {
      id: 'common-river-cruise',
      name: 'Evening River Cruise',
      description: 'Enjoy the city lights from the water with this scenic evening cruise',
      duration: '1 hour',
      price: { amount: 25, currency: 'EUR' },
      rating: 4.5,
      categories: ['Cruises', 'Evening Tours'],
      searchTerm: 'river-cruise',
      image: localImagePaths.riverCruise
    },
  ];
  
  // Combine common activities with city-specific ones
  const activityPool = [
    ...(cityActivities[normalizedCity] || []),
    ...commonActivities,
  ];
  
  // Partner ID for all links
  const partnerId = process.env.NEXT_PUBLIC_GETYOURGUIDE_PARTNER_ID || 'QUGIHFI';
  
  // Generate unique IDs and populate missing fields
  for (let i = 0; i < Math.min(limit, activityPool.length); i++) {
    const activity = activityPool[i];
    
    // Build search URL with dates
    let url = `https://www.getyourguide.com/s/?q=${encodeURIComponent(activity.searchTerm || activity.name)}&partner_id=${partnerId}`;
    
    // Add date parameter if startDate is provided
    if (startDate) {
      const formattedDate = formatDateForGetYourGuide(startDate);
      url += `&date=${formattedDate}&date_from=${formattedDate}`;
      
      // If endDate is provided, add it as date_to
      if (endDate) {
        const formattedEndDate = formatDateForGetYourGuide(endDate);
        url += `&date_to=${formattedEndDate}`;
      } else {
        // If no endDate, use startDate as both from and to
        url += `&date_to=${formattedDate}`;
      }
    }
    
    activities.push({
      id: `mock-${city}-${i}`,
      title: activity.name,
      description: activity.description,
      url: url,
      image: activity.image || `https://via.placeholder.com/400x225?text=${encodeURIComponent(activity.name)}`,
      price: activity.price,
      rating: activity.rating || (4.6 - (Math.random() * 0.5)),
      reviewCount: Math.floor(50 + Math.random() * 450),
      duration: activity.duration,
      categories: activity.categories,
    });
  }
  
  // Cache these fallback activities
  fallbackActivities[cacheKey] = activities;
  
  return activities;
};

/**
 * Generate a GetYourGuide widget HTML
 * This is an alternative to using the API directly
 */
export const getActivityWidgetHtml = (
  city: string, 
  limit: number = 5, 
  startDate?: string,
  endDate?: string
): string => {
  // Build widget parameters
  const widgetParams: Record<string, string> = {
    'data-gyg-href': 'https://widget.getyourguide.com/default/city.frame',
    'data-gyg-location-id': city,
    'data-gyg-currency': 'EUR',
    'data-gyg-locale': 'en-US',
    'data-gyg-partner-id': process.env.NEXT_PUBLIC_GETYOURGUIDE_PARTNER_ID || 'QUGIHFI',
    'data-gyg-q': 'activities',
    'data-gyg-number': limit.toString(),
    'data-gyg-cmp': 'activities-widget',
    'data-gyg-layout': 'grid'
  };
  
  // Add date parameter if provided
  if (startDate) {
    const formattedDate = formatDateForGetYourGuide(startDate);
    widgetParams['data-gyg-date'] = formattedDate;
    widgetParams['data-gyg-date-from'] = formattedDate;
    
    // If endDate is provided, add it as date_to
    if (endDate) {
      widgetParams['data-gyg-date-to'] = formatDateForGetYourGuide(endDate);
    } else {
      // If no endDate, use startDate as date_to
      widgetParams['data-gyg-date-to'] = formattedDate;
    }
  }
  
  // Generate HTML attributes string
  const attributesStr = Object.entries(widgetParams)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');
  
  return `
    <div id="gyg-widget-${city}" ${attributesStr}></div>
    <script>
      (function() {
        var gygscript = document.createElement('script');
        gygscript.type = 'text/javascript';
        gygscript.async = true;
        gygscript.src = 'https://widget.getyourguide.com/dist/js/widget.js';
        var nearest = document.getElementsByTagName('script')[0];
        nearest.parentNode.insertBefore(gygscript, nearest);
      })();
    </script>
  `;
}; 