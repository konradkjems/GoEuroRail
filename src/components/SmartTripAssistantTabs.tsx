import React, { useState, useEffect } from 'react';
import { FormTrip } from '@/types';
import {
  CloudIcon,
  BanknotesIcon,
  TicketIcon,
  HomeIcon,
  SparklesIcon,
  SunIcon,
  UserGroupIcon,
  GlobeEuropeAfricaIcon,
  MapIcon
} from '@heroicons/react/24/outline';

// Import the feature modules
import WeatherPackingModule from './WeatherPackingModule';
import BudgetCalculatorModule from './BudgetCalculatorModule';
import RailPassFinderModule from './RailPassFinderModule';
import AIItineraryGenerator from './AIItineraryGenerator';

interface SmartTripAssistantTabsProps {
  trip: FormTrip;
}

export default function SmartTripAssistantTabs({ trip }: SmartTripAssistantTabsProps) {
  const [activeTab, setActiveTab] = useState<string>('weather');
  const [attractions, setAttractions] = useState<Record<string, any[]>>({});
  const [budgetLevel, setBudgetLevel] = useState<string>('medium');

  // Fetch attractions data when component mounts or trip changes
  useEffect(() => {
    fetchAttractions();
    // Set budget level based on trip budget if available
    if (trip.budget) {
      if (trip.budget < 50) setBudgetLevel('budget');
      else if (trip.budget > 150) setBudgetLevel('luxury');
      else setBudgetLevel('medium');
    }
  }, [trip]);

  // Mock function to fetch attractions data
  const fetchAttractions = async () => {
    // This would be replaced with a real API call
    const mockAttractions: Record<string, any[]> = {};
    
    // Add some mock attractions for each city in the trip
    trip.stops.forEach(stop => {
      const city = stop.cityId;
      mockAttractions[city] = [
        { name: 'City Center', category: 'Landmark', rating: 4.8 },
        { name: 'National Museum', category: 'Museum', rating: 4.6 },
        { name: 'Historic Cathedral', category: 'Cultural', rating: 4.7 },
        { name: 'Central Park', category: 'Outdoors', rating: 4.5 },
        { name: 'Old Town Square', category: 'Landmark', rating: 4.9 }
      ];
    });
    
    setAttractions(mockAttractions);
  };

  // Function to get weather data for a stop from WeatherPackingModule
  const getWeatherForStop = (stop: any) => {
    // This would ideally call the actual getWeatherForStop function from WeatherPackingModule
    // For now, return a mock object
    return {
      temp: 18,
      condition: 'partly cloudy',
      rainLevel: 'light',
      humidity: 65,
      wind_speed: 12
    };
  };

  const tabs = [
    { id: 'weather', label: 'Weather & Packing', icon: <CloudIcon className="h-5 w-5" /> },
    { id: 'budget', label: 'Budget Calculator', icon: <BanknotesIcon className="h-5 w-5" /> },
    { id: 'railpass', label: 'Rail Pass Finder', icon: <TicketIcon className="h-5 w-5" /> },
    { id: 'attractions', label: 'Top Attractions', icon: <GlobeEuropeAfricaIcon className="h-5 w-5" /> },
    { id: 'accommodations', label: 'Accommodations', icon: <HomeIcon className="h-5 w-5" /> },
    { id: 'activities', label: 'Activities & Tours', icon: <UserGroupIcon className="h-5 w-5" /> },
    { id: 'itinerary', label: 'AI Itinerary', icon: <SparklesIcon className="h-5 w-5" /> }
  ];

  return (
    <div className="h-full flex flex-col bg-[#F8F9FA]">
      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 bg-white">
        <nav className="flex overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-4 px-6 flex items-center space-x-2 whitespace-nowrap border-b-2 font-medium text-sm
                ${activeTab === tab.id 
                  ? 'border-[#06D6A0] text-[#06D6A0]' 
                  : 'border-transparent text-[#5F6368] hover:text-[#333333] hover:border-gray-300'}
              `}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'weather' && (
          <WeatherPackingModule trip={trip} />
        )}
        
        {activeTab === 'budget' && (
          <BudgetCalculatorModule trip={trip} />
        )}
        
        {activeTab === 'railpass' && (
          <RailPassFinderModule trip={trip} />
        )}
        
        {activeTab === 'attractions' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
              <div className="px-4 py-3 bg-[#F8F9FA] border-b flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <GlobeEuropeAfricaIcon className="h-5 w-5 text-[#5F6368]" />
                  <h3 className="text-md font-medium text-[#333333]">Top Attractions</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-[#5F6368]">Top Attractions component will be implemented shortly.</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'accommodations' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
              <div className="px-4 py-3 bg-[#F8F9FA] border-b flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <HomeIcon className="h-5 w-5 text-[#5F6368]" />
                  <h3 className="text-md font-medium text-[#333333]">Accommodations</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-[#5F6368]">Accommodations component will be implemented shortly.</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'activities' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
              <div className="px-4 py-3 bg-[#F8F9FA] border-b flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <UserGroupIcon className="h-5 w-5 text-[#5F6368]" />
                  <h3 className="text-md font-medium text-[#333333]">Activities & Tours</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-[#5F6368]">Activities & Tours component will be implemented shortly.</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'itinerary' && (
          <AIItineraryGenerator 
            trip={trip} 
            attractions={attractions} 
            getWeatherForStop={getWeatherForStop}
            budgetLevel={budgetLevel}
          />
        )}
      </div>
    </div>
  );
} 