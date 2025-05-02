import React, { useState } from "react";
import { City } from "@/types";
import {
  XMarkIcon,
  TrashIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";

export interface CustomTransportDetails {
  transportType: "train" | "bus";
  departureTime: string;
  arrivalTime: string;
  departureDate: string;
  arrivalDate: string;
  departureStation?: string;
  arrivalStation?: string;
  operator?: string;
  link?: string;
  notes?: string;
  overnightTransport: boolean;
  bookingNumber?: string;
  track?: string;
  vehicleNumber?: string;
  seatNumber?: string;
}

interface CustomTransportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transportDetails: CustomTransportDetails) => void;
  initialData?: CustomTransportDetails;
  fromCity: City | null;
  toCity: City | null;
  departureDate: string;
}

export default function CustomTransportModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  fromCity,
  toCity,
  departureDate,
}: CustomTransportModalProps) {
  const [transportType, setTransportType] = useState<"train" | "bus">(
    initialData?.transportType || "train"
  );
  const [departureTime, setDepartureTime] = useState(
    initialData?.departureTime || "00:00"
  );
  const [arrivalTime, setArrivalTime] = useState(
    initialData?.arrivalTime || "00:00"
  );
  const [departureStation, setDepartureStation] = useState(
    initialData?.departureStation || ""
  );
  const [arrivalStation, setArrivalStation] = useState(
    initialData?.arrivalStation || ""
  );
  const [operator, setOperator] = useState(initialData?.operator || "");
  const [link, setLink] = useState(initialData?.link || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [overnightTransport, setOvernightTransport] = useState(
    initialData?.overnightTransport || false
  );
  const [bookingNumber, setBookingNumber] = useState(
    initialData?.bookingNumber || ""
  );
  const [track, setTrack] = useState(initialData?.track || "");
  const [vehicleNumber, setVehicleNumber] = useState(
    initialData?.vehicleNumber || ""
  );
  const [seatNumber, setSeatNumber] = useState(initialData?.seatNumber || "");
  
  // Additional state for showing optional fields
  const [showDepartureStation, setShowDepartureStation] = useState(!!initialData?.departureStation);
  const [showArrivalStation, setShowArrivalStation] = useState(!!initialData?.arrivalStation);
  const [showBookingNumber, setShowBookingNumber] = useState(!!initialData?.bookingNumber);
  const [showTrack, setShowTrack] = useState(!!initialData?.track);
  const [showVehicleNumber, setShowVehicleNumber] = useState(!!initialData?.vehicleNumber);
  const [showSeatNumber, setShowSeatNumber] = useState(!!initialData?.seatNumber);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use departure date from props
    const depDate = departureDate;
    
    // For arrival date, use same date for normal transport or next day for overnight
    let arrDate = depDate;
    if (overnightTransport) {
      const nextDay = new Date(depDate);
      nextDay.setDate(nextDay.getDate() + 1);
      arrDate = nextDay.toISOString().split('T')[0];
    }
    
    onSave({
      transportType,
      departureTime,
      arrivalTime,
      departureDate: depDate,
      arrivalDate: arrDate,
      departureStation: departureStation || undefined,
      arrivalStation: arrivalStation || undefined,
      operator: operator || undefined,
      link: link || undefined,
      notes: notes || undefined,
      overnightTransport,
      bookingNumber: bookingNumber || undefined,
      track: track || undefined,
      vehicleNumber: vehicleNumber || undefined,
      seatNumber: seatNumber || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md my-8 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-[#264653]">
            {transportType === "train" ? "Train" : "Bus"} Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 flex-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Route Display */}
            <div className="flex items-center justify-between p-3 bg-[#FAF3E0] rounded-lg">
              <div className="text-sm font-medium text-[#264653]">
                {fromCity?.name || "Starting point"}
              </div>
              <span className="text-[#264653] mx-2">to</span>
              <div className="text-sm font-medium text-[#264653]">
                {toCity?.name || "Destination"}
              </div>
            </div>

            {/* Transport Type Selection */}
            <div>
              <label className="block text-sm font-medium text-[#264653] mb-1">
                Transport Type
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 rounded-md border ${
                    transportType === "train"
                      ? "bg-[#FFD166]/30 border-[#FFD166] text-[#264653]"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setTransportType("train")}
                >
                  Train
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 rounded-md border ${
                    transportType === "bus"
                      ? "bg-[#FFD166]/30 border-[#FFD166] text-[#264653]"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setTransportType("bus")}
                >
                  Bus
                </button>
              </div>
            </div>

            {/* Overnight Transport */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={overnightTransport}
                  onChange={(e) => setOvernightTransport(e.target.checked)}
                  className="h-4 w-4 text-[#06D6A0] border-gray-300 rounded focus:ring-[#06D6A0]"
                />
                <span className="ml-2 text-sm text-[#264653]">
                  Overnight transport
                </span>
              </label>
            </div>

            {/* Times - High priority section */}
            <div className="grid grid-cols-2 gap-4 p-4 border border-[#06D6A0]/30 rounded-lg bg-[#06D6A0]/10">
              <div>
                <label htmlFor="departureTime" className="block text-sm font-medium text-[#264653] mb-1">
                  Departure time
                </label>
                <input
                  type="time"
                  id="departureTime"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:ring-[#06D6A0] focus:border-[#06D6A0] font-medium text-base"
                />
              </div>
              <div>
                <label htmlFor="arrivalTime" className="block text-sm font-medium text-[#264653] mb-1">
                  Arrival time
                </label>
                <input
                  type="time"
                  id="arrivalTime"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:ring-[#06D6A0] focus:border-[#06D6A0] font-medium text-base"
                />
              </div>
            </div>

            {/* Stations */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <button
                  type="button"
                  onClick={() => setShowDepartureStation(!showDepartureStation)}
                  className="inline-flex items-center text-sm text-[#264653] hover:text-[#06D6A0]"
                >
                  {!showDepartureStation ? "+" : "-"} Departure station
                </button>
                {showDepartureStation && (
                  <input
                    type="text"
                    value={departureStation}
                    onChange={(e) => setDepartureStation(e.target.value)}
                    placeholder="e.g. London St Pancras"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#06D6A0] focus:border-[#06D6A0]"
                  />
                )}
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => setShowArrivalStation(!showArrivalStation)}
                  className="inline-flex items-center text-sm text-[#264653] hover:text-[#06D6A0]"
                >
                  {!showArrivalStation ? "+" : "-"} Arrival station
                </button>
                {showArrivalStation && (
                  <input
                    type="text"
                    value={arrivalStation}
                    onChange={(e) => setArrivalStation(e.target.value)}
                    placeholder="e.g. Paris Gare du Nord"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#06D6A0] focus:border-[#06D6A0]"
                  />
                )}
              </div>
            </div>

            {/* Vehicle Number */}
            <div>
              <button
                type="button"
                onClick={() => setShowVehicleNumber(!showVehicleNumber)}
                className="inline-flex items-center text-sm text-[#264653] hover:text-[#06D6A0]"
              >
                {!showVehicleNumber ? "+" : "-"} Vehicle Number
              </button>
              {showVehicleNumber && (
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  placeholder="e.g. ICE 123, FlixBus 402"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#06D6A0] focus:border-[#06D6A0]"
                />
              )}
            </div>

            {/* Seat number */}
            <div>
              <button
                type="button"
                onClick={() => setShowSeatNumber(!showSeatNumber)}
                className="inline-flex items-center text-sm text-[#264653] hover:text-[#06D6A0]"
              >
                {!showSeatNumber ? "+" : "-"} Seat number
              </button>
              {showSeatNumber && (
                <input
                  type="text"
                  value={seatNumber}
                  onChange={(e) => setSeatNumber(e.target.value)}
                  placeholder="e.g. 42C, Window"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#06D6A0] focus:border-[#06D6A0]"
                />
              )}
            </div>

            {/* Operator */}
            <div>
              <label htmlFor="operator" className="block text-sm font-medium text-[#264653] mb-1">
                Operator
              </label>
              <input
                type="text"
                id="operator"
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                placeholder="e.g. Eurostar, FlixBus"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#06D6A0] focus:border-[#06D6A0]"
              />
            </div>

            {/* Link */}
            <div>
              <label htmlFor="link" className="block text-sm font-medium text-[#264653] mb-1">
                Link
              </label>
              <div className="flex shadow-sm rounded-md">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  <LinkIcon className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  id="link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="e.g. booking URL"
                  className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 px-3 py-2 border focus:ring-[#06D6A0] focus:border-[#06D6A0]"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-[#264653] mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#06D6A0] focus:border-[#06D6A0]"
              />
            </div>
          </form>
        </div>
        
        {/* Form actions - sticky at the bottom */}
        <div className="p-4 border-t sticky bottom-0 bg-white flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-[#264653] hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#06D6A0] text-white rounded-md hover:bg-[#05c091]"
          >
            Save Details
          </button>
        </div>
      </div>
    </div>
  );
} 