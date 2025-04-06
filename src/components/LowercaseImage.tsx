'use client';

import Image, { ImageProps } from 'next/image';

/**
 * LowercaseImage component to ensure all image paths are lowercase
 * This helps prevent issues with case-sensitive file systems in production
 */
export default function LowercaseImage({
  src,
  ...props
}: ImageProps) {
  // Ensure the src is a string before trying to convert it
  let normalizedSrc = src;
  
  if (typeof src === 'string') {
    // Convert the path to lowercase only if it starts with a slash (local path)
    // Don't convert external URLs
    if (src.startsWith('/')) {
      normalizedSrc = src.toLowerCase();
    }
  }

  return <Image src={normalizedSrc} {...props} />;
} 