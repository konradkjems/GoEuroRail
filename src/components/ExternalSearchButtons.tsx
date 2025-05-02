'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ExternalSearchButtonsProps {
  bookingUrl: string;
  hostelworldUrl: string;
  city?: string;
}

export default function ExternalSearchButtons({ 
  bookingUrl, 
  hostelworldUrl,
  city 
}: ExternalSearchButtonsProps) {
  const ensureValidUrl = (url: string): string => {
    try {
      new URL(url);
      return url;
    } catch (e) {
      console.error('Invalid URL:', url, e);
      if (url.includes('booking.com')) {
        return 'https://www.booking.com/';
      } else if (url.includes('hostelworld.com')) {
        return 'https://www.hostelworld.com/';
      }
      return url;
    }
  };

  // Fix Hostelworld URL if it uses the old format with 'q' parameter
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

  const safeBookingUrl = ensureValidUrl(bookingUrl);
  const safeHostelworldUrl = fixHostelworldUrl(ensureValidUrl(hostelworldUrl));
  
  const handleExternalLink = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    // No additional verification needed here, let the browser handle the navigation
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.03, transition: { duration: 0.2 } },
    tap: { scale: 0.97, transition: { duration: 0.1 } }
  };

  return (
    <div className="flex justify-center gap-3 py-3">
      <motion.a 
        href={safeBookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center py-2.5 px-4 rounded-lg bg-white border border-[#006CE4]/20 text-[#006CE4] hover:border-[#006CE4]/40 hover:bg-[#EBF2FF] transition-colors shadow-sm"
        onClick={(e) => handleExternalLink(e, safeBookingUrl)}
        variants={buttonVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
      >
        <div className="w-5 h-5 mr-2 relative flex-shrink-0">
          <Image 
            src="/logos/accommodations/bookingcom-1.svg" 
            alt="Booking.com" 
            width={20} 
            height={20}
            className="object-contain"
          />
        </div>
        <span className="text-sm font-medium truncate">
          Search on Booking.com{city ? ` for ${city}` : ''}
        </span>
      </motion.a>
      
      <motion.a 
        href={safeHostelworldUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex items-center justify-center py-2.5 px-4 rounded-lg bg-white border border-[#FF5A5F]/20 text-[#FF5A5F] hover:border-[#FF5A5F]/40 hover:bg-[#FFF5F5] transition-colors shadow-sm"
        onClick={(e) => handleExternalLink(e, safeHostelworldUrl)}
        variants={buttonVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
      >
        <div className="w-5 h-5 mr-2 relative flex-shrink-0">
          <Image 
            src="/logos/accommodations/hostelworld-group.svg" 
            alt="Hostelworld" 
            width={20} 
            height={20}
            className="object-contain"
          />
        </div>
        <span className="text-sm font-medium truncate">
          Search on Hostelworld{city ? ` for ${city}` : ''}
        </span>
      </motion.a>
    </div>
  );
} 