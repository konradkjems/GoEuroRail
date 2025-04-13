import React from 'react';
import {
  MapPinIcon,
  BanknotesIcon,
  ArchiveBoxIcon,
  UserGroupIcon,
  DocumentTextIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

interface SidebarNavProps {
  activeTab: 'plan' | 'budget' | 'packing' | 'collection' | 'discover';
  onChangeTab: (tab: 'plan' | 'budget' | 'packing' | 'collection' | 'discover') => void;
}

export default function SidebarNav({ activeTab, onChangeTab }: SidebarNavProps) {
  return (
    <div className="bg-white h-full w-16 min-w-16 flex flex-col items-center pt-6 pb-4 shadow-sm">
      <div className="flex flex-col h-full justify-between">
        <div className="flex flex-col items-center space-y-8">
          {/* Plan tab - always enabled */}
          <button
            onClick={() => onChangeTab('plan')}
            className={`p-2 rounded-full ${
              activeTab === 'plan'
                ? 'bg-[#06D6A0] text-white'
                : 'text-gray-600 hover:text-[#06D6A0] hover:bg-gray-100'
            }`}
            title="Plan"
          >
            <MapPinIcon className="h-6 w-6" />
          </button>

          {/* Budget tab - always enabled */}
          <button
            onClick={() => onChangeTab('budget')}
            className={`p-2 rounded-full ${
              activeTab === 'budget'
                ? 'bg-[#06D6A0] text-white'
                : 'text-gray-600 hover:text-[#06D6A0] hover:bg-gray-100'
            }`}
            title="Budget"
          >
            <BanknotesIcon className="h-6 w-6" />
          </button>

          {/* Discover tab - enabled */}
          <button
            onClick={() => onChangeTab('discover')}
            className={`p-2 rounded-full ${
              activeTab === 'discover'
                ? 'bg-[#06D6A0] text-white'
                : 'text-gray-600 hover:text-[#06D6A0] hover:bg-gray-100'
            }`}
            title="Smart Trip Assistant"
          >
            <SparklesIcon className="h-6 w-6" />
          </button>

          {/* Packing tab - temporarily disabled */}
          <button
            className="p-2 rounded-full text-gray-300 cursor-not-allowed"
            title="Packing (Coming Soon)"
            disabled
          >
            <ArchiveBoxIcon className="h-6 w-6" />
          </button>

          {/* Collection tab - temporarily disabled */}
          <button
            className="p-2 rounded-full text-gray-300 cursor-not-allowed"
            title="Collection (Coming Soon)"
            disabled
          >
            <DocumentTextIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Placeholder for profile or other footer icons */}
        <div className="pt-4">
          {/* No functionality yet */}
        </div>
      </div>
    </div>
  );
} 