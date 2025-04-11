import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MapPinIcon, 
  CalendarIcon, 
  UserGroupIcon,
  PencilIcon,
  TrashIcon,
  ChevronRightIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { cities } from '@/lib/cities';
import { formatDate } from '@/lib/utils';
import { FormTrip, FormTripStop } from '@/types';

interface MobileTripPlannerProps {
  trip: FormTrip;
  onUpdateTrip: (updatedTrip: FormTrip) => void;
  onDeleteTrip: () => void;
}

export default function MobileTripPlanner({ trip, onUpdateTrip, onDeleteTrip }: MobileTripPlannerProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingStop, setEditingStop] = useState<FormTripStop | null>(null);

  const handleStopClick = (stop: FormTripStop) => {
    setEditingStop(stop);
  };

  const handleUpdateStop = (updatedStop: FormTripStop) => {
    const updatedStops = trip.stops.map(stop => 
      stop.cityId === updatedStop.cityId ? updatedStop : stop
    );
    onUpdateTrip({ ...trip, stops: updatedStops });
    setEditingStop(null);
  };

  return (
    <div className="md:hidden">
      {/* Trip Header */}
      <div className="bg-white shadow-sm rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{trip.name}</h2>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? (
              <ChevronDownIcon className="h-5 w-5" />
            ) : (
              <ChevronRightIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
        </div>
        
        {trip.travelers && (
          <div className="mt-1 flex items-center text-sm text-gray-500">
            <UserGroupIcon className="h-4 w-4 mr-1" />
            <span>{trip.travelers} traveler{trip.travelers > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Trip Stops */}
      {isExpanded && (
        <div className="space-y-3">
          {trip.stops.map((stop, index) => {
            const city = cities.find(c => c.id === stop.cityId);
            if (!city) return null;

            return (
              <div
                key={stop.cityId}
                className="bg-white shadow-sm rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPinIcon className="h-5 w-5 text-blue-500 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{city.name}</h3>
                      <p className="text-xs text-gray-500">{city.country}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleStopClick(stop)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-2 text-xs text-gray-500">
                  <div className="flex items-center">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    <span>Arrival: {formatDate(stop.arrivalDate)}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    <span>Departure: {formatDate(stop.departureDate)}</span>
                  </div>
                  {stop.nights && (
                    <div className="mt-1">
                      <span>{stop.nights} night{stop.nights > 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>

                {stop.notes && (
                  <div className="mt-2 text-xs text-gray-600">
                    {stop.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Stop Modal */}
      {editingStop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-4 w-full max-w-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Stop</h3>
            {/* Add your edit form here */}
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setEditingStop(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStop(editingStop)}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 