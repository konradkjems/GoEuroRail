import React, { useState } from 'react';
import { FormTrip, FormTripStop } from '@/types';
import { cities } from '@/lib/cities';
import {
  TicketIcon,
  MapIcon,
  CalendarIcon,
  CurrencyEuroIcon,
  CheckCircleIcon,
  GlobeEuropeAfricaIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

// Interrail/Eurail Pass pricing
const RAIL_PASSES = {
  'Global Pass': {
    '5 days in 1 month': { youth: 251, adult: 335, senior: 301 },
    '7 days in 1 month': { youth: 289, adult: 385, senior: 347 },
    '10 days in 2 months': { youth: 333, adult: 444, senior: 400 },
    '15 days in 2 months': { youth: 389, adult: 519, senior: 467 },
    '15 consecutive days': { youth: 342, adult: 456, senior: 410 },
    '22 consecutive days': { youth: 389, adult: 518, senior: 466 },
    '1 month continuous': { youth: 480, adult: 640, senior: 576 },
    '2 months continuous': { youth: 621, adult: 828, senior: 745 },
    '3 months continuous': { youth: 763, adult: 1017, senior: 915 }
  }
};

// Budget ranges by region for calculating single ticket costs
const TRAIN_COSTS = {
  'Western Europe': { local: 15, express: 40, international: 80 },
  'Eastern Europe': { local: 8, express: 20, international: 40 },
  'Southern Europe': { local: 10, express: 30, international: 60 },
  'Northern Europe': { local: 20, express: 50, international: 100 }
};

interface RailPassFinderModuleProps {
  trip: FormTrip;
}

export default function RailPassFinderModule({ trip }: RailPassFinderModuleProps) {
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

  // Calculate train pass recommendations
  const calculateTrainPass = () => {
    if (!trip || !trip.stops || trip.stops.length < 2) return null;
    
    // Count number of travel days (connections between cities)
    // Only count journeys where useInterrailPass is true and handle stopovers correctly
    const travelDays = trip.stops.reduce((count: number, stop: FormTripStop, index: number, array: FormTripStop[]) => {
      if (index === 0) return count; // Skip first stop
      
      const prevStop = array[index - 1];
      
      // If current stop is a stopover, don't count it as a travel day
      // If previous stop was a stopover, don't count this as a new travel day
      // This ensures the journey through a stopover only counts as one travel day
      if (stop.isStopover || prevStop.isStopover) {
        return count;
      }
      
      // Only count as a travel day if useInterrailPass is true or undefined (default to true)
      if (stop.useInterrailPass !== false) {
        return count + 1;
      }
      
      return count;
    }, 0 as number);
    
    // Count number of countries visited
    const countries = new Set<string>();
    trip.stops.forEach(stop => {
      const city = cities.find(c => c.id === stop.cityId);
      if (city) {
        countries.add(city.country);
      }
    });
    
    // Figure out total trip duration in days
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    const tripDuration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Determine age category (using adult as default)
    const ageCategory = getAgeCategory();
    
    // Calculate individual ticket costs (rough estimation)
    const individualTicketCost = estimateIndividualTicketCost();
    
    // Find suitable pass options
    const suitablePasses: Array<{
      name: string;
      price: number;
      savings: number;
      recommended: boolean;
      bestValue?: boolean;
    }> = [];
    
    // For 5 or more travel days, consider a Global Pass
    if (travelDays >= 3) {
      // 5 days in 1 month
      if (travelDays <= 5 && tripDuration <= 30) {
        suitablePasses.push({
          name: 'Global Pass - 5 days in 1 month',
          price: RAIL_PASSES['Global Pass']['5 days in 1 month'][ageCategory],
          savings: individualTicketCost - RAIL_PASSES['Global Pass']['5 days in 1 month'][ageCategory],
          recommended: travelDays >= 4
        });
      }
      
      // 7 days in 1 month
      if (travelDays <= 7 && tripDuration <= 30) {
        suitablePasses.push({
          name: 'Global Pass - 7 days in 1 month',
          price: RAIL_PASSES['Global Pass']['7 days in 1 month'][ageCategory],
          savings: individualTicketCost - RAIL_PASSES['Global Pass']['7 days in 1 month'][ageCategory],
          recommended: travelDays > 5
        });
      }
      
      // 10 days in 2 months
      if (travelDays <= 10 && tripDuration <= 60) {
        suitablePasses.push({
          name: 'Global Pass - 10 days in 2 months',
          price: RAIL_PASSES['Global Pass']['10 days in 2 months'][ageCategory],
          savings: individualTicketCost - RAIL_PASSES['Global Pass']['10 days in 2 months'][ageCategory],
          recommended: travelDays > 7
        });
      }
      
      // Continuous passes for intensive travel
      if (tripDuration <= 15 && travelDays > 7) {
        suitablePasses.push({
          name: 'Global Pass - 15 consecutive days',
          price: RAIL_PASSES['Global Pass']['15 consecutive days'][ageCategory],
          savings: individualTicketCost - RAIL_PASSES['Global Pass']['15 consecutive days'][ageCategory],
          recommended: tripDuration > 10 && travelDays > tripDuration / 2
        });
      }
      
      if (tripDuration <= 30 && travelDays > 10) {
        suitablePasses.push({
          name: 'Global Pass - 1 month continuous',
          price: RAIL_PASSES['Global Pass']['1 month continuous'][ageCategory],
          savings: individualTicketCost - RAIL_PASSES['Global Pass']['1 month continuous'][ageCategory],
          recommended: tripDuration > 20 && travelDays > tripDuration / 2
        });
      }
    }
    
    // Sort by savings (best value first)
    suitablePasses.sort((a, b) => b.savings - a.savings);
    
    // Mark the best value option
    if (suitablePasses.length > 0) {
      suitablePasses[0].bestValue = true;
    }
    
    return {
      travelDays,
      countriesCount: countries.size,
      countriesList: Array.from(countries),
      tripDuration,
      individualTicketCost,
      suitablePasses,
      ageCategory
    };
  };

  // Get age category based on basic rules (could be enhanced with actual age selection UI)
  const getAgeCategory = (): 'youth' | 'adult' | 'senior' => {
    // You could add logic here to determine age category based on user info
    // For now, we'll default to adult
    return 'adult';
  };

  // Estimate the cost of buying individual tickets
  const estimateIndividualTicketCost = (): number => {
    if (!trip || !trip.stops || trip.stops.length < 2) return 0;
    
    let totalCost = 0;
    const regions = new Set<string>();
    
    // Identify all regions in the trip
    trip.stops.forEach(stop => {
      const city = cities.find(c => c.id === stop.cityId);
      if (city) {
        const region = getRegionFromCountry(city.country);
        regions.add(region);
      }
    });
    
    // Calculate average costs across regions
    const costsByType = {
      local: 0,
      express: 0,
      international: 0
    };
    
    regions.forEach(region => {
      const regionCosts = TRAIN_COSTS[region as keyof typeof TRAIN_COSTS] || TRAIN_COSTS['Western Europe'];
      costsByType.local += regionCosts.local;
      costsByType.express += regionCosts.express;
      costsByType.international += regionCosts.international;
    });
    
    // Average the costs across regions
    const regionsCount = Math.max(1, regions.size);
    const avgLocalCost = costsByType.local / regionsCount;
    const avgExpressCost = costsByType.express / regionsCount;
    const avgInternationalCost = costsByType.international / regionsCount;
    
    // Count the number of each type of journey
    let localJourneys = 0;
    let expressJourneys = 0;
    let internationalJourneys = 0;
    
    for (let i = 1; i < trip.stops.length; i++) {
      const prevStop = trip.stops[i - 1];
      const currentStop = trip.stops[i];
      
      // Skip if either stop is a stopover
      if (prevStop.isStopover || currentStop.isStopover) continue;
      
      const prevCity = cities.find(c => c.id === prevStop.cityId);
      const currentCity = cities.find(c => c.id === currentStop.cityId);
      
      if (!prevCity || !currentCity) continue;
      
      // Skip if useInterrailPass is explicitly set to false
      if (currentStop.useInterrailPass === false) continue;
      
      // International journey
      if (prevCity.country !== currentCity.country) {
        internationalJourneys++;
      } 
      // Express journey for major cities
      else if (isMajorCity(prevCity.name) && isMajorCity(currentCity.name)) {
        expressJourneys++;
      } 
      // Local journey
      else {
        localJourneys++;
      }
    }
    
    // Calculate total cost
    totalCost = (localJourneys * avgLocalCost) + 
                (expressJourneys * avgExpressCost) + 
                (internationalJourneys * avgInternationalCost);
    
    // Add a slight premium for convenience of booking in advance
    return Math.round(totalCost * 1.1);
  };

  // Helper to get region from country
  const getRegionFromCountry = (country: string): string => {
    const westernEurope = ['France', 'Germany', 'Netherlands', 'Belgium', 'Austria', 'Switzerland', 'Luxembourg'];
    const easternEurope = ['Poland', 'Czech Republic', 'Hungary', 'Slovakia', 'Romania', 'Bulgaria', 'Croatia', 'Slovenia'];
    const southernEurope = ['Italy', 'Spain', 'Portugal', 'Greece', 'Malta', 'Cyprus'];
    const northernEurope = ['Sweden', 'Norway', 'Finland', 'Denmark', 'Iceland', 'Estonia', 'Latvia', 'Lithuania'];
    
    if (westernEurope.includes(country)) return 'Western Europe';
    if (easternEurope.includes(country)) return 'Eastern Europe';
    if (southernEurope.includes(country)) return 'Southern Europe';
    if (northernEurope.includes(country)) return 'Northern Europe';
    
    // Default to Western Europe if unknown
    return 'Western Europe';
  };

  // Helper to determine if a city is a major city (for express train estimation)
  const isMajorCity = (cityName: string): boolean => {
    const majorCities = [
      'Paris', 'Berlin', 'Amsterdam', 'Brussels', 'Rome', 'Madrid', 'Barcelona', 
      'London', 'Munich', 'Vienna', 'Milan', 'Frankfurt', 'Copenhagen', 'Zurich',
      'Prague', 'Budapest', 'Warsaw', 'Lisbon', 'Stockholm', 'Oslo', 'Helsinki'
    ];
    
    return majorCities.includes(cityName);
  };

  const trainPassInfo = calculateTrainPass();

  if (!trainPassInfo) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          <div 
            className="px-4 py-3 bg-gray-50 border-b flex justify-between items-center cursor-pointer"
            onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
          >
            <div className="flex items-center gap-2">
              <TicketIcon className="h-5 w-5 text-gray-600" />
              <h3 className="text-md font-medium text-gray-700">Rail Pass Finder</h3>
            </div>
            {isPanelCollapsed ? (
              <ChevronDownIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronUpIcon className="h-5 w-5 text-gray-500" />
            )}
          </div>
          
          {!isPanelCollapsed && (
            <div className="p-6 text-center">
              <TicketIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600">Add more destinations to your trip to see rail pass recommendations.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Collapsible Panel */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div 
          className="px-4 py-3 bg-gray-50 border-b flex justify-between items-center cursor-pointer"
          onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
        >
          <div className="flex items-center gap-2">
            <TicketIcon className="h-5 w-5 text-gray-600" />
            <h3 className="text-md font-medium text-gray-700">Rail Pass Finder</h3>
          </div>
          {isPanelCollapsed ? (
            <ChevronDownIcon className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronUpIcon className="h-5 w-5 text-gray-500" />
          )}
        </div>
        
        {!isPanelCollapsed && (
          <div>
            {/* Trip rail summary */}
            <div className="p-4 border-b">
              <h3 className="text-md font-medium text-gray-800 mb-3">Trip Rail Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <TicketIcon className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <div className="text-sm text-blue-700">Rail Travel Days</div>
                    <div className="text-xl font-semibold text-blue-900">{trainPassInfo.travelDays}</div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <GlobeEuropeAfricaIcon className="h-6 w-6 text-green-700" />
                  </div>
                  <div>
                    <div className="text-sm text-green-700">Countries Visited</div>
                    <div className="text-xl font-semibold text-green-900">{trainPassInfo.countriesCount}</div>
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4 flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <CalendarIcon className="h-6 w-6 text-purple-700" />
                  </div>
                  <div>
                    <div className="text-sm text-purple-700">Trip Duration</div>
                    <div className="text-xl font-semibold text-purple-900">{trainPassInfo.tripDuration} days</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 text-gray-700">
                  <MapIcon className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">Countries: </span>
                  <span className="text-gray-700">{trainPassInfo.countriesList.join(', ')}</span>
                </div>
              </div>
            </div>
            
            {/* Pass Recommendations */}
            <div className="p-4">
              <h3 className="text-md font-medium text-gray-800 mb-3">Rail Pass Recommendations</h3>
              
              {/* Individual tickets cost */}
              <div className="bg-gray-50 p-3 rounded-lg mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CurrencyEuroIcon className="h-5 w-5 text-gray-600" />
                  <span className="text-gray-700">Estimated cost of individual tickets:</span>
                </div>
                <span className="font-semibold text-gray-800">€{trainPassInfo.individualTicketCost}</span>
              </div>
              
              {/* Pass recommendations */}
              {trainPassInfo.suitablePasses.length > 0 ? (
                <div className="space-y-3">
                  {trainPassInfo.suitablePasses.map((pass, index) => (
                    <div 
                      key={index} 
                      className={`border rounded-lg p-4 ${
                        pass.bestValue 
                          ? 'border-green-300 bg-green-50' 
                          : pass.recommended 
                            ? 'border-blue-300 bg-blue-50' 
                            : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-800">{pass.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {pass.bestValue && 'Best value option. '}
                            {pass.recommended && 'Recommended based on your itinerary.'}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-800">€{pass.price}</div>
                          <div className={`text-sm mt-1 ${pass.savings > 0 ? 'text-green-700' : 'text-red-700'}`}>
                            {pass.savings > 0 ? 'Savings: €' + pass.savings : 'Costs €' + Math.abs(pass.savings) + ' more'}
                          </div>
                        </div>
                      </div>
                      
                      {pass.bestValue && (
                        <div className="mt-3 flex items-center text-green-700 text-sm">
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          Best value for your trip
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 text-gray-600">
                  <p>Based on your itinerary, individual tickets might be more economical than a rail pass.</p>
                </div>
              )}
              
              {/* Pass advice */}
              <div className="mt-5 bg-blue-50 border border-blue-200 rounded-md p-3">
                <div className="flex items-start space-x-2">
                  <div className="bg-blue-200 p-1 rounded-full">
                    <TicketIcon className="h-4 w-4 text-blue-700" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800">Rail Pass Tips</h4>
                    <ul className="mt-1 text-sm text-blue-700 space-y-1 list-disc ml-4">
                      <li>Some high-speed and overnight trains require seat reservations for an additional fee</li>
                      <li>Youth passes (under 28) offer significant discounts</li>
                      <li>Buy your pass at least 3 days before your first trip</li>
                      <li>Always validate your pass on the first day of use</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 