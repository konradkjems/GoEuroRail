import React from "react";
import { ChevronUpIcon } from "@heroicons/react/24/outline";

interface RailLegendProps {
  onToggle: () => void;
  isOpen: boolean;
}

const RailLegend: React.FC<RailLegendProps> = ({ isOpen, onToggle }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-64 overflow-hidden">
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
        onClick={onToggle}
      >
        <div className="font-medium text-[#264653] text-sm">Map Legend</div>
        <ChevronUpIcon className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? '' : 'transform rotate-180'}`} />
      </div>
      
      {isOpen && (
        <div className="p-3 pt-1 border-t border-gray-100">
          {/* City Types */}
          <div className="mb-3">
            <h3 className="text-xs font-medium text-gray-700 mb-2">Cities</h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-[#EF4444] mr-2"></span>
                <span className="text-gray-700">Selected city</span>
              </li>
              
              <li className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-[#F59E0B] mr-2"></span>
                <span className="text-gray-700">Trip destination</span>
              </li>
              
              <li className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-[#8B5CF6] mr-2"></span>
                <span className="text-gray-700">Transport hub</span>
              </li>
              
              <li className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-[#6366F1] mr-2"></span>
                <span className="text-gray-700">Major city</span>
              </li>

              <li className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-[#10B981] mr-2"></span>
                <span className="text-gray-700">Regular city</span>
              </li>
              
              <li className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-[#94A3B8] mr-2"></span>
                <span className="text-gray-700">Rail-connected city</span>
              </li>
            </ul>
          </div>
          
          {/* Route lines */}
          <div className="mb-3">
            <h3 className="text-xs font-medium text-gray-700 mb-2">Trip Route</h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center">
                <span className="block h-1 w-8 bg-[#3B82F6] mr-2"></span>
                <span className="text-gray-700">Your planned trip route</span>
              </li>
            </ul>
          </div>
          
          {/* Rail connections */}
          <div className="mb-3">
            <h3 className="text-xs font-medium text-gray-700 mb-2">Rail Network</h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center">
                <span className="block h-1 w-8 bg-[#8B5CF6] mr-2"></span>
                <span className="text-gray-700">High-speed (310-320 km/h)</span>
              </li>
              
              <li className="flex items-center">
                <span className="block h-1 w-8 bg-[#EF4444] mr-2"></span>
                <span className="text-gray-700">Very fast (270-300 km/h)</span>
              </li>
              
              <li className="flex items-center">
                <span className="block h-1 w-8 bg-[#F97316] mr-2"></span>
                <span className="text-gray-700">Fast (240-260 km/h)</span>
              </li>
              
              <li className="flex items-center">
                <span className="block h-1 w-8 bg-[#FACC15] mr-2"></span>
                <span className="text-gray-700">Medium (200-230 km/h)</span>
              </li>
              
              <li className="flex items-center">
                <span className="block h-1 w-8 border-t border-[#10B981] border-dashed mr-2"></span>
                <span className="text-gray-700">Under construction</span>
              </li>
              
              <li className="flex items-center">
                <span className="block h-1 w-8 bg-[#9CA3AF] mr-2"></span>
                <span className="text-gray-700">Regular (&lt; 200 km/h)</span>
              </li>

              <li className="flex items-center opacity-70">
                <span className="block h-1 w-8 bg-[#06D6A0] mr-2"></span>
                <span className="text-gray-700">Short travel time (&lt; 3h)</span>
              </li>
              
              <li className="flex items-center opacity-70">
                <span className="block h-1 w-8 bg-[#FFD166] mr-2"></span>
                <span className="text-gray-700">Medium travel time (3-5.5h)</span>
              </li>
              
              <li className="flex items-center opacity-70">
                <span className="block h-1 w-8 bg-[#F94144] mr-2"></span>
                <span className="text-gray-700">Long travel time (&gt; 5.5h)</span>
              </li>
            </ul>
          </div>
          
          {/* Transport types */}
          <div className="mb-2">
            <h3 className="text-xs font-medium text-gray-700 mb-2">Other Transport</h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center">
                <span className="block h-1 w-8 border-t-2 border-gray-700 border-dashed mr-2"></span>
                <span className="text-gray-700">Bus routes</span>
              </li>
              
              <li className="flex items-center">
                <span className="block h-1 w-8 bg-[#118AB2] mr-2"></span>
                <span className="text-gray-700">Ferry routes</span>
              </li>
            </ul>
          </div>
          
          <div className="mt-3 border-t border-gray-200 pt-3">
            <div className="flex items-center text-xs">
              <span className="text-[#264653] font-medium">Show Rail Network</span>
              <div className="relative inline-block w-8 ml-auto">
                <div className="h-4 w-8 rounded-full bg-gray-300 relative">
                  <div className="h-4 w-4 rounded-full bg-white absolute right-0 shadow border border-gray-200"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RailLegend; 