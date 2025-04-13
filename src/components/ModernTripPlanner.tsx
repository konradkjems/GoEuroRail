import React, { useState, useEffect } from 'react';
import SidebarNav from './SidebarNav';
import ModernTripItinerary from './ModernTripItinerary';
import BudgetEntrySystem from './BudgetEntrySystem';
import SmartTripAssistantTabs from './SmartTripAssistantTabs';
import { FormTrip } from '@/types';
import dynamic from 'next/dynamic';

// Import map component with no SSR
const InterrailMap = dynamic(() => import('./InterrailMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-[#F8F9FA]">
      <p className="text-[#5F6368]">Loading map...</p>
    </div>
  ),
});

interface ModernTripPlannerProps {
  trip: FormTrip | null;
  onUpdateTrip?: (updatedTrip: FormTrip) => void;
}

export default function ModernTripPlanner({ trip, onUpdateTrip }: ModernTripPlannerProps) {
  const [activeTab, setActiveTab] = useState<'plan' | 'budget' | 'packing' | 'collection' | 'discover'>('plan');
  
  // Only render if we have a trip
  if (!trip) return null;
  
  return (
    <div className="flex h-full w-full">
      {/* Sidebar Navigation */}
      <SidebarNav 
        activeTab={activeTab} 
        onChangeTab={setActiveTab} 
      />
      
      {/* Content Area (dependent on active tab) */}
      <div className="flex flex-1 h-full overflow-hidden">
        {/* Left panel - Itinerary or Budget - increase width from 550px to 650px */}
        <div className="w-[650px] min-w-[650px] border-r h-full overflow-auto">
          {activeTab === 'plan' && (
            <ModernTripItinerary 
              trip={trip} 
              onUpdateTrip={onUpdateTrip} 
            />
          )}
          
          {activeTab === 'budget' && (
            <BudgetEntrySystem 
              trip={trip} 
            />
          )}
          
          {activeTab === 'discover' && (
            <div className="h-full overflow-auto">
              <SmartTripAssistantTabs trip={trip} />
            </div>
          )}
          
          {(activeTab === 'packing' || activeTab === 'collection') && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-[#5F6368]">
                <h2 className="text-xl font-medium mb-2 text-[#333333]">Coming Soon</h2>
                <p>This feature is under development</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Right panel - Map - add max-height to ensure legend is visible */}
        <div className="flex-1 h-full relative flex flex-col">
          <div className="flex-1 max-h-[calc(100vh-120px)]">
            <InterrailMap
              selectedTrip={trip}
              className="h-full w-full"
            />
            
            {/* Map controls overlay - add zoom controls, etc */}
            <div className="absolute top-4 right-4 flex flex-col space-y-2">
              <button className="bg-white p-2 rounded-md shadow-md text-[#5F6368] hover:bg-[#F8F9FA]">
                <span className="font-bold text-xl">+</span>
              </button>
              <button className="bg-white p-2 rounded-md shadow-md text-[#5F6368] hover:bg-[#F8F9FA]">
                <span className="font-bold text-xl">−</span>
              </button>
            </div>
            
            {/* Map attribution */}
            <div className="absolute bottom-1 right-1 text-xs text-[#5F6368] bg-white bg-opacity-70 px-1 rounded">
              © Mapbox © OpenStreetMap
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 