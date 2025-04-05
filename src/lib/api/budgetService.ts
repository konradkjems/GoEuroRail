import { getCachedData, setCachedData } from '../cache';

// Cache settings (7 days by default for cost data as it changes slowly)
const CACHE_TTL = 7 * 24 * 60 * 60; // 7 days

/**
 * Budget categories
 */
export enum BudgetCategory {
  BUDGET = 'budget',
  MODERATE = 'moderate',
  LUXURY = 'luxury'
}

/**
 * Cost indices structure
 */
export interface CostIndices {
  city: string;
  country: string;
  currency: string;
  costOfLivingIndex: number;  // Base index
  mealCost: {
    inexpensiveRestaurant: number;
    midRangeRestaurant: number;  // Per person
    fastFood: number;
  };
  transportCost: {
    oneWayTicket: number;
    dayPass: number;
    taxi: number;  // Per km
  };
  accommodationCost: {
    hostelDorm: number;
    budgetHotel: number;
    midRangeHotel: number;
    luxuryHotel: number;
  };
  attractionCost: {
    museum: number;
    landmark: number;
    tourGuide: number;
  };
}

/**
 * Trip budget data structure
 */
export interface TripBudget {
  cityName: string;
  country: string;
  currency: string;
  exchangeRate: number;  // 1 EUR = X local currency
  duration: number;  // days
  costs: {
    accommodation: {
      [BudgetCategory.BUDGET]: number;
      [BudgetCategory.MODERATE]: number;
      [BudgetCategory.LUXURY]: number;
    };
    food: {
      [BudgetCategory.BUDGET]: number;
      [BudgetCategory.MODERATE]: number;
      [BudgetCategory.LUXURY]: number;
    };
    localTransport: {
      [BudgetCategory.BUDGET]: number;
      [BudgetCategory.MODERATE]: number;
      [BudgetCategory.LUXURY]: number;
    };
    attractions: {
      [BudgetCategory.BUDGET]: number;
      [BudgetCategory.MODERATE]: number;
      [BudgetCategory.LUXURY]: number;
    };
  };
  totals: {
    [BudgetCategory.BUDGET]: number;
    [BudgetCategory.MODERATE]: number;
    [BudgetCategory.LUXURY]: number;
    perDay: {
      [BudgetCategory.BUDGET]: number;
      [BudgetCategory.MODERATE]: number;
      [BudgetCategory.LUXURY]: number;
    };
  };
  breakdown: {
    accommodation: number;
    food: number;
    localTransport: number;
    attractions: number;
  };
}

/**
 * Budget parameters
 */
export interface BudgetParams {
  cityName: string;
  country?: string;
  days: number;
  travelers: number;
  preferredCategory?: BudgetCategory;
}

/**
 * Cost of living database structure
 */
interface CostOfLivingData {
  countries: Map<string, {
    id: number;
    name: string;
    isoCode: string; 
    currency: string;
  }>;
  costs: Map<number, Map<string, number>>;
  examples: Map<number, Map<string, {
    item: string;
    price: number;
  }>>;
}

// Global variable to store parsed CSV data
let costOfLivingDatabase: CostOfLivingData | null = null;

/**
 * Initialize the cost of living database from CSV data
 */
async function initCostOfLivingDatabase(): Promise<CostOfLivingData> {
  if (costOfLivingDatabase) {
    return costOfLivingDatabase;
  }

  try {
    // Attempt to fetch the CSV data - try multiple paths
    let response;
    let csvText = '';
    
    try {
      // Try fetching from public folder first
      response = await fetch('/data/cost_of_living.csv');
      if (!response.ok) throw new Error(`Failed to fetch from /data/: ${response.status}`);
      csvText = await response.text();
    } catch (fetchError) {
      console.warn('Failed to fetch from /data/, trying alternate path:', fetchError);
      
      try {
        // Try alternate path
        response = await fetch('/cost_of_living.csv');
        if (!response.ok) throw new Error(`Failed to fetch from root: ${response.status}`);
        csvText = await response.text();
      } catch (altFetchError) {
        console.warn('Failed to fetch from root path, trying relative path:', altFetchError);
        
        try {
          // Try relative path
          response = await fetch('data/cost_of_living.csv');
          if (!response.ok) throw new Error(`Failed to fetch from relative path: ${response.status}`);
          csvText = await response.text();
        } catch (relFetchError) {
          console.error('All fetch attempts failed:', relFetchError);
          throw new Error('Could not load cost of living data from any path');
        }
      }
    }
    
    if (!csvText || csvText.trim().length === 0) {
      console.error('CSV data is empty');
      throw new Error('CSV data is empty');
    }
    
    console.log('Successfully loaded CSV data, length:', csvText.length);
    
    // Parse the CSV data
    const database: CostOfLivingData = {
      countries: new Map(),
      costs: new Map(),
      examples: new Map()
    };
    
    // Parse the CSV lines
    const lines = csvText.split('\n').filter(line => line.trim().length > 0);
    console.log(`Processing ${lines.length} lines from CSV`);
    
    if (lines.length < 3) {
      console.error('CSV has insufficient data:', lines);
      throw new Error('CSV has insufficient data');
    }
    
    // Skip header lines
    for (let i = 2; i < lines.length; i++) {
      const columns = lines[i].split(';');
      
      // Check which part of the CSV we're dealing with
      if (columns[0]) {  // Country data
        const countryId = parseInt(columns[0]);
        if (isNaN(countryId)) {
          console.warn(`Invalid country ID in line ${i+1}:`, columns[0]);
          continue;
        }
        
        database.countries.set(columns[1].toLowerCase(), {
          id: countryId,
          name: columns[1],
          isoCode: columns[2],
          currency: columns[3]
        });
        
        // Initialize cost and example maps for this country
        database.costs.set(countryId, new Map());
        database.examples.set(countryId, new Map());
      }
      
      if (columns[4] && columns[5]) {  // Cost data
        const costId = parseInt(columns[4]);
        const countryId = parseInt(columns[5]);
        
        if (isNaN(costId) || isNaN(countryId)) {
          console.warn(`Invalid cost or country ID in line ${i+1}:`, columns[4], columns[5]);
          continue;
        }
        
        const category = columns[6];
        const avgCost = parseFloat(columns[7]);
        
        if (!category || isNaN(avgCost)) {
          console.warn(`Invalid category or cost in line ${i+1}:`, category, columns[7]);
          continue;
        }
        
        // Get or initialize the cost map for this country
        let countryCosts = database.costs.get(countryId);
        if (!countryCosts) {
          countryCosts = new Map();
          database.costs.set(countryId, countryCosts);
        }
        
        // Store the average cost by category
        countryCosts.set(category, avgCost);
      }
      
      if (columns[8] && columns[9]) {  // Example data
        const exampleId = parseInt(columns[8]);
        const countryId = parseInt(columns[9]);
        
        if (isNaN(exampleId) || isNaN(countryId)) {
          console.warn(`Invalid example or country ID in line ${i+1}:`, columns[8], columns[9]);
          continue;
        }
        
        const itemName = columns[10];
        const price = parseFloat(columns[11]);
        const category = columns[12];
        
        if (!itemName || isNaN(price) || !category) {
          console.warn(`Invalid item, price, or category in line ${i+1}:`, itemName, columns[11], category);
          continue;
        }
        
        // Get or initialize the examples map for this country
        let countryExamples = database.examples.get(countryId);
        if (!countryExamples) {
          countryExamples = new Map();
          database.examples.set(countryId, countryExamples);
        }
        
        // Initialize category map if needed
        if (!countryExamples.has(category)) {
          countryExamples.set(category, { item: itemName, price: price });
        }
      }
    }
    
    costOfLivingDatabase = database;
    console.log('Cost of living database initialized with countries:', Array.from(database.countries.keys()));
    return database;
  } catch (error) {
    console.error('Error initializing cost of living database:', error);
    return {
      countries: new Map(),
      costs: new Map(),
      examples: new Map()
    };
  }
}

/**
 * Get cost indices from local database
 */
async function getCostIndicesFromDatabase(cityName: string): Promise<CostIndices | null> {
  // Initialize database if needed
  await initCostOfLivingDatabase();
  
  if (!costOfLivingDatabase || costOfLivingDatabase.countries.size === 0) {
    console.warn('Cost of living database is empty, using fallback data');
    return null;
  }
  
  // Extract country name from city (this is a simplification, in a real app we'd have a city-to-country mapping)
  let countryName: string | null = null;
  
  // Map common cities to their countries
  const cityToCountry: Record<string, string> = {
    'paris': 'france',
    'berlin': 'germany',
    'rome': 'italy',
    'madrid': 'spain',
    'amsterdam': 'netherlands',
    'brussels': 'belgium',
    'vienna': 'austria',
    'lisbon': 'portugal',
    'athens': 'greece',
    'warsaw': 'poland',
    'prague': 'czechia',
    'budapest': 'hungary',
    'stockholm': 'sweden',
    'copenhagen': 'denmark',
    'helsinki': 'finland',
    'dublin': 'ireland',
    'bucharest': 'romania',
    'sofia': 'bulgaria',
    'zagreb': 'croatia',
    'bratislava': 'slovakia',
    // Additional cities
    'milan': 'italy',
    'barcelona': 'spain',
    'munich': 'germany',
    'frankfurt': 'germany',
    'hamburg': 'germany',
    'marseille': 'france',
    'lyon': 'france',
    'venice': 'italy',
    'florence': 'italy',
    'naples': 'italy',
    'seville': 'spain',
    'porto': 'portugal',
    'antwerp': 'belgium',
    'krakow': 'poland',
    'gdansk': 'poland',
    'thessaloniki': 'greece'
  };
  
  countryName = cityToCountry[cityName.toLowerCase()];
  
  if (!countryName) {
    console.warn(`No country mapping found for city: ${cityName}`);
    // No match found, return null to fall back to other methods
    return null;
  }
  
  // Get the country data
  const country = costOfLivingDatabase.countries.get(countryName);
  if (!country) {
    console.warn(`Country data not found for: ${countryName}`);
    return null;
  }
  
  // Get cost data for the country
  const costs = costOfLivingDatabase.costs.get(country.id);
  if (!costs) {
    console.warn(`Cost data not found for country ID: ${country.id}`);
    return null;
  }
  
  // Get example data for the country
  const examples = costOfLivingDatabase.examples.get(country.id);
  if (!examples) {
    console.warn(`Example data not found for country ID: ${country.id}`);
    return null;
  }
  
  // Build cost indices from database
  const foodCost = costs.get('Food') || 250; // Default value if not found
  const accommodationCost = costs.get('Accommodation') || 700;
  const experiencesCost = costs.get('Experiences') || 150;
  
  // Calculate daily costs (monthly costs divided by 30)
  const dailyFoodCost = foodCost / 30;
  const dailyAccommodationCost = accommodationCost / 30;
  const dailyExperiencesCost = experiencesCost / 30;
  
  // Examples for specific costs
  const foodExample = examples.get('Food');
  const accommodationExample = examples.get('Accommodation');
  const experiencesExample = examples.get('Experiences');
  
  console.log(`Using cost data for ${cityName} (${countryName}):`, {
    foodCost,
    accommodationCost,
    experiencesCost,
    foodExample: foodExample?.item,
    accommodationExample: accommodationExample?.item,
    experiencesExample: experiencesExample?.item
  });
  
  // Build the cost indices
  const indices: CostIndices = {
    city: cityName,
    country: country.name,
    currency: country.currency,
    costOfLivingIndex: 100, // Base index
    mealCost: {
      inexpensiveRestaurant: foodExample?.price || dailyFoodCost / 3,
      midRangeRestaurant: (foodExample?.price || dailyFoodCost / 3) * 2.5,
      fastFood: (foodExample?.price || dailyFoodCost / 3) * 0.7
    },
    transportCost: {
      oneWayTicket: 2.5, // Standard estimates
      dayPass: 7.5,
      taxi: 1.2
    },
    accommodationCost: {
      hostelDorm: accommodationExample?.price || dailyAccommodationCost * 0.4,
      budgetHotel: accommodationExample?.price || dailyAccommodationCost * 0.7,
      midRangeHotel: (accommodationExample?.price || dailyAccommodationCost) * 1.5,
      luxuryHotel: (accommodationExample?.price || dailyAccommodationCost) * 3
    },
    attractionCost: {
      museum: experiencesExample?.price || dailyExperiencesCost * 0.3,
      landmark: experiencesExample?.price || dailyExperiencesCost * 0.4,
      tourGuide: experiencesExample?.price || dailyExperiencesCost
    }
  };
  
  return indices;
}

/**
 * Get budget estimate for a trip
 */
export async function getTripBudget(params: BudgetParams): Promise<TripBudget> {
  const cacheKey = `budget:${params.cityName}:${params.days}:${params.travelers}`;
  
  // Check if we have cached data
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    console.log(`Using cached budget data for ${params.cityName}`);
    return cachedData;
  }
  
  try {
    // Try to get cost indices from our database
    let costIndices = await getCostIndicesFromDatabase(params.cityName);
    
    // If not found in database, use fallback data
    if (!costIndices) {
      console.log(`No database data found for ${params.cityName}, using fallback data`);
      costIndices = getFallbackCostIndices(params.cityName);
    }
    
    // Calculate budget based on cost indices
    const budget = calculateBudget(costIndices, params);
    
    // Cache the data
    setCachedData(cacheKey, budget, CACHE_TTL);
    
    return budget;
  } catch (error) {
    console.error(`Error calculating budget for ${params.cityName}:`, error);
    // Fall back to estimated data
    return getFallbackBudget(params);
  }
}

/**
 * Calculate a comprehensive budget based on cost indices and trip parameters
 */
function calculateBudget(costs: CostIndices, params: BudgetParams): TripBudget {
  const { days, travelers } = params;
  
  // Adjust prices for number of travelers
  const accommodationPerNight = {
    [BudgetCategory.BUDGET]: costs.accommodationCost.hostelDorm * travelers,
    [BudgetCategory.MODERATE]: costs.accommodationCost.budgetHotel * (travelers > 1 ? 1.5 : 1),
    [BudgetCategory.LUXURY]: costs.accommodationCost.luxuryHotel * (travelers > 1 ? 1.5 : 1)
  };
  
  // Calculate food costs per person per day for each budget level
  const foodPerPersonPerDay = {
    [BudgetCategory.BUDGET]: costs.mealCost.fastFood * 2 + costs.mealCost.inexpensiveRestaurant,
    [BudgetCategory.MODERATE]: costs.mealCost.inexpensiveRestaurant * 2 + costs.mealCost.midRangeRestaurant,
    [BudgetCategory.LUXURY]: costs.mealCost.midRangeRestaurant * 3
  };
  
  // Calculate transport costs per person per day for each budget level
  const transportPerPersonPerDay = {
    [BudgetCategory.BUDGET]: costs.transportCost.oneWayTicket * 2,
    [BudgetCategory.MODERATE]: costs.transportCost.dayPass,
    [BudgetCategory.LUXURY]: costs.transportCost.taxi * 5
  };
  
  // Calculate attraction costs per person per day for each budget level
  const attractionsPerPersonPerDay = {
    [BudgetCategory.BUDGET]: costs.attractionCost.museum,
    [BudgetCategory.MODERATE]: costs.attractionCost.museum + costs.attractionCost.landmark,
    [BudgetCategory.LUXURY]: costs.attractionCost.museum + costs.attractionCost.landmark + costs.attractionCost.tourGuide
  };
  
  // Calculate total costs for each category
  const totalAccommodation = {
    [BudgetCategory.BUDGET]: accommodationPerNight[BudgetCategory.BUDGET] * days,
    [BudgetCategory.MODERATE]: accommodationPerNight[BudgetCategory.MODERATE] * days,
    [BudgetCategory.LUXURY]: accommodationPerNight[BudgetCategory.LUXURY] * days
  };
  
  const totalFood = {
    [BudgetCategory.BUDGET]: foodPerPersonPerDay[BudgetCategory.BUDGET] * days * travelers,
    [BudgetCategory.MODERATE]: foodPerPersonPerDay[BudgetCategory.MODERATE] * days * travelers,
    [BudgetCategory.LUXURY]: foodPerPersonPerDay[BudgetCategory.LUXURY] * days * travelers
  };
  
  const totalTransport = {
    [BudgetCategory.BUDGET]: transportPerPersonPerDay[BudgetCategory.BUDGET] * days * travelers,
    [BudgetCategory.MODERATE]: transportPerPersonPerDay[BudgetCategory.MODERATE] * days * travelers,
    [BudgetCategory.LUXURY]: transportPerPersonPerDay[BudgetCategory.LUXURY] * days * travelers
  };
  
  const totalAttractions = {
    [BudgetCategory.BUDGET]: attractionsPerPersonPerDay[BudgetCategory.BUDGET] * days * travelers,
    [BudgetCategory.MODERATE]: attractionsPerPersonPerDay[BudgetCategory.MODERATE] * days * travelers,
    [BudgetCategory.LUXURY]: attractionsPerPersonPerDay[BudgetCategory.LUXURY] * days * travelers
  };
  
  // Calculate grand totals
  const grandTotals = {
    [BudgetCategory.BUDGET]: totalAccommodation[BudgetCategory.BUDGET] + totalFood[BudgetCategory.BUDGET] + 
                             totalTransport[BudgetCategory.BUDGET] + totalAttractions[BudgetCategory.BUDGET],
    [BudgetCategory.MODERATE]: totalAccommodation[BudgetCategory.MODERATE] + totalFood[BudgetCategory.MODERATE] + 
                               totalTransport[BudgetCategory.MODERATE] + totalAttractions[BudgetCategory.MODERATE],
    [BudgetCategory.LUXURY]: totalAccommodation[BudgetCategory.LUXURY] + totalFood[BudgetCategory.LUXURY] + 
                             totalTransport[BudgetCategory.LUXURY] + totalAttractions[BudgetCategory.LUXURY]
  };
  
  // Per day costs
  const perDayCosts = {
    [BudgetCategory.BUDGET]: grandTotals[BudgetCategory.BUDGET] / days,
    [BudgetCategory.MODERATE]: grandTotals[BudgetCategory.MODERATE] / days,
    [BudgetCategory.LUXURY]: grandTotals[BudgetCategory.LUXURY] / days
  };
  
  // Determine the correct breakdown based on the preferred category
  const preferredCategory = params.preferredCategory || BudgetCategory.MODERATE;
  
  const breakdown = {
    accommodation: totalAccommodation[preferredCategory],
    food: totalFood[preferredCategory],
    localTransport: totalTransport[preferredCategory],
    attractions: totalAttractions[preferredCategory]
  };
  
  return {
    cityName: params.cityName,
    country: costs.country,
    currency: costs.currency,
    exchangeRate: 1.0, // Assuming EUR as default
    duration: days,
    costs: {
      accommodation: totalAccommodation,
      food: totalFood,
      localTransport: totalTransport,
      attractions: totalAttractions
    },
    totals: {
      [BudgetCategory.BUDGET]: grandTotals[BudgetCategory.BUDGET],
      [BudgetCategory.MODERATE]: grandTotals[BudgetCategory.MODERATE],
      [BudgetCategory.LUXURY]: grandTotals[BudgetCategory.LUXURY],
      perDay: perDayCosts
    },
    breakdown
  };
}

/**
 * Get fallback cost indices for a city
 */
function getFallbackCostIndices(cityName: string): CostIndices {
  // Classify cities into price tiers
  const highCostCities = ['paris', 'london', 'zurich', 'copenhagen', 'oslo', 'stockholm', 'helsinki', 'reykjavik', 'amsterdam', 'dublin'];
  const mediumCostCities = ['vienna', 'berlin', 'brussels', 'madrid', 'rome', 'barcelona', 'milan', 'munich', 'hamburg', 'frankfurt'];
  const lowCostCities = ['prague', 'budapest', 'warsaw', 'krakow', 'bucharest', 'sofia', 'belgrade', 'athens', 'istanbul', 'zagreb'];
  
  let costMultiplier = 1.0;
  const normalizedCityName = cityName.toLowerCase();
  
  if (highCostCities.includes(normalizedCityName)) {
    costMultiplier = 1.5;
  } else if (mediumCostCities.includes(normalizedCityName)) {
    costMultiplier = 1.0;
  } else if (lowCostCities.includes(normalizedCityName)) {
    costMultiplier = 0.7;
  }
  
  // Default cost indices with adjustment for city tier
  return {
    city: cityName,
    country: getCountryFromCity(cityName) || 'Unknown',
    currency: 'EUR',
    costOfLivingIndex: 100 * costMultiplier,
    mealCost: {
      inexpensiveRestaurant: 15 * costMultiplier,
      midRangeRestaurant: 30 * costMultiplier,
      fastFood: 8 * costMultiplier
    },
    transportCost: {
      oneWayTicket: 1.5 * costMultiplier,
      dayPass: 5 * costMultiplier,
      taxi: 1.5 * costMultiplier
    },
    accommodationCost: {
      hostelDorm: 25 * costMultiplier,
      budgetHotel: 60 * costMultiplier,
      midRangeHotel: 120 * costMultiplier,
      luxuryHotel: 250 * costMultiplier
    },
    attractionCost: {
      museum: 12 * costMultiplier,
      landmark: 15 * costMultiplier,
      tourGuide: 25 * costMultiplier
    }
  };
}

/**
 * Get country name from city
 */
function getCountryFromCity(cityName: string): string | null {
  const cityToCountry: Record<string, string> = {
    'paris': 'France',
    'berlin': 'Germany',
    'rome': 'Italy',
    'madrid': 'Spain',
    'amsterdam': 'Netherlands',
    'brussels': 'Belgium',
    'vienna': 'Austria',
    'lisbon': 'Portugal',
    'athens': 'Greece',
    'warsaw': 'Poland',
    'prague': 'Czechia',
    'budapest': 'Hungary',
    'stockholm': 'Sweden',
    'copenhagen': 'Denmark',
    'helsinki': 'Finland',
    'dublin': 'Ireland',
    'bucharest': 'Romania',
    'sofia': 'Bulgaria',
    'zagreb': 'Croatia',
    'bratislava': 'Slovakia',
    // Additional cities
    'milan': 'Italy',
    'barcelona': 'Spain',
    'munich': 'Germany',
    'frankfurt': 'Germany',
    'hamburg': 'Germany',
    'marseille': 'France',
    'lyon': 'France',
    'venice': 'Italy',
    'florence': 'Italy',
    'naples': 'Italy',
    'seville': 'Spain',
    'porto': 'Portugal',
    'antwerp': 'Belgium',
    'krakow': 'Poland',
    'gdansk': 'Poland',
    'thessaloniki': 'Greece'
  };
  
  return cityToCountry[cityName.toLowerCase()] || null;
}

/**
 * Get fallback budget for trip
 */
function getFallbackBudget(params: BudgetParams): TripBudget {
  const costs = getFallbackCostIndices(params.cityName);
  return calculateBudget(costs, params);
} 