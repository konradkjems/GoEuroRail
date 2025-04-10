# Map Legend Implementation Instructions

## Overview
The map legend should appear on the map itself, not in the trip itinerary. The legend should be simplified to match the reference image, removing all checkboxes except for the "Route only" toggle at the bottom.

## Implementation Details

1. **Placement**:
   - Position the legend in the top-left corner of the map component
   - The legend should appear above other map elements

2. **Design**:
   - White background with a subtle border and shadow
   - Collapsible panel with a "Key" header
   - Simple items without interactive checkboxes for each legend item
   - Only the "Route only" toggle at the bottom should be functional

3. **Legend Items**:
   - Route destinations (dot)
   - Popular destinations (dot, semi-transparent)
   - Other destinations (dot, more transparent)
   - Planned route (black line)
   - Short rail (<3h) (green line)
   - Medium rail (3h-5h30) (yellow/amber line)
   - Long rail (>5h30) (red line)
   - Bus only (dashed line)
   - Ferry only (blue line)
   - Route only toggle (slider at bottom)

4. **Integration**:
   - Import the RailLegend component directly in the map component
   - Use the isLegendOpen state to control visibility
   - Ensure the legend doesn't interfere with map interactions

## Implementation Status

The following changes have been completed:

1. **Created a standalone RailLegend component**:
   - Extracted the RailLegend component from TripItinerary.tsx to its own file at src/components/RailLegend.tsx
   - Simplified the design as per the reference image
   - Positioned it in the top-left corner of the map
   - Removed checkboxes from individual items, keeping only the "Route only" toggle

2. **Integrated the legend into map components**:
   - Added the RailLegend to InteractiveMap.tsx
   - Added the RailLegend to TripMap.tsx
   - Added the RailLegend to EuropeMap.tsx
   - Adjusted the position of existing elements to avoid overlapping with the legend

3. **Added state management for the legend**:
   - Each map component now manages the visibility of the legend with an isLegendOpen state
   - The legend can be toggled by clicking the header

## Code Example

```jsx
// Example Map component integration
import { useState } from 'react';
import RailLegend from '@/components/RailLegend';

export default function MapComponent() {
  const [isLegendOpen, setIsLegendOpen] = useState(true);
  
  return (
    <div className="relative">
      {/* Rail Legend Component */}
      <RailLegend 
        isOpen={isLegendOpen} 
        onToggle={() => setIsLegendOpen(!isLegendOpen)} 
      />
      
      {/* Map rendering code */}
      <MapContainer>
        {/* ... */}
      </MapContainer>
    </div>
  );
}
```
