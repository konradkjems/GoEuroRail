import React, { useState, useEffect } from 'react';
import { FormTrip, FormTripStop, City } from '@/types';
import { cities } from '@/lib/cities';
import { getTripBudget, BudgetCategory } from '@/lib/api';
import {
  BanknotesIcon,
  BuildingOfficeIcon,
  SquaresPlusIcon,
  TicketIcon,
  CurrencyEuroIcon,
  ArrowDownTrayIcon,
  AdjustmentsHorizontalIcon,
  HomeIcon,
  ShoppingBagIcon,
  GlobeEuropeAfricaIcon
} from '@heroicons/react/24/outline';

// Budget ranges by region
const ACCOMMODATION_COSTS = {
  'Western Europe': { budget: 30, mid: 80, luxury: 150 },
  'Eastern Europe': { budget: 15, mid: 50, luxury: 100 },
  'Southern Europe': { budget: 20, mid: 60, luxury: 120 },
  'Northern Europe': { budget: 35, mid: 90, luxury: 180 }
};

const FOOD_COSTS = {
  'Western Europe': { budget: 15, mid: 35, luxury: 60 },
  'Eastern Europe': { budget: 10, mid: 20, luxury: 40 },
  'Southern Europe': { budget: 12, mid: 30, luxury: 50 },
  'Northern Europe': { budget: 18, mid: 40, luxury: 70 }
};

const ATTRACTION_COSTS = {
  'Western Europe': { budget: 10, mid: 20, luxury: 40 },
  'Eastern Europe': { budget: 5, mid: 15, luxury: 30 },
  'Southern Europe': { budget: 8, mid: 18, luxury: 35 },
  'Northern Europe': { budget: 12, mid: 25, luxury: 45 }
};

const TRAIN_COSTS = {
  'Western Europe': { local: 15, express: 40, international: 80 },
  'Eastern Europe': { local: 8, express: 20, international: 40 },
  'Southern Europe': { local: 10, express: 30, international: 60 },
  'Northern Europe': { local: 20, express: 50, international: 100 }
};

interface BudgetCalculatorModuleProps {
  trip: FormTrip;
}

export default function BudgetCalculatorModule({ trip }: BudgetCalculatorModuleProps) {
  // States for budget calculation
  const [budgetLevel, setBudgetLevel] = useState<'budget' | 'moderate' | 'luxury'>('moderate');
  const [customBudget, setCustomBudget] = useState<number | null>(null);
  const [budgetData, setBudgetData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomBudget, setShowCustomBudget] = useState(false);
  const [customInputValue, setCustomInputValue] = useState('');
  const [expenses, setExpenses] = useState<any[]>([]);

  // Format currency
  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formatter.format(amount);
  };

  // Get region from city
  const getRegion = (city: City): 'Western Europe' | 'Eastern Europe' | 'Southern Europe' | 'Northern Europe' => {
    const westernEurope = ['France', 'Germany', 'Netherlands', 'Belgium', 'Austria', 'Switzerland', 'Luxembourg'];
    const easternEurope = ['Poland', 'Czech Republic', 'Hungary', 'Slovakia', 'Romania', 'Bulgaria', 'Croatia', 'Slovenia'];
    const southernEurope = ['Italy', 'Spain', 'Portugal', 'Greece', 'Malta', 'Cyprus'];
    const northernEurope = ['Sweden', 'Norway', 'Finland', 'Denmark', 'Iceland', 'Estonia', 'Latvia', 'Lithuania'];
    
    if (westernEurope.includes(city.country)) return 'Western Europe';
    if (easternEurope.includes(city.country)) return 'Eastern Europe';
    if (southernEurope.includes(city.country)) return 'Southern Europe';
    if (northernEurope.includes(city.country)) return 'Northern Europe';
    
    // Default to Western Europe if unknown
    return 'Western Europe';
  };

  // Helper function to safely get trip ID
  const getTripId = (): string => {
    if (!trip) return 'default';
    // First check for _id as it's typed as string
    if (trip._id) return trip._id;
    // Then check for id which is now typed as optional string
    if (typeof trip.id === 'string') return trip.id;
    // If neither exists, use the name as a fallback
    return trip.name || 'default';
  };

  // Load expenses from localStorage
  useEffect(() => {
    if (trip) {
      const tripId = getTripId();
      const savedExpenses = localStorage.getItem(`expenses_${tripId}`);
      if (savedExpenses) {
        setExpenses(JSON.parse(savedExpenses));
      }

      // Load budget level from localStorage
      const savedBudgetLevel = localStorage.getItem(`budgetLevel_${tripId}`);
      if (savedBudgetLevel && ['budget', 'moderate', 'luxury'].includes(savedBudgetLevel)) {
        setBudgetLevel(savedBudgetLevel as 'budget' | 'moderate' | 'luxury');
      }

      // Load custom budget from localStorage
      const savedCustomBudget = localStorage.getItem(`customBudget_${tripId}`);
      if (savedCustomBudget) {
        const parsedBudget = parseFloat(savedCustomBudget);
        setCustomBudget(parsedBudget);
        setCustomInputValue(parsedBudget.toString());
        setShowCustomBudget(true);
      }
    }
  }, [trip]);

  // Save settings to localStorage when they change
  useEffect(() => {
    if (trip) {
      const tripId = getTripId();
      localStorage.setItem(`budgetLevel_${tripId}`, budgetLevel);
      
      if (customBudget !== null) {
        localStorage.setItem(`customBudget_${tripId}`, customBudget.toString());
      }
    }
  }, [budgetLevel, customBudget, trip]);

  // Update budget data when dependencies change
  useEffect(() => {
    fetchBudgetData();
  }, [trip, budgetLevel, customBudget]);

  // Calculate the budget for the trip
  const calculateBudget = () => {
    if (!trip || !trip.stops || trip.stops.length === 0) return null;
    
    const stops = trip.stops;
    const nights = stops.reduce((total, stop) => total + (stop.isStopover ? 0 : (stop.nights || 1)), 0);
    const citiesCount = stops.filter(stop => !stop.isStopover).length;
    const travelDays = stops.filter(stop => !stop.isStopover).length - 1 + (stops[0].isStopover ? 1 : 0) + (stops[stops.length - 1].isStopover ? 1 : 0);
    
    // Different cost categories based on budget level - UPDATED VALUES
    const accommodationCosts = {
      budget: 90,  // was 50
      moderate: 150, // was 100
      luxury: 300   // was 200
    };
    
    const foodCosts = {
      budget: 50,  // was 30
      moderate: 80, // was 50
      luxury: 150   // was 100
    };
    
    const activityCosts = {
      budget: 40,  // was 20
      moderate: 70, // was 40
      luxury: 140   // was 80
    };
    
    const transportCosts = {
      budget: 60,  // was 30
      moderate: 100, // was 50
      luxury: 180   // was 100
    };
    
    // Calculate costs based on budget level
    const accommodation = accommodationCosts[budgetLevel] * nights;
    const food = foodCosts[budgetLevel] * (nights + travelDays);
    const activities = activityCosts[budgetLevel] * citiesCount;
    const transport = transportCosts[budgetLevel] * travelDays;
    
    const totalCost = accommodation + food + activities + transport;
    
    return {
      totalCost,
      accommodation,
      food,
      activities,
      transport,
      details: {
        nights,
        cities: citiesCount,
        travelDays
      }
    };
  };

  // Fetch budget data from API or calculate locally
  const fetchBudgetData = async () => {
    if (!trip.stops || trip.stops.length === 0) return;
    
    setIsLoading(true);
    
    try {
      // Calculate budget based on trip details
      const budgetParams = {
        stops: trip.stops.map(stop => {
          const city = cities.find(c => c.id === stop.cityId);
          return {
            city: city ? city.name : '',
            country: city ? city.country : '',
            nights: stop.nights || 0
          };
        }).filter(stop => stop.nights > 0),
        budgetLevel,
        travelers: typeof trip.travelers === 'number' ? trip.travelers : 1
      };
      
      try {
        // Try to get real budget data from API
        const realBudgetData = await getTripBudget(budgetParams);
        if (realBudgetData) {
          // Apply custom budget if set
          if (customBudget !== null) {
            // Create a modified version of the budget data
            const modifiedBudgetData = {
              ...realBudgetData,
              totalCost: customBudget,
              // Adjust breakdown proportions based on the custom total
              breakdown: {
                accommodation: Math.round((realBudgetData.breakdown.accommodation / realBudgetData.totals[budgetLevel]) * customBudget),
                food: Math.round((realBudgetData.breakdown.food / realBudgetData.totals[budgetLevel]) * customBudget),
                localTransport: Math.round((realBudgetData.breakdown.localTransport / realBudgetData.totals[budgetLevel]) * customBudget),
                attractions: Math.round((realBudgetData.breakdown.attractions / realBudgetData.totals[budgetLevel]) * customBudget)
              }
            };
            setBudgetData(modifiedBudgetData);
          } else {
            // Use the real budget data with the selected budget level's total
            const updatedBudgetData = {
              ...realBudgetData,
              totalCost: realBudgetData.totals[budgetLevel]
            };
            setBudgetData(updatedBudgetData);
          }
          return;
        }
      } catch (error) {
        console.warn('Error fetching budget from API, falling back to local calculation:', error);
      }
      
      // Fallback to local calculation
      const calculatedBudget = calculateBudget();
      if (customBudget !== null && calculatedBudget) {
        // Apply custom budget to the calculated budget
        const originalTotal = calculatedBudget.totalCost;
        const ratio = customBudget / originalTotal;
        
        const modifiedBudget = {
          ...calculatedBudget,
          totalCost: customBudget,
          accommodation: Math.round(calculatedBudget.accommodation * ratio),
          food: Math.round(calculatedBudget.food * ratio),
          activities: Math.round(calculatedBudget.activities * ratio),
          transport: Math.round(calculatedBudget.transport * ratio),
        };
        
        setBudgetData(modifiedBudget);
      } else {
        setBudgetData(calculatedBudget);
      }
    } catch (error) {
      console.error('Error calculating budget:', error);
      setBudgetData(calculateBudget());
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle custom budget change
  const handleCustomBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomInputValue(e.target.value);
  };
  
  // Apply custom budget
  const applyCustomBudget = () => {
    const parsedValue = parseFloat(customInputValue);
    if (!isNaN(parsedValue) && parsedValue > 0) {
      setCustomBudget(parsedValue);
    }
  };
  
  // Reset custom budget
  const resetCustomBudget = () => {
    setCustomBudget(null);
    setShowCustomBudget(false);
    setCustomInputValue('');
    
    // Also remove from localStorage
    if (trip) {
      const tripId = getTripId();
      localStorage.removeItem(`customBudget_${tripId}`);
    }
  };
  
  // Calculate total spent from expenses
  const getTotalSpent = () => {
    return expenses.reduce((total, expense) => total + (expense.amount || 0), 0);
  };
  
  // Get the percentage of budget spent
  const getPercentSpent = () => {
    const totalBudget = getTotalBudget();
    if (!totalBudget) return 0;
    
    const totalSpent = getTotalSpent();
    return Math.min(100, Math.round((totalSpent / totalBudget) * 100));
  };

  // Update the setBudgetLevel function to trigger a budget recalculation
  const handleBudgetLevelChange = (level: 'budget' | 'moderate' | 'luxury') => {
    setBudgetLevel(level);
    
    // Also update expense tracker budget level in localStorage
    if (trip) {
      const tripId = getTripId();
      localStorage.setItem(`expenseTrackerBudgetLevel_${tripId}`, level);
    }
    
    // If we already have budget data, update it immediately for a smoother UX
    if (budgetData && budgetData.totals && budgetData.totals[level]) {
      if (customBudget === null) {
        // If no custom budget, update the totalCost to match the selected level
        setBudgetData({
          ...budgetData,
          totalCost: budgetData.totals[level]
        });
      }
    }
    
    // Then fetch the updated budget data
    fetchBudgetData();
  };

  // Update the getTotalBudget helper function to get the correct budget value
  const getTotalBudget = () => {
    if (!budgetData) return 0;
    
    // If there's a custom budget, use that
    if (customBudget !== null) {
      return customBudget;
    }
    
    // Otherwise use the budget for the selected level
    if (budgetData.totals && budgetData.totals[budgetLevel]) {
      return budgetData.totals[budgetLevel];
    }
    
    // Fallback to totalCost if the above properties don't exist
    return budgetData.totalCost || 0;
  };

  const budget = budgetData;
  const percentSpent = getPercentSpent();
  const totalSpent = getTotalSpent();

  // Budget category colors
  const categoryColors = {
    accommodation: 'bg-blue-500',
    food: 'bg-green-500',
    activities: 'bg-amber-500',
    transport: 'bg-purple-500',
  };

  // Budget category icons
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'accommodation':
        return <HomeIcon className="h-5 w-5 text-blue-500" />;
      case 'food':
        return <ShoppingBagIcon className="h-5 w-5 text-green-500" />;
      case 'activities':
        return <GlobeEuropeAfricaIcon className="h-5 w-5 text-amber-500" />;
      case 'transport':
        return <TicketIcon className="h-5 w-5 text-purple-500" />;
      default:
        return <CurrencyEuroIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // Add this effect to sync the budget level with the expense tracker when the component mounts
  useEffect(() => {
    if (trip) {
      const tripId = getTripId();
      
      // Check if there's a saved expense tracker budget level
      const savedExpenseTrackerBudgetLevel = localStorage.getItem(`expenseTrackerBudgetLevel_${tripId}`);
      if (savedExpenseTrackerBudgetLevel && ['budget', 'moderate', 'luxury'].includes(savedExpenseTrackerBudgetLevel)) {
        // If there is, use it instead of the normal budget level
        setBudgetLevel(savedExpenseTrackerBudgetLevel as 'budget' | 'moderate' | 'luxury');
      } else {
        // If not, save the current budget level to the expense tracker
        localStorage.setItem(`expenseTrackerBudgetLevel_${tripId}`, budgetLevel);
      }
    }
  }, [trip]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Budget Calculator</h2>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
        </div>
      ) : (
        <>
          {/* Budget Level Selection */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b flex justify-between items-center">
              <h3 className="text-md font-medium text-gray-700">Budget Level</h3>
              
              <div className="flex items-center">
                <button
                  onClick={() => setShowCustomBudget(!showCustomBudget)}
                  className="text-sm text-blue-600 flex items-center"
                >
                  <AdjustmentsHorizontalIcon className="h-4 w-4 mr-1" />
                  {showCustomBudget ? 'Hide custom' : 'Set custom budget'}
                </button>
              </div>
            </div>
            
            <div className="p-4">
              {/* Budget Level Options */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <button
                  onClick={() => handleBudgetLevelChange('budget')}
                  className={`
                    py-2 px-4 rounded-md border text-sm font-medium 
                    ${budgetLevel === 'budget' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
                  `}
                >
                  Budget
                </button>
                <button
                  onClick={() => handleBudgetLevelChange('moderate')}
                  className={`
                    py-2 px-4 rounded-md border text-sm font-medium 
                    ${budgetLevel === 'moderate' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
                  `}
                >
                  Moderate
                </button>
                <button
                  onClick={() => handleBudgetLevelChange('luxury')}
                  className={`
                    py-2 px-4 rounded-md border text-sm font-medium 
                    ${budgetLevel === 'luxury' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
                  `}
                >
                  Luxury
                </button>
              </div>
              
              {/* Custom Budget Input */}
              {showCustomBudget && (
                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1">
                      <label htmlFor="customBudget" className="block text-sm font-medium text-gray-700 mb-1">
                        Custom Budget Amount (€)
                      </label>
                      <div className="flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                          €
                        </span>
                        <input
                          type="number"
                          id="customBudget"
                          value={customInputValue}
                          onChange={handleCustomBudgetChange}
                          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Enter amount"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={applyCustomBudget}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Apply
                      </button>
                      {customBudget !== null && (
                        <button
                          onClick={resetCustomBudget}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Budget Description */}
              <div className="text-sm text-gray-600">
                <p>
                  {budgetLevel === 'budget' && 'Budget travelers seeking affordable accommodations like hostels, preparing some meals, and using public transportation.'}
                  {budgetLevel === 'moderate' && 'Mid-range travelers staying in 3-star hotels, eating at casual restaurants, and occasional taxis or tours.'}
                  {budgetLevel === 'luxury' && 'Luxury travelers staying in 4-5 star hotels, dining at upscale restaurants, and using private transfers or first-class travel.'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Budget Overview */}
          {budget && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b">
                <h3 className="text-md font-medium text-gray-700">Budget Overview</h3>
              </div>
              
              <div className="p-4">
                {/* Total budget */}
                <div className="text-center mb-6">
                  <div className="text-sm text-gray-500 mb-1">Total Budget</div>
                  <div className="text-3xl font-bold text-[#333333]">{formatCurrency(getTotalBudget())}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {budget.details && `For ${budget.details.nights} nights in ${budget.details.cities} ${budget.details.cities > 1 ? 'cities' : 'city'}`}
                  </div>
                </div>
                
                {/* Budget calculation explanation */}
                <div className="mb-6 p-3 bg-gray-50 rounded-md">
                  <h4 className="text-sm font-medium text-[#333333] mb-2">How This Budget Was Calculated</h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    {budget.details && (
                      <>
                        <p><span className="font-medium">Trip Duration:</span> {budget.details.nights} nights in {budget.details.cities} {budget.details.cities > 1 ? 'cities' : 'city'}, with {budget.details.travelDays} travel days</p>
                        {budgetLevel === 'budget' && (
                          <>
                            <p><span className="font-medium">Accommodation:</span> €90 per night × {budget.details.nights} nights</p>
                            <p><span className="font-medium">Food:</span> €50 per day × {budget.details.nights + budget.details.travelDays} days</p>
                            <p><span className="font-medium">Activities:</span> €40 per city × {budget.details.cities} cities</p>
                            <p><span className="font-medium">Transport:</span> €60 per travel day × {budget.details.travelDays} days</p>
                          </>
                        )}
                        {budgetLevel === 'moderate' && (
                          <>
                            <p><span className="font-medium">Accommodation:</span> €150 per night × {budget.details.nights} nights</p>
                            <p><span className="font-medium">Food:</span> €80 per day × {budget.details.nights + budget.details.travelDays} days</p>
                            <p><span className="font-medium">Activities:</span> €70 per city × {budget.details.cities} cities</p>
                            <p><span className="font-medium">Transport:</span> €100 per travel day × {budget.details.travelDays} days</p>
                          </>
                        )}
                        {budgetLevel === 'luxury' && (
                          <>
                            <p><span className="font-medium">Accommodation:</span> €300 per night × {budget.details.nights} nights</p>
                            <p><span className="font-medium">Food:</span> €150 per day × {budget.details.nights + budget.details.travelDays} days</p>
                            <p><span className="font-medium">Activities:</span> €140 per city × {budget.details.cities} cities</p>
                            <p><span className="font-medium">Transport:</span> €180 per travel day × {budget.details.travelDays} days</p>
                          </>
                        )}
                        {customBudget !== null && (
                          <p className="italic">Note: A custom budget of {formatCurrency(customBudget)} has been applied, adjusting all category amounts proportionally.</p>
                        )}
                      </>
                    )}
                    <p className="mt-2 text-[#5F6368]">*Calculation based on average prices across your destinations. Actual costs may vary by location and season.</p>
                  </div>
                </div>
                
                {/* Budget breakdown visualization */}
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Budget Breakdown</h4>
                  
                  <div className="h-6 w-full rounded-full bg-gray-200 mb-4 overflow-hidden">
                    {/* Render proportion bars based on either API or local calculation */}
                    {budget.breakdown ? (
                      // Using API breakdown structure
                      <>
                        <div 
                          className={`h-full ${categoryColors.accommodation} float-left`} 
                          style={{ width: `${(budget.breakdown.accommodation / budget.totalCost) * 100}%` }}
                        ></div>
                        <div 
                          className={`h-full ${categoryColors.food} float-left`} 
                          style={{ width: `${(budget.breakdown.food / budget.totalCost) * 100}%` }}
                        ></div>
                        <div 
                          className={`h-full ${categoryColors.activities} float-left`} 
                          style={{ width: `${(budget.breakdown.attractions / budget.totalCost) * 100}%` }}
                        ></div>
                        <div 
                          className={`h-full ${categoryColors.transport} float-left`} 
                          style={{ width: `${(budget.breakdown.localTransport / budget.totalCost) * 100}%` }}
                        ></div>
                      </>
                    ) : (
                      // Using local calculation structure
                      <>
                        <div 
                          className={`h-full ${categoryColors.accommodation} float-left`} 
                          style={{ width: `${(budget.accommodation / budget.totalCost) * 100}%` }}
                        ></div>
                        <div 
                          className={`h-full ${categoryColors.food} float-left`} 
                          style={{ width: `${(budget.food / budget.totalCost) * 100}%` }}
                        ></div>
                        <div 
                          className={`h-full ${categoryColors.activities} float-left`} 
                          style={{ width: `${(budget.activities / budget.totalCost) * 100}%` }}
                        ></div>
                        <div 
                          className={`h-full ${categoryColors.transport} float-left`} 
                          style={{ width: `${(budget.transport / budget.totalCost) * 100}%` }}
                        ></div>
                      </>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {/* Display breakdown cards based on either API or local calculation */}
                    {budget.breakdown ? (
                      // Using API breakdown structure
                      <>
                        <div className="flex items-center space-x-2 p-2 rounded-md border border-gray-200">
                          {getCategoryIcon('accommodation')}
                          <div>
                            <div className="text-xs text-gray-500">Accommodation</div>
                            <div className="font-medium text-[#333333]">{formatCurrency(budget.breakdown.accommodation)}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 p-2 rounded-md border border-gray-200">
                          {getCategoryIcon('food')}
                          <div>
                            <div className="text-xs text-gray-500">Food</div>
                            <div className="font-medium text-[#333333]">{formatCurrency(budget.breakdown.food)}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 p-2 rounded-md border border-gray-200">
                          {getCategoryIcon('activities')}
                          <div>
                            <div className="text-xs text-gray-500">Activities</div>
                            <div className="font-medium text-[#333333]">{formatCurrency(budget.breakdown.attractions)}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 p-2 rounded-md border border-gray-200">
                          {getCategoryIcon('transport')}
                          <div>
                            <div className="text-xs text-gray-500">Local Transport</div>
                            <div className="font-medium text-[#333333]">{formatCurrency(budget.breakdown.localTransport)}</div>
                          </div>
                        </div>
                      </>
                    ) : (
                      // Using local calculation structure
                      <>
                        <div className="flex items-center space-x-2 p-2 rounded-md border border-gray-200">
                          {getCategoryIcon('accommodation')}
                          <div>
                            <div className="text-xs text-gray-500">Accommodation</div>
                            <div className="font-medium text-[#333333]">{formatCurrency(budget.accommodation)}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 p-2 rounded-md border border-gray-200">
                          {getCategoryIcon('food')}
                          <div>
                            <div className="text-xs text-gray-500">Food</div>
                            <div className="font-medium text-[#333333]">{formatCurrency(budget.food)}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 p-2 rounded-md border border-gray-200">
                          {getCategoryIcon('activities')}
                          <div>
                            <div className="text-xs text-gray-500">Activities</div>
                            <div className="font-medium text-[#333333]">{formatCurrency(budget.activities)}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 p-2 rounded-md border border-gray-200">
                          {getCategoryIcon('transport')}
                          <div>
                            <div className="text-xs text-gray-500">Transport</div>
                            <div className="font-medium text-[#333333]">{formatCurrency(budget.transport)}</div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Budget tracking */}
                {expenses.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Budget Tracking</h4>
                    
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <div className="mb-2 flex justify-between">
                        <span className="text-sm text-gray-600">Spent so far</span>
                        <span className="text-sm font-medium text-[#333333]">{formatCurrency(totalSpent)}</span>
                      </div>
                      
                      <div className="h-3 w-full rounded-full bg-gray-200 mb-1">
                        <div 
                          className={`h-full rounded-full ${
                            percentSpent > 95 ? 'bg-red-500' : percentSpent > 75 ? 'bg-amber-500' : 'bg-green-500'
                          }`} 
                          style={{ width: `${percentSpent}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0%</span>
                        <span className="text-[#333333]">{percentSpent}% of budget</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Download button - mock functionality */}
                <div className="mt-6 flex justify-end">
                  <button 
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
                    Download Budget
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 