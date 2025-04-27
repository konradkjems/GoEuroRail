import React, { useState, useEffect } from "react";
import { City } from "@/types";
import {
  XMarkIcon,
  ArrowRightIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

interface TrainDetails {
  trainNumber: string;
  duration: string;
  changes: number;
  price?: {
    amount: number;
    currency: string;
  };
}

interface TransportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trainDetails: TrainDetails) => void;
  initialData?: TrainDetails;
  fromCity: City | null;
  toCity: City | null;
}

export default function TransportModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  fromCity,
  toCity,
}: TransportModalProps) {
  const [trainNumber, setTrainNumber] = useState(initialData?.trainNumber || "");
  const [hours, setHours] = useState(initialData?.duration ? parseInt(initialData.duration.split("h")[0]) : 0);
  const [minutes, setMinutes] = useState(
    initialData?.duration ? parseInt(initialData.duration.split("h")[1]?.replace("m", "") || "0") : 0
  );
  const [changes, setChanges] = useState(initialData?.changes || 0);
  const [priceAmount, setPriceAmount] = useState(initialData?.price?.amount || 0);
  const [priceCurrency, setPriceCurrency] = useState(initialData?.price?.currency || "EUR");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      trainNumber,
      duration: `${hours}h ${minutes}m`,
      changes,
      price: {
        amount: priceAmount,
        currency: priceCurrency,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Train Details</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {/* Route Display */}
          <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-700">
              {fromCity?.name || "Starting point"}
            </div>
            <ArrowRightIcon className="h-4 w-4 text-gray-500 mx-2" />
            <div className="text-sm font-medium text-gray-700">
              {toCity?.name || "Destination"}
            </div>
          </div>

          {/* Train Number */}
          <div className="mb-4">
            <label htmlFor="trainNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Train Number / Type
            </label>
            <input
              type="text"
              id="trainNumber"
              value={trainNumber}
              onChange={(e) => setTrainNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g. ICE 123, TGV 456, etc."
            />
          </div>

          {/* Duration */}
          <div className="mb-4">
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
              Duration
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={hours}
                  onChange={(e) => setHours(parseInt(e.target.value))}
                  className="w-16 px-3 py-2 border border-gray-300 rounded-md"
                />
                <span className="ml-1 text-gray-700">h</span>
              </div>
              <div className="flex items-center">
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(parseInt(e.target.value))}
                  className="w-16 px-3 py-2 border border-gray-300 rounded-md"
                />
                <span className="ml-1 text-gray-700">m</span>
              </div>
            </div>
          </div>

          {/* Changes */}
          <div className="mb-4">
            <label htmlFor="changes" className="block text-sm font-medium text-gray-700 mb-1">
              Connections
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                id="changes"
                min="0"
                value={changes}
                onChange={(e) => setChanges(parseInt(e.target.value))}
                className="w-16 px-3 py-2 border border-gray-300 rounded-md"
              />
              <span className="text-gray-700">changes</span>
            </div>
          </div>

          {/* Price */}
          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price (optional)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                id="price"
                min="0"
                step="0.01"
                value={priceAmount}
                onChange={(e) => setPriceAmount(parseFloat(e.target.value))}
                className="w-24 px-3 py-2 border border-gray-300 rounded-md"
              />
              <select
                value={priceCurrency}
                onChange={(e) => setPriceCurrency(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
                <option value="CHF">CHF</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 