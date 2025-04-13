import React, { useState, useEffect } from 'react';
import { FormTrip, FormTripStop } from '@/types';
import TripItineraryItem from './TripItineraryItem';
import TransportModal from './TransportModal';
import { cities } from '@/lib/cities';
import { 
  PlusIcon, 
  CheckIcon, 
  ShareIcon, 
  DocumentDuplicateIcon,
  ChevronDownIcon,
  MoonIcon,
  UserGroupIcon,
  TrashIcon,
  PlusCircleIcon, 
  MinusCircleIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

interface ModernTripItineraryProps {
  trip: FormTrip | null;
  onUpdateTrip?: (updatedTrip: FormTrip) => void;
}

export default function ModernTripItinerary({ trip, onUpdateTrip }: ModernTripItineraryProps) {
  const [editedTrip, setEditedTrip] = useState<FormTrip | null>(trip);
  const [showNotes, setShowNotes] = useState(false);
  const [transportModalIndex, setTransportModalIndex] = useState<number | null>(null);
  
  // Update internal state when trip prop changes
  useEffect(() => {
    setEditedTrip(trip);
  }, [trip]);
  
  // If there's no trip or no edited trip, return null
  if (!editedTrip) return null;
  
  const handleAddDestination = () => {
    // Placeholder for adding a new destination
    alert('Add destination functionality not implemented yet');
  };
  
  const handleUpdateStop = (index: number, updatedStop: Partial<FormTripStop>) => {
    if (!editedTrip) return;
    
    // Create a copy of the stops array
    const newStops = [...editedTrip.stops];
    
    // Get the original stop
    const originalStop = newStops[index];
    
    // Handle stopover conversion
    if (updatedStop.isStopover !== undefined) {
      // If changing to stopover, ensure dates are the same
      if (updatedStop.isStopover === true) {
        const arrivalDate = originalStop.arrivalDate;
        updatedStop.departureDate = arrivalDate;
      } 
      // If converting from stopover to regular stop, set departure date to arrival date + nights
      else if (originalStop.isStopover === true && updatedStop.isStopover === false) {
        const arrivalDate = new Date(originalStop.arrivalDate);
        const departureDate = new Date(arrivalDate);
        departureDate.setDate(departureDate.getDate() + (updatedStop.nights || 1));
        updatedStop.departureDate = departureDate.toISOString().split('T')[0];
      }
    }
    
    // Update the specific stop with the new data
    newStops[index] = { ...newStops[index], ...updatedStop };
    
    // Create the updated trip
    const updatedTrip = { ...editedTrip, stops: newStops };
    
    // Update internal state
    setEditedTrip(updatedTrip);
    
    // Call external handler if provided
    if (onUpdateTrip) {
      onUpdateTrip(updatedTrip);
    }
  };
  
  const handleDeleteStop = (index: number) => {
    if (!editedTrip || !editedTrip.stops) return;
    
    if (editedTrip.stops.length <= 1) {
      alert('Cannot delete the only stop in the trip.');
      return;
    }
    
    // Create a copy of the stops array without the deleted stop
    const newStops = [...editedTrip.stops];
    newStops.splice(index, 1);
    
    // Create the updated trip
    const updatedTrip = { ...editedTrip, stops: newStops };
    
    // Update internal state
    setEditedTrip(updatedTrip);
    
    // Call external handler if provided
    if (onUpdateTrip) {
      onUpdateTrip(updatedTrip);
    }
  };
  
  const handleOpenTransportModal = (index: number) => {
    setTransportModalIndex(index);
  };
  
  const handleCloseTransportModal = () => {
    setTransportModalIndex(null);
  };
  
  const handleUpdateTransport = (updatedStop: Partial<FormTripStop>) => {
    if (transportModalIndex === null || !editedTrip) return;
    
    handleUpdateStop(transportModalIndex, updatedStop);
    handleCloseTransportModal();
  };
  
  const handleToggleSleeping = (index: number) => {
    // Just a placeholder for now - would toggle accommodation options
    alert(`Toggle sleeping for stop ${index + 1}`);
  };
  
  const handleToggleDiscover = (index: number) => {
    // Just a placeholder for now - would toggle discover options
    alert(`Toggle discover for stop ${index + 1}`);
  };
  
  // Helper function to format date safely
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    } catch (error) {
      return 'Invalid Date';
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#333333]">{editedTrip.name}</h1>
          <div className="flex items-center text-[#5F6368] text-sm gap-2">
            <span>{formatDate(editedTrip.startDate)} - {formatDate(editedTrip.endDate)}</span>
            <span>•</span>
            <div className="flex items-center">
              <UserGroupIcon className="h-4 w-4 mr-1" />
              <span>{editedTrip.travelers || 1}</span>
            </div>
            <span>•</span>
            <div className="flex items-center">
              <MoonIcon className="h-4 w-4 mr-1" />
              <span>{editedTrip.stops.reduce((total, stop) => total + stop.nights, 0)} nights</span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button className="p-2 text-[#5F6368] hover:text-[#333333] rounded-full hover:bg-gray-100">
            <ShareIcon className="h-5 w-5" />
          </button>
          <button className="p-2 text-[#5F6368] hover:text-[#333333] rounded-full hover:bg-gray-100">
            <DocumentDuplicateIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="p-4 border-b flex space-x-6">
        <button className="text-[#333333] font-medium border-b-2 border-[#06D6A0] pb-2">
          Destinations
        </button>
        <button className="text-[#5F6368] hover:text-[#333333] pb-2">
          Day by day
        </button>
      </div>
      
      {/* Notes toggle */}
      <div className="px-4 py-2 border-b flex justify-between items-center bg-[#F8F9FA]">
        <button 
          className="flex items-center space-x-2 text-[#5F6368] text-sm"
          onClick={() => setShowNotes(!showNotes)}
        >
          <span>Show notes</span>
          <ChevronDownIcon className={`h-4 w-4 transform ${showNotes ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      {/* Header row */}
      <div className="grid grid-cols-12 px-4 py-3 border-b bg-[#F8F9FA] text-[#5F6368] text-sm font-medium">
        <div className="col-span-1"></div>
        <div className="col-span-3">DESTINATION</div>
        <div className="col-span-2 text-center">NIGHTS</div>
        <div className="col-span-2 text-right">SLEEPING</div>
        <div className="col-span-2 text-right">DISCOVER</div>
        <div className="col-span-2 text-center">TRANSPORT</div>
        <div className="col-span-1 text-center"></div>
      </div>
      
      {/* Itinerary items */}
      <div className="overflow-auto flex-1">
        {editedTrip.stops.map((stop, index) => (
          <div key={`${stop.cityId}-${index}`}>
            <TripItineraryItem
              stop={stop}
              index={index}
              isLastStop={index === editedTrip.stops.length - 1}
              onUpdate={handleUpdateStop}
              onOpenTransportModal={handleOpenTransportModal}
              onToggleSleeping={handleToggleSleeping}
              onToggleDiscover={handleToggleDiscover}
              onDelete={() => handleDeleteStop(index)}
            />
            
            {/* Notes section */}
            {showNotes && (
              <div className="px-4 py-2 bg-[#F8F9FA] text-sm border-b">
                <div className="flex items-start space-x-3">
                  <div className="w-10"></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-medium text-[#333333]">Notes</h4>
                      <button className="text-[#06D6A0] hover:text-[#05b487] p-1" title="Edit notes">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="bg-white p-3 border border-gray-200 rounded min-h-[60px] text-[#333333]">
                      {stop.notes || <span className="text-gray-400">No notes added</span>}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {/* Add new destination */}
        <div className="p-4 flex justify-start pl-16">
          <button 
            onClick={handleAddDestination}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-full text-[#5F6368] hover:bg-[#F8F9FA] hover:text-[#333333]"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add new destination...</span>
          </button>
        </div>
      </div>
      
      {/* Transport Modal */}
      {transportModalIndex !== null && editedTrip.stops[transportModalIndex] && (
        <div className="fixed inset-0 z-[9998]">
          <TransportModal
            fromCity={transportModalIndex > 0 
              ? cities.find(c => c.id === editedTrip.stops[transportModalIndex - 1].cityId)?.name || ''
              : 'Starting point'
            }
            toCity={cities.find(c => c.id === editedTrip.stops[transportModalIndex].cityId)?.name || ''}
            stop={editedTrip.stops[transportModalIndex]}
            date={editedTrip.stops[transportModalIndex].arrivalDate}
            onClose={handleCloseTransportModal}
            onUpdate={handleUpdateTransport}
          />
        </div>
      )}
    </div>
  );
} 