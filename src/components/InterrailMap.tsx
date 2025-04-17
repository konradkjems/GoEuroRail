'use client';

import dynamic from 'next/dynamic';
import { FormTrip } from '@/types';

const MapboxMap = dynamic(() => import('@/components/MapboxMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 flex items-center justify-center">Loading map...</div>
});

interface InterrailMapProps {
  selectedTrip: FormTrip | null;
  onCityClick?: (cityId: string) => void;
  className?: string;
}

export default function InterrailMap({ selectedTrip, onCityClick, className }: InterrailMapProps) {
  if (!selectedTrip) {
    return (
      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Select a trip to view on map</p>
      </div>
    );
  }

  return (
    <MapboxMap
      trip={selectedTrip}
      selectedStop={null}
      onStopSelect={(stop) => onCityClick?.(stop.cityId)}
      className={className}
    />
  );
} 