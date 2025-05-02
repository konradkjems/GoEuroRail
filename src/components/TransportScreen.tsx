import React, { useState } from "react";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";
import { City } from "@/types";
import CustomTransportModal, { CustomTransportDetails } from "./CustomTransportModal";
import ExternalTransportLinks from "./ExternalTransportLinks";

interface TransportScreenProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transportDetails: CustomTransportDetails) => void;
  fromCity: City | null;
  toCity: City | null;
  date: string;
  initialData?: CustomTransportDetails;
}

export default function TransportScreen({
  isOpen,
  onClose,
  onSave,
  fromCity,
  toCity,
  date,
  initialData,
}: TransportScreenProps) {
  const [showCustomForm, setShowCustomForm] = useState(!!initialData);

  if (!isOpen) return null;

  if (showCustomForm) {
    return (
      <CustomTransportModal
        isOpen={true}
        onClose={() => {
          if (initialData) {
            onClose();
          } else {
            setShowCustomForm(false);
          }
        }}
        onSave={onSave}
        initialData={initialData}
        fromCity={fromCity}
        toCity={toCity}
        departureDate={date}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-[#264653]">
            {fromCity?.name || "Origin"} to {toCity?.name || "Destination"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          {/* No transport found message */}
          <div className="py-6 text-center">
            <div className="mb-5 rounded-full w-16 h-16 bg-[#FFD166]/20 mx-auto flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-[#FFD166]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-[#264653] mb-1">No Train tickets found</h3>
            <p className="text-gray-600 mb-6">
              Don't worry, you can add your own transport details by clicking the button below.
            </p>

            {/* Add custom transport button */}
            <button
              onClick={() => setShowCustomForm(true)}
              className="flex items-center justify-center mx-auto mb-8 px-4 py-2 bg-[#06D6A0] text-white rounded-md hover:bg-[#05c091]"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              Add custom transport
            </button>

            {/* Booking links */}
            <div className="mt-4 p-4 bg-[#FAF3E0] rounded-lg">
              <h4 className="text-sm font-medium text-[#264653] mb-3">Or search for tickets:</h4>
              {fromCity && toCity && (
                <ExternalTransportLinks
                  fromCity={fromCity.name}
                  toCity={toCity.name}
                  date={date}
                />
              )}
            </div>
          </div>
        </div>
        
        {/* Bottom action bar */}
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-[#264653] hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
} 