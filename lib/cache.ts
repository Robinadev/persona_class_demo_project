// In-memory cache for development
// In production, use Redis or similar
interface CacheEntry {
  data: unknown
  expiresAt: number
}

const cache = new Map<string, CacheEntry>()

export const cacheService = {
  // Set a value with optional TTL (in seconds)
  set: (key: string, value: unknown, ttl: number = 3600) => {
    const expiresAt = Date.now() + ttl * 1000
    cache.set(key, { data: value, expiresAt })
  },

  // Get a cached value
  get: (key: string) => {
    const entry = cache.get(key)
    if (!entry) return null

    if (Date.now() > entry.expiresAt) {
      cache.delete(key)
      return null
    }

    return entry.data
  },

  // Delete a cache entry
  delete: (key: string) => {
    cache.delete(key)
  },

  // Clear all cache
  clear: () => {
    cache.clear()
  },

  // Check if key exists and is not expired
  has: (key: string) => {
    const entry = cache.get(key)
    if (!entry) return false

    if (Date.now() > entry.expiresAt) {
      cache.delete(key)
      return false
    }

    return true
  },
}

// Cache key builders for consistency
export const cacheKeys = {
  user: (userId: string) => `user:${userId}`,
  profile: (userId: string) => `profile:${userId}`,
  wallet: (userId: string) => `wallet:${userId}`,
  plans: () => "plans:active",
  callLogs: (userId: string) => `calls:${userId}`,
  transactions: (userId: string) => `transactions:${userId}`,
}
