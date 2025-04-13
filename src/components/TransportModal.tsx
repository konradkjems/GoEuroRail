import React, { useState, useEffect } from 'react';
import { XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";
import { FormTripStop } from '@/types';

interface TransportModalProps {
  fromCity: string;
  toCity: string;
  stop: FormTripStop;
  date: string;
  onClose: () => void;
  onUpdate: (updatedStop: Partial<FormTripStop>) => void;
}

export default function TransportModal({ 
  fromCity, 
  toCity, 
  stop, 
  date, 
  onClose, 
  onUpdate 
}: TransportModalProps) {
  // Initialize state with current values or defaults
  const [transportType, setTransportType] = useState<'train' | 'bus' | 'flight'>('train');
  const [departureTime, setDepartureTime] = useState('00:00');
  const [arrivalTime, setArrivalTime] = useState('00:00');
  const [isOvernightTransport, setIsOvernightTransport] = useState(false);
  const [notes, setNotes] = useState(stop.notes || '');
  const [departureStation, setDepartureStation] = useState('');
  const [arrivalStation, setArrivalStation] = useState('');
  const [bookingNumber, setBookingNumber] = useState('');
  const [track, setTrack] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [operator, setOperator] = useState('');
  const [seatNumber, setSeatNumber] = useState('');
  
  // Set transport type based on existing data
  useEffect(() => {
    // If we have train details, set train as type
    if (stop.trainDetails) {
      setTransportType('train');
      
      // Extract departure and arrival times from existing data if available
      if (stop.trainDetails) {
        // Set other values if they exist
        // Assume these are saved in the notes field in a structured format
        // or could be in a dedicated field in a real app
      }
    }
  }, [stop]);
  
  const handleSave = () => {
    // Create the updated stop object
    const updatedStop: Partial<FormTripStop> = {
      notes,
      trainDetails: transportType === 'train' ? {
        trainNumber: vehicleNumber,
        duration: "2h 30m", // This would be calculated based on departure and arrival times
        changes: 0,
        // Add other train-specific details
      } : undefined,
      // We could add bus or flight details in a similar way
    };
    
    onUpdate(updatedStop);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h2 className="text-xl font-medium text-gray-800">
              {fromCity} <span className="text-gray-400">to</span> {toCity}
            </h2>
            <p className="text-gray-500 text-sm">{date}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        
        {/* Transport type selection */}
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 text-sm rounded-md flex items-center ${
                transportType === 'train' 
                  ? 'bg-[#06D6A0] text-white' 
                  : 'bg-white border border-gray-300 text-gray-700'
              }`}
              onClick={() => setTransportType('train')}
            >
              <span className="mr-2">🚆</span>
              TRAIN
            </button>
            <button
              className={`px-4 py-2 text-sm rounded-md flex items-center ${
                transportType === 'bus' 
                  ? 'bg-[#06D6A0] text-white' 
                  : 'bg-white border border-gray-300 text-gray-700'
              }`}
              onClick={() => setTransportType('bus')}
            >
              <span className="mr-2">🚌</span>
              BUS
            </button>
            <button
              className={`px-4 py-2 text-sm rounded-md flex items-center ${
                transportType === 'flight' 
                  ? 'bg-[#06D6A0] text-white' 
                  : 'bg-white border border-gray-300 text-gray-700'
              }`}
              onClick={() => setTransportType('flight')}
            >
              <span className="mr-2">✈️</span>
              FLIGHT
            </button>
          </div>
        </div>
        
        {/* Main form content */}
        <div className="p-6 space-y-6">
          {/* Departure and arrival times */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departure time
              </label>
              <input
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#06D6A0] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Arrival time
              </label>
              <input
                type="time"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#06D6A0] focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Overnight transport toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="overnight"
              checked={isOvernightTransport}
              onChange={(e) => setIsOvernightTransport(e.target.checked)}
              className="h-4 w-4 text-[#06D6A0] focus:ring-[#06D6A0] border-gray-300 rounded"
            />
            <label htmlFor="overnight" className="ml-2 block text-sm text-gray-700">
              Overnight transport
            </label>
          </div>
          
          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add notes...
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#06D6A0] focus:border-transparent"
              placeholder="Add notes..."
            />
          </div>
          
          {/* Additional details */}
          <div className="space-y-4 border-t pt-4">
            {/* Quick add buttons */}
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => {}} 
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full flex items-center"
              >
                <span className="mr-1">+</span> Departure station
              </button>
              <button 
                onClick={() => {}} 
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full flex items-center"
              >
                <span className="mr-1">+</span> Arrival station
              </button>
              <button 
                onClick={() => {}} 
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full flex items-center"
              >
                <span className="mr-1">+</span> Link
              </button>
              <button 
                onClick={() => {}} 
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full flex items-center"
              >
                <span className="mr-1">+</span> Operator
              </button>
              <button 
                onClick={() => {}} 
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full flex items-center"
              >
                <span className="mr-1">+</span> Seat number
              </button>
              <button 
                onClick={() => {}} 
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full flex items-center"
              >
                <span className="mr-1">+</span> Booking number
              </button>
              <button 
                onClick={() => {}} 
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full flex items-center"
              >
                <span className="mr-1">+</span> Track
              </button>
              <button 
                onClick={() => {}} 
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full flex items-center"
              >
                <span className="mr-1">+</span> Vehicle Number
              </button>
            </div>
            
            {/* Custom fields would be dynamically added here */}
            {departureStation && (
              <div className="relative pl-5 flex items-center">
                <span className="absolute left-0 text-gray-500 text-sm">•</span>
                <div className="flex-1">
                  <span className="text-sm text-gray-500">Departure station:</span>
                  <span className="ml-2 text-sm">{departureStation}</span>
                </div>
                <button className="text-gray-400 hover:text-gray-600" onClick={() => setDepartureStation('')}>
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            )}
            
            {/* More custom fields would be shown here */}
          </div>
        </div>
        
        {/* Footer with actions */}
        <div className="p-4 border-t bg-gray-50 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#06D6A0] text-white rounded-md hover:bg-[#05b389]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
} 