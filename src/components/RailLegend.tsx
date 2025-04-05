import React from "react";
import { ChevronUpIcon } from "@heroicons/react/24/outline";

interface RailLegendProps {
  onToggle: () => void;
  isOpen: boolean;
}

const RailLegend: React.FC<RailLegendProps> = ({ isOpen, onToggle }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-48 overflow-hidden">
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
        onClick={onToggle}
      >
        <div className="font-medium text-[#264653] text-sm">Key</div>
        <ChevronUpIcon className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? '' : 'transform rotate-180'}`} />
      </div>
      
      {isOpen && (
        <div className="p-3 pt-1 border-t border-gray-100">
          <ul className="space-y-2.5 text-xs">
            <li className="flex items-center">
              <span className="h-1 w-1 rounded-full bg-[#264653] mr-2"></span>
              <span className="text-gray-700">Route destinations</span>
            </li>
            
            <li className="flex items-center opacity-50">
              <span className="h-1 w-1 rounded-full bg-[#264653] mr-2"></span>
              <span className="text-gray-700">Popular destinations</span>
            </li>
            
            <li className="flex items-center opacity-30">
              <span className="h-1 w-1 rounded-full bg-[#264653] mr-2"></span>
              <span className="text-gray-700">Other destinations</span>
            </li>
            
            <li className="flex items-center">
              <span className="block h-0.5 w-8 bg-[#264653] mr-2"></span>
              <span className="text-gray-700">Planned route</span>
            </li>
            
            <li className="flex items-center">
              <span className="block h-0.5 w-8 bg-[#06D6A0] mr-2"></span>
              <span className="text-gray-700">Short rail (&lt;3h)</span>
            </li>
            
            <li className="flex items-center">
              <span className="block h-0.5 w-8 bg-[#FFD166] mr-2"></span>
              <span className="text-gray-700">Medium rail (3h-5h30)</span>
            </li>
            
            <li className="flex items-center">
              <span className="block h-0.5 w-8 bg-[#F94144] mr-2"></span>
              <span className="text-gray-700">Long rail (&gt;5h30)</span>
            </li>
            
            <li className="flex items-center">
              <span className="block h-0.5 w-8 border-t-2 border-gray-700 border-dashed mr-2"></span>
              <span className="text-gray-700">Bus only</span>
            </li>
            
            <li className="flex items-center">
              <span className="block h-0.5 w-8 bg-[#118AB2] mr-2"></span>
              <span className="text-gray-700">Ferry only</span>
            </li>
          </ul>
          
          <div className="mt-3 border-t border-gray-200 pt-3">
            <div className="flex items-center text-xs">
              <span className="text-[#264653] font-medium">Route only</span>
              <div className="relative inline-block w-8 ml-auto">
                <div className="h-4 w-8 rounded-full bg-gray-300 relative">
                  <div className="h-4 w-4 rounded-full bg-white absolute left-0 shadow border border-gray-200"></div>
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