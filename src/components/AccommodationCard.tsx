'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaMapPin, FaStar, FaRegStar, FaCheck } from 'react-icons/fa';
import { formatCurrency } from '@/lib/utils';
import { Accommodation } from '@/lib/api/accommodationService';

interface AccommodationCardProps {
  accommodation: Accommodation;
  isSelected: boolean;
  onSelect: (accommodation: Accommodation) => void;
  city: string;
}

export default function AccommodationCard({ 
  accommodation, 
  isSelected,
  onSelect,
  city
}: AccommodationCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <div
      className={`rounded-lg overflow-hidden bg-white border ${isSelected ? 'border-[#06D6A0]' : 'border-gray-200'} shadow hover:shadow-md transition-all cursor-pointer hover:-translate-y-1 relative`}
      onClick={() => onSelect(accommodation)}
      data-id={accommodation.id}
    >
      {/* Favorite toggle button */}
      <button 
        className="absolute top-2 left-2 z-10 p-1.5 bg-white bg-opacity-70 hover:bg-opacity-90 rounded-full transition-colors"
        onClick={handleFavoriteClick}
      >
        {isFavorite ? (
          <FaStar className="text-yellow-400" size={16} />
        ) : (
          <FaRegStar className="text-gray-600" size={16} />
        )}
      </button>

      {/* Selected badge */}
      {isSelected && (
        <div
          className="absolute top-0 right-0 bg-[#06D6A0] px-2 py-1 z-10 rounded-bl-md"
        >
          <p className="text-xs font-bold text-white flex items-center">
            <FaCheck size={10} className="mr-1" />
            Selected
          </p>
        </div>
      )}
      
      {/* Accommodation image */}
      <div className="relative h-36">
        <Image
          src={accommodation.images[0] || '/hotel-images/hotel-room-moderate.jpg'}
          alt={accommodation.name}
          width={500}
          height={160}
          className="w-full h-36 object-cover"
        />
        {/* Rating badge */}
        <div 
          className="absolute bottom-2 left-2 bg-black/80 rounded-md px-2 py-1 flex items-center shadow-md"
        >
          <FaStar className="text-yellow-400 mr-1" size={12} />
          <p className="text-white text-sm font-bold">
            {accommodation.rating?.toFixed(1) || 'N/A'}
          </p>
        </div>
      </div>
      
      {/* Card content */}
      <div className="p-3">
        {/* Accommodation name */}
        <h3 className="text-base font-medium text-[#264653] mb-1 truncate">
          {accommodation.name}
        </h3>
        
        {/* Location */}
        <div className="flex items-center mb-2">
          <FaMapPin className="text-[#06D6A0] mr-1 flex-shrink-0" size={12} />
          <p className="text-xs text-[#264653] opacity-80 truncate">
            {accommodation.address || city}
          </p>
        </div>
        
        {/* Price and select button */}
        <div className="flex mt-3 justify-between items-center">
          <div>
            <p className="font-bold text-lg text-[#06D6A0]">
              {formatCurrency(accommodation.price.amount, accommodation.price.currency)}
            </p>
            <p className="text-xs text-[#264653] opacity-70">per night</p>
          </div>
          <button
            className={`${
              isSelected 
                ? 'bg-[#06D6A0] text-white' 
                : 'bg-white text-[#264653] border border-gray-300'
            } px-4 py-1.5 rounded-full text-xs font-medium hover:shadow-sm transition-all`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(accommodation);
            }}
          >
            {isSelected ? 'Selected' : 'Select'}
          </button>
        </div>
      </div>
    </div>
  );
} 