import React from 'react';

interface SplitViewProps {
  mapSection: React.ReactNode;
  contentSection: React.ReactNode;
  mapWidth?: string; // CSS width value for map section
}

export default function SplitView({ 
  mapSection, 
  contentSection, 
  mapWidth = "70%" 
}: SplitViewProps) {
  return (
    <div className="flex flex-1 h-full overflow-hidden w-full m-0 p-0">
      {/* Map section */}
      <div 
        className="relative h-full overflow-hidden m-0 p-0" 
        style={{ width: mapWidth }}
      >
        {mapSection}
      </div>

      {/* Content section */}
      <div 
        className="h-full overflow-auto m-0 p-0"
        style={{ width: `calc(100% - ${mapWidth})` }}
      >
        <div className="p-4">
          {contentSection}
        </div>
      </div>
    </div>
  );
} 