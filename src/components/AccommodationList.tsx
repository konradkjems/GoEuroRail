'use client';

import React from 'react';
import Image from 'next/image';
import { FaExternalLinkAlt, FaSearch } from 'react-icons/fa';
import { Accommodation } from '@/lib/api/accommodationService';
import AccommodationCard from './AccommodationCard';
import { motion, AnimatePresence } from 'framer-motion';

// Helper function to ensure Hostelworld URLs use the correct format
const fixHostelworldUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    
    // Check if using old format with 'q' parameter
    if (urlObj.searchParams.has('q')) {
      const cityName = urlObj.searchParams.get('q') || '';
      const fromDate = urlObj.searchParams.get('from') || '';
      const toDate = urlObj.searchParams.get('to') || '';
      const guests = urlObj.searchParams.get('guests') || '';
      
      // Create new URL with correct parameters
      const newUrl = new URL('https://www.hostelworld.com/search');
      newUrl.searchParams.set('search_key', cityName);
      newUrl.searchParams.set('city', cityName);
      // We don't have country code info, so omitting that parameter
      if (fromDate) newUrl.searchParams.set('from', fromDate);
      if (toDate) newUrl.searchParams.set('to', toDate);
      if (guests) newUrl.searchParams.set('guests', guests);
      
      return newUrl.toString();
    }
    return url;
  } catch (e) {
    console.error('Error fixing Hostelworld URL:', e);
    return url;
  }
};

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
  // Ensure Hostelworld URL uses the correct format
  const safeHostelworldUrl = fixHostelworldUrl(hostelworldUrl);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Header showing count */}
      {!isLoading && accommodations.length > 0 && (
        <div className="px-4 py-3 bg-white border-b border-gray-200">
          <p className="text-sm font-medium text-gray-700">
            {accommodations.length} accommodations
          </p>
        </div>
      )}

      {/* Scrollable accommodation grid */}
      <div className="flex-grow overflow-y-auto p-4 bg-gray-50/50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <AnimatePresence>
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-72">
              <motion.div 
                className="w-10 h-10 mb-4"
                animate={{ 
                  rotate: 360,
                  transition: { 
                    repeat: Infinity, 
                    duration: 1.5,
                    ease: "linear" 
                  }
                }}
              >
                <div className="w-full h-full rounded-full border-2 border-gray-200 border-t-[#06D6A0]"></div>
              </motion.div>
              <p className="text-gray-500 font-medium text-sm">Loading accommodations...</p>
            </div>
          ) : accommodations.length === 0 ? (
            <motion.div 
              className="text-center p-8 rounded-lg bg-white border border-gray-200 shadow-sm my-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FaSearch className="text-gray-400 w-6 h-6" />
              </div>
              <p className="mb-5 text-[#264653] font-medium">No accommodations found for your search criteria.</p>
              <p className="text-sm text-gray-500 mb-5">Try searching on external sites:</p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-[#006CE4] border border-[#006CE4] px-4 py-2 rounded-lg inline-flex items-center justify-center hover:bg-[#EBF2FF] transition-colors shadow-sm"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
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
                </motion.a>
                
                <motion.a
                  href={safeHostelworldUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-[#FF5A5F] border border-[#FF5A5F] px-4 py-2 rounded-lg inline-flex items-center justify-center hover:bg-[#FFF5F5] transition-colors shadow-sm"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="w-5 h-5 mr-2 relative">
                    <Image 
                      src="/logos/accommodations/hostelworld-group.svg" 
                      alt="Hostelworld" 
                      width={20} 
                      height={20}
                      className="object-contain"
                    />
                  </div>
                  Search on Hostelworld
                </motion.a>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {accommodations.map((accommodation) => (
                <motion.div key={accommodation.id} variants={itemVariants}>
                  <AccommodationCard
                    accommodation={accommodation}
                    isSelected={selectedAccommodationId === accommodation.id}
                    onSelect={onSelectAccommodation}
                    city={city}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* External search options fixed at the bottom */}
      {!isLoading && accommodations.length > 0 && (
        <div className="p-3 border-t border-gray-200 bg-white shadow-inner">
          <p className="mb-2 text-[#264653] text-xs font-medium">
            Can't find what you're looking for?
          </p>
          <div className="flex gap-2">
            <motion.a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center bg-white text-[#006CE4] border border-[#006CE4]/20 px-3 py-1.5 rounded-md hover:bg-[#EBF2FF] transition-colors text-xs shadow-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-4 h-4 mr-1 relative flex-shrink-0">
                <Image 
                  src="/logos/accommodations/bookingcom-1.svg" 
                  alt="Booking.com" 
                  width={16} 
                  height={16}
                  className="object-contain"
                />
              </div>
              <span className="truncate">Booking.com</span>
            </motion.a>
            <motion.a
              href={safeHostelworldUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center bg-white text-[#FF5A5F] border border-[#FF5A5F]/20 px-3 py-1.5 rounded-md hover:bg-[#FFF5F5] transition-colors text-xs shadow-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-4 h-4 mr-1 relative flex-shrink-0">
                <Image 
                  src="/logos/accommodations/hostelworld-group.svg" 
                  alt="Hostelworld" 
                  width={16} 
                  height={16}
                  className="object-contain"
                />
              </div>
              <span className="truncate">Hostelworld</span>
            </motion.a>
          </div>
        </div>
      )}
    </div>
  );
} 