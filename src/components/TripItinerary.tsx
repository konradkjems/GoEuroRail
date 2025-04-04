import { formatDate } from "@/lib/utils";
import { Trip, TripStop, City } from "@/types";
import { 
  CalendarIcon, 
  MapPinIcon, 
  ArrowRightIcon, 
  PencilIcon, 
  TrashIcon, 
  ClockIcon,
  HomeIcon,
  UsersIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SunIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
  MinusIcon,
  ArrowsUpDownIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState, useEffect } from "react";
import { cities } from "@/lib/cities";

interface TripItineraryProps {
  trip: Trip | null;
  onDeleteTrip?: (id: string) => void;
  selectedStopIndex?: number;
  onSelectStop?: (index: number) => void;
  onUpdateTrip?: (updatedTrip: Trip) => void;
}

export default function TripItinerary({ 
  trip, 
  onDeleteTrip, 
  selectedStopIndex = -1,
  onSelectStop,
  onUpdateTrip
}: TripItineraryProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTrip, setEditedTrip] = useState<Trip | null>(null);
  const [showAddDestination, setShowAddDestination] = useState(false);
  const [newDestination, setNewDestination] = useState("");
  const [newDestinationInput, setNewDestinationInput] = useState("");

  useEffect(() => {
    setEditedTrip(trip);
  }, [trip]);
  
  // Handle delete trip
  const handleDeleteTrip = () => {
    if (!trip) return;
    
    if (confirm("Are you sure you want to delete this trip?") && onDeleteTrip) {
      onDeleteTrip(trip.id);
    }
  };

  // Save changes
  const handleSaveChanges = () => {
    if (editedTrip && onUpdateTrip) {
      onUpdateTrip(editedTrip);
      setIsEditing(false);
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    if (trip) {
      setEditedTrip(JSON.parse(JSON.stringify(trip)));
    }
    setIsEditing(false);
  };

  // Add new destination
  const handleAddDestination = () => {
    if (!editedTrip || !newDestination) return;
    
    const cityToAdd = cities.find(city => city.id === newDestination);
    if (!cityToAdd) return;
    
    const newStop: TripStop = {
      city: cityToAdd,
      arrivalDate: new Date(),
      departureDate: new Date(Date.now() + 86400000), // Next day
      nights: 1
    };
    
    setEditedTrip({
      ...editedTrip,
      stops: [...editedTrip.stops, newStop]
    });
    
    setShowAddDestination(false);
    setNewDestination("");
  };

  // Add new custom destination
  const handleAddCustomDestination = () => {
    if (!editedTrip || !newDestinationInput) return;
    
    const newCity: City = {
      id: `custom-${Date.now()}`,
      name: newDestinationInput,
      country: "Custom Destination",
      coordinates: { lat: 0, lng: 0 } // Default coordinates
    };
    
    const newStop: TripStop = {
      city: newCity,
      arrivalDate: new Date(),
      departureDate: new Date(Date.now() + 86400000), // Next day
      nights: 1
    };
    
    setEditedTrip({
      ...editedTrip,
      stops: [...editedTrip.stops, newStop]
    });
    
    setShowAddDestination(false);
    setNewDestinationInput("");
  };

  // Handle adding a destination after a specific stop
  const handleAddDestinationAfter = (index: number, cityId: string) => {
    if (!editedTrip) return;
    
    const cityToAdd = cities.find(city => city.id === cityId);
    if (!cityToAdd) return;
    
    // Get the current stop and next stop (if any)
    const currentStop = editedTrip.stops[index];
    const nextStop = editedTrip.stops[index + 1];
    
    // Calculate arrival and departure dates
    const arrivalDate = currentStop.departureDate 
      ? new Date(currentStop.departureDate)
      : new Date(); // Default to current date if no departure date
      
    const departureDate = nextStop?.arrivalDate 
      ? new Date(nextStop.arrivalDate)
      : new Date(arrivalDate.getTime() + 86400000); // Next day if no next stop
    
    const newStop: TripStop = {
      city: cityToAdd,
      arrivalDate,
      departureDate,
      nights: 1
    };
    
    // Insert the new stop after the current index
    const updatedStops = [...editedTrip.stops];
    updatedStops.splice(index + 1, 0, newStop);
    
    const updatedTrip = {
      ...editedTrip,
      stops: updatedStops
    };
    
    setEditedTrip(updatedTrip);
    if (onUpdateTrip) {
      onUpdateTrip(updatedTrip);
    }
  };

  // Handle updating a stop
  const handleUpdateStop = (index: number, updatedStop: TripStop) => {
    if (!editedTrip) return;
    
    const updatedStops = [...editedTrip.stops];
    updatedStops[index] = updatedStop;

    // Update subsequent stops' dates based on the change
    for (let i = index + 1; i < updatedStops.length; i++) {
      const previousStop = updatedStops[i - 1];
      const currentStop = updatedStops[i];
      
      // Calculate new arrival date based on previous stop's departure
      const newArrivalDate = new Date(previousStop.arrivalDate!);
      newArrivalDate.setDate(newArrivalDate.getDate() + previousStop.nights);
      
      // Calculate new departure date based on current stop's nights
      const newDepartureDate = new Date(newArrivalDate);
      newDepartureDate.setDate(newDepartureDate.getDate() + currentStop.nights);
      
      updatedStops[i] = {
        ...currentStop,
        arrivalDate: newArrivalDate,
        departureDate: newDepartureDate
      };
    }

    // Calculate new end date based on last stop
    const lastStop = updatedStops[updatedStops.length - 1];
    const newEndDate = new Date(lastStop.arrivalDate!);
    newEndDate.setDate(newEndDate.getDate() + lastStop.nights);
    
    const updatedTrip = {
      ...editedTrip,
      stops: updatedStops,
      endDate: newEndDate
    };
    
    setEditedTrip(updatedTrip);
    if (onUpdateTrip) {
      onUpdateTrip(updatedTrip);
    }
  };

  // Handle removing a stop
  const handleRemoveStop = (index: number) => {
    if (!editedTrip) return;
    
    const updatedStops = editedTrip.stops.filter((_, i) => i !== index);

    // Update dates for all stops after the removed stop
    for (let i = index; i < updatedStops.length; i++) {
      const previousStop = updatedStops[i - 1];
      const currentStop = updatedStops[i];
      
      // If this is the first stop after removal, use the previous stop's dates
      if (i === index && previousStop) {
        const newArrivalDate = new Date(previousStop.arrivalDate!);
        newArrivalDate.setDate(newArrivalDate.getDate() + previousStop.nights);
        
        const newDepartureDate = new Date(newArrivalDate);
        newDepartureDate.setDate(newDepartureDate.getDate() + currentStop.nights);
        
        updatedStops[i] = {
          ...currentStop,
          arrivalDate: newArrivalDate,
          departureDate: newDepartureDate
        };
      }
      // For subsequent stops, calculate based on the previous stop
      else if (i > index) {
        const newArrivalDate = new Date(previousStop.arrivalDate!);
        newArrivalDate.setDate(newArrivalDate.getDate() + previousStop.nights);
        
        const newDepartureDate = new Date(newArrivalDate);
        newDepartureDate.setDate(newDepartureDate.getDate() + currentStop.nights);
        
        updatedStops[i] = {
          ...currentStop,
          arrivalDate: newArrivalDate,
          departureDate: newDepartureDate
        };
      }
    }

    // Calculate new end date based on last stop
    const lastStop = updatedStops[updatedStops.length - 1];
    const newEndDate = lastStop ? new Date(lastStop.arrivalDate!) : editedTrip.startDate;
    if (lastStop) {
      newEndDate.setDate(newEndDate.getDate() + lastStop.nights);
    }
    
    const updatedTrip = {
      ...editedTrip,
      stops: updatedStops,
      endDate: newEndDate
    };
    
    setEditedTrip(updatedTrip);
    if (onUpdateTrip) {
      onUpdateTrip(updatedTrip);
    }
  };

  // Handle moving a stop up or down
  const handleMoveStop = (index: number, direction: 'up' | 'down') => {
    if (!editedTrip) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= editedTrip.stops.length) return;
    
    const updatedStops = [...editedTrip.stops];
    const temp = updatedStops[index];
    updatedStops[index] = updatedStops[newIndex];
    updatedStops[newIndex] = temp;

    // Update dates for all stops after the moved ones
    for (let i = Math.min(index, newIndex); i < updatedStops.length; i++) {
      const previousStop = updatedStops[i - 1];
      const currentStop = updatedStops[i];
      
      if (i === 0) {
        // First stop uses trip start date
        currentStop.arrivalDate = editedTrip.startDate;
        currentStop.departureDate = new Date(new Date(currentStop.arrivalDate).getTime() + (currentStop.nights * 24 * 60 * 60 * 1000));
      } else {
        // Calculate based on previous stop
        currentStop.arrivalDate = new Date(new Date(previousStop.arrivalDate!).getTime() + (previousStop.nights * 24 * 60 * 60 * 1000));
        currentStop.departureDate = new Date(new Date(currentStop.arrivalDate).getTime() + (currentStop.nights * 24 * 60 * 60 * 1000));
      }
    }

    // Calculate new end date based on last stop
    const lastStop = updatedStops[updatedStops.length - 1];
    const newEndDate = new Date(new Date(lastStop.arrivalDate!).getTime() + (lastStop.nights * 24 * 60 * 60 * 1000));
    
    const updatedTrip = {
      ...editedTrip,
      stops: updatedStops,
      endDate: newEndDate
    };
    
    setEditedTrip(updatedTrip);
    if (onUpdateTrip) {
      onUpdateTrip(updatedTrip);
    }
  };

  // If no trip is selected
  if (!trip) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white p-8">
        <div className="text-center">
          <MapPinIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Trip Selected</h2>
          <p className="text-gray-500 mb-6">Select an existing trip or create a new one</p>
          <Link
            href="/trips/new"
            className="inline-flex items-center px-4 py-2 bg-[#FFD166] text-[#264653] rounded-md hover:bg-[#FFC233] font-medium"
          >
            Create New Trip
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white h-full flex flex-col">
      {/* Trip header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-start">
          {isEditing ? (
            <input
              type="text"
              value={editedTrip?.name || ""}
              onChange={(e) => editedTrip && setEditedTrip({...editedTrip, name: e.target.value})}
              className="text-xl font-bold text-[#264653] border-b border-[#FFD166] focus:outline-none"
            />
          ) : (
            <h1 className="text-xl font-bold text-[#264653]">{trip.name}</h1>
          )}
          
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button 
                  onClick={handleSaveChanges}
                  className="text-[#06D6A0] hover:text-[#05C090]"
                  aria-label="Save changes"
                >
                  <CheckIcon className="h-5 w-5" />
                </button>
                <button 
                  onClick={handleCancelEdit}
                  className="text-[#F94144] hover:text-[#E53E41]"
                  aria-label="Cancel edit"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-[#264653] hover:text-[#06D6A0]"
                  aria-label="Edit trip"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button 
                  onClick={handleDeleteTrip}
                  className="text-[#264653] hover:text-[#F94144]"
                  aria-label="Delete trip"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center text-sm text-[#264653] mt-2">
          <CalendarIcon className="h-4 w-4 mr-1 flex-shrink-0" />
          <span>
            {formatDate(trip.startDate)} to {formatDate(trip.endDate)}
          </span>
          {trip.travelers && trip.travelers > 0 && (
            <div className="flex items-center ml-4">
              <UsersIcon className="h-4 w-4 mr-1 flex-shrink-0" />
              <span>{trip.travelers} {trip.travelers === 1 ? 'person' : 'people'}</span>
            </div>
          )}
        </div>
        
        {isEditing ? (
          <textarea
            value={editedTrip?.notes || ""}
            onChange={(e) => editedTrip && setEditedTrip({...editedTrip, notes: e.target.value})}
            placeholder="Add notes about your trip..."
            className="mt-2 text-sm text-[#264653] w-full border border-gray-200 rounded p-2"
            rows={2}
          />
        ) : (
          trip.notes && <p className="mt-2 text-sm text-[#264653]">{trip.notes}</p>
        )}
      </div>

      {/* Trip itinerary */}
      <div className="p-4 bg-[#FAF3E0]">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-lg font-medium text-[#264653]">Trip Itinerary</h2>
          <span className="text-sm text-[#264653]">{trip.stops.length} stops</span>
        </div>
      </div>

      {/* Trip stops */}
      <div className="flex-1 overflow-auto">
        {trip.stops.length > 0 ? (
          <div>
            {(isEditing ? editedTrip?.stops ?? [] : trip.stops).map((stop, index) => (
              <StopCard 
                key={`${stop.city.id}-${index}`}
                stop={stop}
                index={index}
                isSelected={index === selectedStopIndex}
                onClick={() => onSelectStop && onSelectStop(index)}
                isLastStop={index === trip.stops.length - 1}
                isEditing={isEditing}
                onRemove={() => handleRemoveStop(index)}
                onUpdate={(updatedStop) => handleUpdateStop(index, updatedStop)}
                onAddDestinationAfter={handleAddDestinationAfter}
                onMove={handleMoveStop}
                editedTrip={editedTrip}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-[#264653]">No stops added to this trip yet</p>
            <button
              onClick={() => setShowAddDestination(true)}
              className="inline-flex items-center mt-4 px-4 py-2 text-sm text-[#06D6A0]"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Stops
            </button>
          </div>
        )}
        
        {/* Add Destination Section */}
        {showAddDestination && (
          <div className="p-4 bg-[#FAF3E0] border-t border-gray-200">
            <h3 className="font-medium text-[#264653] mb-2">Add New Destination</h3>
            <div className="space-y-2">
            <div className="flex space-x-2">
              <select
                value={newDestination}
                onChange={(e) => setNewDestination(e.target.value)}
                className="flex-1 rounded border border-gray-200 p-2"
              >
                <option value="">Select a city</option>
                  {cities
                    .filter(city => !editedTrip?.stops.some(stop => stop.city.id === city.id))
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(city => (
                  <option key={city.id} value={city.id}>
                    {city.name}, {city.country}
                  </option>
                ))}
              </select>
              <button
                  onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    if (handleAddDestinationAfter) {
                      handleAddDestinationAfter(-1, newDestination);
                      setShowAddDestination(false);
                      setNewDestination("");
                    }
                  }}
                disabled={!newDestination}
                className="bg-[#06D6A0] text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddDestination(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex-1 border-t border-gray-300 my-2">
                  <span className="bg-white px-2 text-sm text-gray-500">or</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newDestinationInput}
                  onChange={(e) => setNewDestinationInput(e.target.value)}
                  placeholder="Type a custom destination"
                  className="flex-1 rounded border border-gray-200 p-2"
                />
                <button
                  onClick={() => handleAddCustomDestination()}
                  disabled={!newDestinationInput}
                  className="bg-[#06D6A0] text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Add Destination Button at Bottom */}
        {trip.stops.length > 0 && !showAddDestination && (
          <div className="p-4 border-t border-gray-200 flex justify-center">
            <button
              onClick={() => setShowAddDestination(true)}
              className="flex items-center text-[#06D6A0] hover:text-[#05C090]"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              <span>Add New Destination</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="p-3 bg-[#FAF3E0] border-t border-gray-200">
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={isEditing ? handleSaveChanges : () => setIsEditing(true)}
            className="flex justify-center items-center py-2 bg-[#FFD166] text-[#264653] rounded text-sm font-medium hover:bg-[#FFC233]"
          >
            {isEditing ? "Save Changes" : "Edit Trip"}
          </button>
          <button className="flex justify-center items-center py-2 bg-white border border-gray-300 rounded text-sm font-medium text-[#264653] hover:bg-gray-50">
            Share
          </button>
        </div>
        <div className="flex justify-center mt-2 text-xs text-[#264653]">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-[#06D6A0] mr-1"></span>
            <span>Autosave</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Individual stop card component
interface StopCardProps {
  stop: TripStop;
  index: number;
  isSelected?: boolean;
  onClick?: () => void;
  isLastStop?: boolean;
  isEditing?: boolean;
  onRemove?: () => void;
  onUpdate?: (updatedStop: TripStop) => void;
  onAddDestinationAfter?: (index: number, cityId: string) => void;
  onMove?: (index: number, direction: 'up' | 'down') => void;
  editedTrip?: Trip | null;
}

function StopCard({ 
  stop, 
  index, 
  isSelected = false, 
  onClick, 
  isLastStop = false,
  isEditing = false,
  onRemove,
  onUpdate,
  onAddDestinationAfter,
  onMove,
  editedTrip
}: StopCardProps) {
  const [showHostels, setShowHostels] = useState(false);
  const [editedCityName, setEditedCityName] = useState(stop.city.name);
  const [editedNights, setEditedNights] = useState(stop.nights || 0);
  const [showAddDestination, setShowAddDestination] = useState(false);
  const [newDestination, setNewDestination] = useState("");

  // Handle nights adjustment
  const handleNightsChange = (delta: number) => {
    const newNights = Math.max(0, editedNights + delta);
    setEditedNights(newNights);
    if (onUpdate) {
      onUpdate({
        ...stop,
        nights: newNights,
        departureDate: new Date(new Date(stop.arrivalDate!).getTime() + (newNights * 24 * 60 * 60 * 1000))
      });
    }
  };
  
  // Dummy data for the reference design
  const hostels = [
    { name: "AdHoc Hostel", rating: 9.4, price: "€32" },
    { name: "Hostel Celica", rating: 9.3, price: "€29" },
    { name: "Party Hostel ZZZ", rating: 7.9, price: "€31" },
    { name: "Aladin hostel", rating: 8.8, price: "€28" },
    { name: "Hostel Vrba", rating: 8.5, price: "€35" },
  ];
  
  // Determine what kind of stop it is
  const isStartStop = index === 0;
  const isStopover = !isStartStop && !isLastStop && (stop.nights === 0 || !stop.nights);
  
  return (
    <div className="border-b border-gray-200">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center">
              <h3 className="font-medium text-[#264653]">{stop.city.name}</h3>
              {isEditing && (
                <button 
                  onClick={onRemove}
                  className="ml-2 text-[#F94144] hover:text-[#E53E41] p-1 rounded-full hover:bg-red-50"
                  title="Remove stop"
                >
                  <TrashIcon className="h-4 w-4" />
              </button>
              )}
            </div>
            
            {/* Date information */}
            {stop.arrivalDate && (
              <div className="text-sm text-[#264653]/70 mt-1">
                {formatDate(stop.arrivalDate)} - {formatDate(new Date(new Date(stop.arrivalDate).getTime() + (stop.nights * 24 * 60 * 60 * 1000)))}
              </div>
            )}
          </div>
          
          {/* Nights controls - always visible */}
          <div className="flex items-center space-x-2 bg-[#FAF3E0] p-2 rounded-lg">
            <button
              onClick={() => handleNightsChange(-1)}
              className="text-[#264653] hover:text-[#06D6A0] p-1.5 rounded-full border border-gray-200 hover:border-[#06D6A0] hover:bg-white transition-colors"
              title="Decrease nights"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            <div className="min-w-[80px] text-center">
              <div className="font-medium text-[#264653]">{editedNights}</div>
              <div className="text-xs text-[#264653]/70">nights</div>
            </div>
            <button
              onClick={() => handleNightsChange(1)}
              className="text-[#264653] hover:text-[#06D6A0] p-1.5 rounded-full border border-gray-200 hover:border-[#06D6A0] hover:bg-white transition-colors"
              title="Increase nights"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Hostel section for stays */}
      {stop.nights > 0 && (
        <div className="bg-[#FAF3E0] border-t border-gray-200">
          <div 
            className="px-4 py-2 flex justify-between items-center cursor-pointer hover:bg-[#FAF3E0]/80"
            onClick={() => setShowHostels(!showHostels)}
          >
            <span className="font-medium text-sm text-[#264653]">Hostels in {stop.city.name}</span>
            {showHostels ? (
              <ChevronUpIcon className="h-4 w-4 text-[#264653]" />
            ) : (
              <ChevronDownIcon className="h-4 w-4 text-[#264653]" />
            )}
          </div>
          
          {showHostels && (
            <div className="p-2 space-y-2">
              {hostels.map((hostel, i) => (
                <div key={i} className="flex justify-between items-center p-2 text-sm">
                  <div>
                    <div className={i === 0 ? "text-[#06D6A0] font-medium" : "text-[#264653]"}>
                      {hostel.name}
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs font-medium bg-[#06D6A0]/20 text-[#06D6A0] px-1 rounded">
                        {hostel.rating}
                      </span>
                      <span className="text-xs text-[#264653]/70 ml-1">
                        from {hostel.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-right px-2">
                <Link href="#" className="text-[#06D6A0] text-xs">
                  See all 21 hostels
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Train information for continuing the journey */}
      {!isLastStop && (
        <div className="border-t border-gray-200 flex items-stretch">
          <div className="flex-none p-2 flex flex-col items-center justify-center space-y-2">
            <button 
              onClick={() => setShowAddDestination(true)}
              className="w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center text-[#264653] hover:bg-[#FAF3E0] hover:border-[#06D6A0] hover:text-[#06D6A0] transition-colors"
              title="Add destination after this stop"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
            <div className="flex flex-col space-y-1">
              <button
                onClick={() => onMove && onMove(index, 'up')}
                disabled={index === 0}
                className={`w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center text-[#264653] transition-colors ${
                  index === 0 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-[#FAF3E0] hover:border-[#FFD166] hover:text-[#FFD166]'
                }`}
                title="Move stop up"
              >
                <ChevronUpIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => onMove && onMove(index, 'down')}
                disabled={isLastStop}
                className={`w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center text-[#264653] transition-colors ${
                  isLastStop 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-[#FAF3E0] hover:border-[#FFD166] hover:text-[#FFD166]'
                }`}
                title="Move stop down"
              >
                <ChevronDownIcon className="h-4 w-4" />
            </button>
          </div>
          </div>
          <div className="grow flex items-center bg-[#FFD166]/30 p-2">
            <SunIcon className="h-6 w-6 text-[#FFD166] mr-2" />
            <div className="flex-1">
              <div className="font-medium text-[#264653]">~10h 10m</div>
              <div className="text-sm text-[#264653]">View trains</div>
            </div>
          </div>
          <div className="flex-none bg-[#FAF3E0] p-2 flex items-center justify-center">
            <div className="w-12 h-6 bg-gray-200 rounded-full flex items-center justify-end p-1 cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      )}

      {/* Add Destination Section */}
      {showAddDestination && (
        <div className="p-4 bg-[#FAF3E0] border-t border-gray-200">
          <h3 className="font-medium text-[#264653] mb-2">Add New Destination</h3>
          <div className="space-y-2">
            <div className="flex space-x-2">
              <select
                value={newDestination}
                onChange={(e) => setNewDestination(e.target.value)}
                className="flex-1 rounded border border-gray-200 p-2"
              >
                <option value="">Select a city</option>
                {cities
                  .filter(city => !editedTrip?.stops.some(stop => stop.city.id === city.id))
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(city => (
                    <option key={city.id} value={city.id}>
                      {city.name}, {city.country}
                    </option>
                  ))}
              </select>
              <button
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  if (onAddDestinationAfter) {
                    onAddDestinationAfter(index, newDestination);
                    setShowAddDestination(false);
                    setNewDestination("");
                  }
                }}
                disabled={!newDestination}
                className="bg-[#06D6A0] text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddDestination(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 