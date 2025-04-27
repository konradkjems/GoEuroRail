'use client';

import React from 'react';
import Image from 'next/image';

interface ExternalSearchButtonsProps {
  bookingUrl: string;
  hostelworldUrl: string;
}

export default function ExternalSearchButtons({ 
  bookingUrl, 
  hostelworldUrl 
}: ExternalSearchButtonsProps) {
  return (
    <div className="flex justify-center gap-4 py-4 border-b border-gray-200">
      <a 
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center py-2 px-5 rounded-full bg-white border border-gray-300 text-[#264653] hover:bg-gray-50 transition-colors shadow-sm"
      >
        <div className="w-6 h-6 mr-2 relative">
          <Image 
            src="/logos/accommodations/bookingcom-1.svg" 
            alt="Booking.com" 
            width={24} 
            height={24}
            className="object-contain"
          />
        </div>
        Search on Booking.com
      </a>
      
      <a 
        href={hostelworldUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center py-2 px-5 rounded-full bg-white border border-gray-300 text-[#264653] hover:bg-gray-50 transition-colors shadow-sm"
      >
        <div className="w-6 h-6 mr-2 relative">
          <Image 
            src="/logos/accommodations/hostelworld-group.svg" 
            alt="Hostelworld" 
            width={24} 
            height={24}
            className="object-contain"
          />
        </div>
        Search on Hostelworld
      </a>
    </div>
  );
} 