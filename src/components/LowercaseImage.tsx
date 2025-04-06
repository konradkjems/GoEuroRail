'use client';

import Image, { ImageProps } from 'next/image';

/**
 * LowercaseImage component to ensure all image paths are compatible with case-sensitive file systems
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
      // Split the path into directory and filename
      const lastSlashIndex = src.lastIndexOf('/');
      if (lastSlashIndex !== -1) {
        const directory = src.substring(0, lastSlashIndex + 1);
        const filename = src.substring(lastSlashIndex + 1);
        
        // Convert directory to lowercase but keep the filename as is
        // This handles the case sensitivity issue while preserving the actual filenames
        normalizedSrc = directory.toLowerCase() + filename;
      } else {
        // No directory, just a filename
        normalizedSrc = src.toLowerCase();
      }
    }
  }

  return <Image src={normalizedSrc} {...props} />;
} 