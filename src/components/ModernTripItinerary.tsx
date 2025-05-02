import React, { useState, useEffect } from "react";
import { FormTrip, FormTripStop } from "@/types";
import TripItineraryItem from '@/components/TripItineraryItem';
import TransportScreen from '@/components/TransportScreen';
import { CustomTransportDetails } from '@/components/CustomTransportModal';
import { cities } from "@/lib/cities";
import { formatDate } from "@/lib/utils";
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  ClockIcon,
  PencilIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";

interface ModernTripItineraryProps {
  trip: FormTrip | null;
  onUpdateTrip?: (updatedTrip: FormTrip) => void;
  onSelectStop?: (index: number) => void;
  selectedStopIndex?: number;
}

export default function ModernTripItinerary({ 
  trip, 
  onUpdateTrip,
  onSelectStop,
  selectedStopIndex = -1
}: ModernTripItineraryProps) {
  const [editedTrip, setEditedTrip] = useState<FormTrip | null>(trip);
  const [showTransportModal, setShowTransportModal] = useState(false);
  const [selectedTransportIndex, setSelectedTransportIndex] = useState<number | null>(null);

  // Update editedTrip when trip changes
  useEffect(() => {
    setEditedTrip(trip);
  }, [trip]);

  if (!editedTrip) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select a trip to view its itinerary</p>
      </div>
    );
  }

  const handleStopSelect = (index: number) => {
    if (onSelectStop) {
      onSelectStop(index);
    }
  };

  const handleUpdateStop = (index: number, updatedStop: Partial<FormTripStop>) => {
    if (!editedTrip) return;

    const updatedStops = [...editedTrip.stops];
    updatedStops[index] = {
      ...updatedStops[index],
      ...updatedStop
    };

    const updatedTrip = {
      ...editedTrip,
      stops: updatedStops
    };

    setEditedTrip(updatedTrip);
    if (onUpdateTrip) {
      onUpdateTrip(updatedTrip);
    }
  };

  const handleTransportClick = (index: number) => {
    setSelectedTransportIndex(index);
    setShowTransportModal(true);
  };

  const handleTransportUpdate = (transportDetails: CustomTransportDetails) => {
    if (selectedTransportIndex === null || !editedTrip) return;
    
    const updatedStops = [...editedTrip.stops];
    updatedStops[selectedTransportIndex] = {
      ...updatedStops[selectedTransportIndex],
      customTransport: transportDetails
    };

    const updatedTrip = {
      ...editedTrip,
      stops: updatedStops
    };

    setEditedTrip(updatedTrip);
    if (onUpdateTrip) {
      onUpdateTrip(updatedTrip);
    }
    
    setShowTransportModal(false);
    setSelectedTransportIndex(null);
  };

  // Get the previous stop's city for transport selection
  const getFromCity = (index: number) => {
    if (!editedTrip || index <= 0) return null;
    const prevStopCityId = editedTrip.stops[index - 1].cityId;
    return cities.find(c => c.id === prevStopCityId) || null;
  };

  // Get stop date for transport
  const getStopDate = (index: number) => {
    if (!editedTrip || index <= 0) return "";
    return editedTrip.stops[index - 1].departureDate;
  };

  return (
    <div className="h-full overflow-auto bg-white rounded-lg shadow-sm">
      {/* Trip header */}
      <div className="p-4 border-b sticky top-0 bg-white z-10">
        <h1 className="text-xl font-semibold text-gray-900">{editedTrip.name}</h1>
        <div className="flex items-center text-sm text-gray-500 mt-2 space-x-4">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>{formatDate(editedTrip.startDate)} - {formatDate(editedTrip.endDate)}</span>
          </div>
          {editedTrip.travelers && (
            <div className="flex items-center">
              <UsersIcon className="h-4 w-4 mr-1" />
              <span>{editedTrip.travelers} travelers</span>
            </div>
          )}
        </div>
      </div>

      {/* Trip itinerary */}
      <div className="p-4">
        <div className="space-y-4">
          {editedTrip.stops.map((stop, index) => {
            const city = cities.find(c => c.id === stop.cityId);
            const isSelected = index === selectedStopIndex;
            const isLastStop = index === editedTrip.stops.length - 1;
            
            return (
              <TripItineraryItem
                key={`${stop.cityId}-${index}`}
                stop={stop}
                city={city}
                index={index}
                isSelected={isSelected}
                isLastStop={isLastStop}
                onSelect={() => handleStopSelect(index)}
                onUpdate={(updatedStop: Partial<FormTripStop>) => handleUpdateStop(index, updatedStop)}
                onTransportClick={() => handleTransportClick(index)}
              />
            );
          })}
        </div>
      </div>

      {/* Transport screen */}
      {showTransportModal && selectedTransportIndex !== null && (
        <TransportScreen
          isOpen={showTransportModal}
          onClose={() => setShowTransportModal(false)}
          onSave={handleTransportUpdate}
          initialData={editedTrip.stops[selectedTransportIndex].customTransport}
          fromCity={getFromCity(selectedTransportIndex)}
          toCity={cities.find(c => c.id === editedTrip.stops[selectedTransportIndex].cityId) || null}
          date={getStopDate(selectedTransportIndex)}
        />
      )}
    </div>
  );
} 