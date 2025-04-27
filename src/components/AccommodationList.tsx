'use client';

import React from 'react';
import Image from 'next/image';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { Accommodation } from '@/lib/api/accommodationService';
import AccommodationCard from './AccommodationCard';

interface AccommodationListProps {
  accommodations: Accommodation[];
  isLoading: boolean;
  selectedAccommodationId: string | null;
  onSelectAccommodation: (accommodation: Accommodation) => void;
  city: string;
  bookingUrl: string;
  hostelworldUrl: string;
  checkInDate: string;
  checkOutDate: string;
  travelers: number;
}

export default function AccommodationList({
  accommodations,
  isLoading,
  selectedAccommodationId,
  onSelectAccommodation,
  city,
  bookingUrl,
  hostelworldUrl,
  checkInDate,
  checkOutDate,
  travelers
}: AccommodationListProps) {
  return (
    <div className="w-full md:w-2/5 h-1/2 md:h-full flex flex-col overflow-hidden">
      {/* Scrollable accommodation grid */}
      <div className="flex-grow overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {isLoading ? (
          <div className="flex justify-center items-center h-52">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#06D6A0]"></div>
          </div>
        ) : accommodations.length === 0 ? (
          <div className="text-center p-6 rounded-lg bg-white border border-gray-200 shadow">
            <p className="mb-4 text-[#264653]">No accommodations found for your search criteria.</p>
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#06D6A0] text-white px-4 py-2 rounded-full inline-flex items-center justify-center mx-auto hover:bg-[#05c090] transition-colors shadow-sm"
            >
              <div className="w-5 h-5 mr-2 relative">
                <Image 
                  src="/logos/accommodations/bookingcom-1.svg" 
                  alt="Booking.com" 
                  width={20} 
                  height={20}
                  className="object-contain"
                />
              </div>
              Search on Booking.com
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
            {accommodations.map((accommodation) => (
              <AccommodationCard
                key={accommodation.id}
                accommodation={accommodation}
                isSelected={selectedAccommodationId === accommodation.id}
                onSelect={onSelectAccommodation}
                city={city}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* External search options fixed at the bottom */}
      {!isLoading && accommodations.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-white">
          <p className="mb-2 text-[#264653] text-sm text-center">
            Can't find what you're looking for?
          </p>
          <div className="flex justify-center gap-2">
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#06D6A0] border border-[#06D6A0] px-4 py-1.5 rounded-full inline-flex items-center hover:bg-[#06D6A0]/5 transition-colors text-xs shadow-sm"
            >
              <div className="w-4 h-4 mr-1 relative">
                <Image 
                  src="/logos/accommodations/bookingcom-1.svg" 
                  alt="Booking.com" 
                  width={16} 
                  height={16}
                  className="object-contain"
                />
              </div>
              Booking.com
            </a>
            <a
              href={hostelworldUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#FF5A5F] border border-[#FF5A5F] px-4 py-1.5 rounded-full inline-flex items-center hover:bg-[#FF5A5F]/5 transition-colors text-xs shadow-sm"
            >
              <div className="w-4 h-4 mr-1 relative">
                <Image 
                  src="/logos/accommodations/hostelworld-group.svg" 
                  alt="Hostelworld" 
                  width={16} 
                  height={16}
                  className="object-contain"
                />
              </div>
              Hostelworld
            </a>
          </div>
        </div>
      )}
    </div>
  );
} 