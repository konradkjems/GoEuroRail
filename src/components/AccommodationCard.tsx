'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaMapPin, FaStar, FaRegStar, FaCheck } from 'react-icons/fa';
import { formatCurrency } from '@/lib/utils';
import { Accommodation } from '@/lib/api/accommodationService';
import { motion } from 'framer-motion';

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
  const [isHovered, setIsHovered] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  // Animation variants
  const cardVariants = {
    normal: { y: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    hover: { y: -4, boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }
  };

  const favoriteButtonVariants = {
    normal: { scale: 1 },
    hover: { scale: 1.15 }
  };

  const selectButtonVariants = {
    normal: { scale: 1 },
    hover: { scale: 1.05 }
  };

  const imageScaleVariants = {
    normal: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 1.5 } }
  };

  return (
    <motion.div
      className={`rounded-lg overflow-hidden bg-white border ${isSelected ? 'border-[#06D6A0] shadow-[0_0_0_2px_rgba(6,214,160,0.3)]' : 'border-gray-200'} transition-all cursor-pointer relative`}
      variants={cardVariants}
      initial="normal"
      animate={isHovered ? "hover" : "normal"}
      onClick={() => onSelect(accommodation)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      data-id={accommodation.id}
      transition={{ duration: 0.2 }}
    >
      {/* Favorite toggle button */}
      <motion.button 
        className="absolute top-3 left-3 z-10 p-1.5 bg-white rounded-full shadow-md"
        onClick={handleFavoriteClick}
        variants={favoriteButtonVariants}
        whileHover="hover"
        whileTap={{ scale: 0.9 }}
      >
        {isFavorite ? (
          <FaStar className="text-yellow-400" size={16} />
        ) : (
          <FaRegStar className="text-gray-600" size={16} />
        )}
      </motion.button>

      {/* Selected badge */}
      {isSelected && (
        <motion.div
          className="absolute top-0 right-0 bg-[#06D6A0] px-2 py-1 z-10 rounded-bl-md"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-xs font-bold text-white flex items-center">
            <FaCheck size={10} className="mr-1" />
            Selected
          </p>
        </motion.div>
      )}
      
      {/* Accommodation image with animation */}
      <div className="relative h-40 overflow-hidden">
        <motion.div
          className="w-full h-full"
          variants={imageScaleVariants}
          animate={isHovered ? "hover" : "normal"}
        >
          <Image
            src={accommodation.images[0] || '/hotel-images/hotel-room-moderate.jpg'}
            alt={accommodation.name}
            width={500}
            height={200}
            className="w-full h-40 object-cover"
          />
        </motion.div>
        
        {/* Rating badge */}
        <div 
          className="absolute bottom-3 left-3 bg-black/80 rounded-md px-2 py-1 flex items-center shadow-md"
        >
          <FaStar className="text-yellow-400 mr-1" size={12} />
          <p className="text-white text-sm font-bold">
            {accommodation.rating?.toFixed(1) || 'N/A'}
          </p>
        </div>
        
        {/* Type badge */}
        <div 
          className="absolute bottom-3 right-3 bg-white/90 rounded-md px-2 py-1 shadow-sm"
        >
          <p className="text-xs font-medium text-[#264653]">
            {accommodation.type}
          </p>
        </div>
      </div>
      
      {/* Card content */}
      <div className="p-4">
        {/* Accommodation name */}
        <h3 className="text-base font-medium text-[#264653] mb-1 truncate">
          {accommodation.name}
        </h3>
        
        {/* Location */}
        <div className="flex items-center mb-3">
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
          <motion.button
            className={`${
              isSelected 
                ? 'bg-[#06D6A0] text-white' 
                : 'bg-white text-[#264653] border border-gray-300 hover:border-[#06D6A0] hover:text-[#06D6A0]'
            } px-4 py-1.5 rounded-full text-xs font-medium shadow-sm transition-colors`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(accommodation);
            }}
            variants={selectButtonVariants}
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
          >
            {isSelected ? 'Selected' : 'Select'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
} 