import React from "react";
import { ChevronUpIcon } from "@heroicons/react/24/outline";

interface RailLegendProps {
  onToggle: () => void;
  isOpen: boolean;
  showRailNetwork?: boolean;
  onToggleRailNetwork?: () => void;
}

const RailLegend: React.FC<RailLegendProps> = ({ 
  isOpen, 
  onToggle, 
  showRailNetwork = true, 
  onToggleRailNetwork 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-56 overflow-hidden">
      <div 
        className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-50"
        onClick={onToggle}
      >
        <div className="font-medium text-[#264653] text-xs">Map Legend</div>
        <ChevronUpIcon className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? '' : 'transform rotate-180'}`} />
      </div>
      
      {isOpen && (
        <div className="p-2 pt-1 border-t border-gray-100 text-xs">
          <div className="grid grid-cols-2 gap-x-2">
            {/* Left column */}
            <div>
              {/* City Types */}
              <div className="mb-2">
                <h3 className="text-xs font-medium text-gray-700 mb-1">Cities</h3>
                <ul className="space-y-1 text-[10px]">
                  <li className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-[#EF4444] mr-1"></span>
                    <span className="text-gray-700">Selected city</span>
                  </li>
                  
                  <li className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-[#3B82F6] mr-1"></span>
                    <span className="text-gray-700">Trip stop</span>
                  </li>
                  
                  <li className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-[#8B5CF6] mr-1"></span>
                    <span className="text-gray-700">Transport hub</span>
                  </li>
                  
                  <li className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-[#10B981] mr-1"></span>
                    <span className="text-gray-700">Popular city</span>
                  </li>
                  
                  <li className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-[#6366F1] mr-1"></span>
                    <span className="text-gray-700">Major city</span>
                  </li>
                </ul>
              </div>
              
              {/* Trip Route */}
              <div className="mb-2">
                <h3 className="text-xs font-medium text-gray-700 mb-1">Trip Route</h3>
                <ul className="space-y-1 text-[10px]">
                  <li className="flex items-center">
                    <span className="block h-1 w-6 bg-black mr-1"></span>
                    <span className="text-gray-700">Planned route</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Right column */}
            <div>
              {/* Rail connections */}
              <div className="mb-2">
                <h3 className="text-xs font-medium text-gray-700 mb-1">Rail Network</h3>
                <ul className="space-y-1 text-[10px]">
                  <li className="flex items-center">
                    <span className="block h-1 w-6 bg-[#8B5CF6] mr-1"></span>
                    <span className="text-gray-700">High-speed 310+ km/h</span>
                  </li>
                  
                  <li className="flex items-center">
                    <span className="block h-1 w-6 bg-[#EF4444] mr-1"></span>
                    <span className="text-gray-700">Very fast 270-300 km/h</span>
                  </li>
                  
                  <li className="flex items-center">
                    <span className="block h-1 w-6 bg-[#F97316] mr-1"></span>
                    <span className="text-gray-700">Fast 240-260 km/h</span>
                  </li>
                  
                  <li className="flex items-center">
                    <span className="block h-1 w-6 bg-[#FACC15] mr-1"></span>
                    <span className="text-gray-700">Medium 200-230 km/h</span>
                  </li>
                  
                  <li className="flex items-center">
                    <span className="block h-1 w-6 bg-[#9CA3AF] mr-1"></span>
                    <span className="text-gray-700">Regular</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-1 border-t border-gray-200 pt-1">
            <div 
              className="flex items-center text-[10px] cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleRailNetwork) onToggleRailNetwork();
              }}
            >
              <span className="text-[#264653] font-medium">Show Rail Network</span>
              <div className={`relative inline-block w-8 ml-auto ${showRailNetwork ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`h-3 w-7 rounded-full ${showRailNetwork ? 'bg-blue-500' : 'bg-gray-300'} relative transition-colors`}>
                  <div className={`h-3 w-3 rounded-full bg-white absolute ${showRailNetwork ? 'left-4' : 'left-0'} shadow border border-gray-200 transition-all`}></div>
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