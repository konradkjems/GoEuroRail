// Simple in-memory cache implementation
// In a production environment, consider using a more robust solution like:
// - Redis for server-side caching
// - localStorage/IndexedDB for client-side caching
// - Next.js built-in SWR or React Query for data fetching with caching

interface CacheItem {
  value: any;
  expiry: number | null;
}

// Cache storage
const cache: Map<string, CacheItem> = new Map();

/**
 * Get data from cache
 * @param key Cache key
 * @returns Cached data or undefined if not found/expired
 */
export function getCachedData(key: string): any {
  const item = cache.get(key);
  
  if (!item) {
    return undefined;
  }
  
  // Check if the item has expired
  if (item.expiry && item.expiry < Date.now()) {
    cache.delete(key);
    return undefined;
  }
  
  return item.value;
}

/**
 * Set data in cache
 * @param key Cache key
 * @param data Data to store
 * @param ttl Time to live in seconds (optional, defaults to no expiry)
 */
export function setCachedData(key: string, data: any, ttl?: number): void {
  const expiry = ttl ? Date.now() + (ttl * 1000) : null;
  
  cache.set(key, {
    value: data,
    expiry
  });
}

/**
 * Remove data from cache
 * @param key Cache key
 */
export function invalidateCache(key: string): void {
  cache.delete(key);
}

/**
 * Remove all cached data that match a pattern
 * @param keyPattern String pattern to match against cache keys
 */
export function invalidateCachePattern(keyPattern: string): void {
  const keysToDelete: string[] = [];
  
  cache.forEach((_, key) => {
    if (key.includes(keyPattern)) {
      keysToDelete.push(key);
    }
  });
  
  keysToDelete.forEach(key => cache.delete(key));
}

/**
 * Clear the entire cache
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Get all cache keys (useful for debugging)
 * @returns Array of cache keys
 */
export function getCacheKeys(): string[] {
  return Array.from(cache.keys());
}

/**
 * Get cache stats for monitoring
 * @returns Object with cache statistics
 */
export function getCacheStats(): { size: number, validItems: number, expiredItems: number } {
  let validItems = 0;
  let expiredItems = 0;
  
  cache.forEach(item => {
    if (!item.expiry || item.expiry > Date.now()) {
      validItems++;
    } else {
      expiredItems++;
    }
  });
  
  return {
    size: cache.size,
    validItems,
    expiredItems
  };
} 