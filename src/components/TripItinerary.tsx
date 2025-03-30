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
  XMarkIcon
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

  // Sync with prop changes
  useEffect(() => {
    if (trip) {
      setEditedTrip(JSON.parse(JSON.stringify(trip)));
    }
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
      arrivalDate: new Date().toISOString(),
      departureDate: new Date(Date.now() + 86400000).toISOString(), // Next day
      nights: 1
    };
    
    setEditedTrip({
      ...editedTrip,
      stops: [...editedTrip.stops, newStop]
    });
    
    setShowAddDestination(false);
    setNewDestination("");
  };

  // Remove a stop
  const handleRemoveStop = (index: number) => {
    if (!editedTrip) return;
    
    const updatedStops = [...editedTrip.stops];
    updatedStops.splice(index, 1);
    
    setEditedTrip({
      ...editedTrip,
      stops: updatedStops
    });
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
          {trip.travelers > 0 && (
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
            {(isEditing ? editedTrip?.stops : trip.stops).map((stop, index) => (
              <StopCard 
                key={`${stop.city.id}-${index}`}
                stop={stop}
                index={index}
                isSelected={index === selectedStopIndex}
                onClick={() => onSelectStop && onSelectStop(index)}
                isLastStop={index === trip.stops.length - 1}
                isEditing={isEditing}
                onRemove={isEditing ? () => handleRemoveStop(index) : undefined}
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
            <div className="flex space-x-2">
              <select
                value={newDestination}
                onChange={(e) => setNewDestination(e.target.value)}
                className="flex-1 rounded border border-gray-200 p-2"
              >
                <option value="">Select a city</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id}>
                    {city.name}, {city.country}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddDestination}
                disabled={!newDestination}
                className="bg-[#06D6A0] text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddDestination(false)}
                className="bg-[#F94144] text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
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
}

function StopCard({ stop, index, isSelected = false, onClick, isLastStop = false }: StopCardProps) {
  const [showHostels, setShowHostels] = useState(false);
  
  // Dummy data for the reference design
  const hostels = [
    { name: "AdHoc Hostel", rating: 9.4, price: "€32" },
    { name: "Hostel Celica", rating: 9.3, price: "€29" },
    { name: "Party Hostel ZZZ", rating: 7.9, price: "€31" },
    { name: "Aladin hostel", rating: 8.8, price: "€28" },
    { name: "Hostel Vrba", rating: 8.5, price: "€35" },
  ];
  
  const otherUsers = index === 0 ? 52 : index === 1 ? 3 : index === 2 ? 6 : index === 3 ? 47 : 0;
  
  // Determine what kind of stop it is
  const isStartStop = index === 0;
  const isStopover = !isStartStop && !isLastStop && (stop.nights === 0 || !stop.nights);
  
  // Travel time to next stop (dummy data for reference)
  const travelTime = index === 0 ? "~6h 0m" : index === 1 ? "~2h 55m" : index === 2 ? "No estimate" : "~1h 15m";
  
  return (
    <div className="border-b border-gray-200">
      {/* Stop header */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <h3 className="font-medium text-[#264653]">{stop.city.name}</h3>
              <button className="ml-1">
                <PencilIcon className="h-3 w-3 text-[#06D6A0]" />
              </button>
            </div>
            
            <div className="text-sm text-[#264653] mt-1">
              {isStartStop && <div>Start</div>}
              {isStopover && <div>Stopover</div>}
              {stop.nights > 0 && <div>{stop.nights} night(s)</div>}
              {stop.departureDate && <div className="text-xs text-[#264653]/70">
                {index > 0 && stop.arrivalDate && (
                  <span>Fri {formatDate(stop.arrivalDate).split(' ')[0]} - </span>
                )}
                {stop.departureDate && <span>Tue {formatDate(stop.departureDate).split(' ')[0]}</span>}
              </div>}
            </div>
          </div>
          
          {stop.nights > 0 && (
            <Link
              href="#"
              className="px-3 py-1 bg-[#FFD166] text-[#264653] text-xs rounded hover:bg-[#FFC233] font-medium"
            >
              Book stay
            </Link>
          )}
        </div>
        
        {/* User count for this stop */}
        {otherUsers > 0 && (
          <div className="mt-3 flex items-center text-sm text-[#264653]">
            <div className="flex -space-x-2 mr-2">
              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                {index % 2 === 0 ? "+1" : "+2"}
              </div>
              <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-xs text-white">
                {index % 2 === 0 ? "+2" : "+1"}
              </div>
            </div>
            <span className="text-xs">{otherUsers} others in {stop.city.name} at this time</span>
          </div>
        )}
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
          <div className="flex-none p-2 flex flex-col items-center justify-center">
            <button className="w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center text-[#264653] hover:bg-[#FAF3E0]">
              +
            </button>
          </div>
          <div className="flex-none p-2 flex flex-col items-center justify-center">
            <button className="w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center text-[#264653] hover:bg-[#FAF3E0]">
              ↻
            </button>
          </div>
          <div className="grow flex items-center bg-[#FFD166]/30 p-2">
            <SunIcon className="h-6 w-6 text-[#FFD166] mr-2" />
            <div className="flex-1">
              <div className="font-medium text-[#264653]">{travelTime}</div>
              <div className="text-sm text-[#264653]">View trains</div>
            </div>
          </div>
          <div className="flex-none bg-[#FAF3E0] p-2 flex items-center justify-center">
            <div className="w-12 h-6 bg-gray-200 rounded-full flex items-center justify-end p-1 cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="flex-none bg-[#FAF3E0] p-2 flex items-center justify-center text-[#264653]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
} 