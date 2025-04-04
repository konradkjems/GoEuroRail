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
    <div className="flex flex-1 h-full overflow-hidden w-full">
      {/* Map section */}
      <div 
        className="relative h-full overflow-hidden" 
        style={{ width: mapWidth }}
      >
        {mapSection}
      </div>

      {/* Content section */}
      <div 
        className="h-full overflow-auto"
        style={{ width: `calc(100% - ${mapWidth})` }}
      >
        {contentSection}
      </div>
    </div>
  );
} 