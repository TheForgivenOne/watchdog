import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Cache expiration times (in milliseconds)
const WEATHER_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes for weather
const GEOCODING_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours for geocoding

/**
 * Helper to generate weather cache key from coordinates
 * Rounds to 4 decimal places for ~10m precision
 */
function generateWeatherCacheKey(latitude: number, longitude: number): string {
  const lat = latitude.toFixed(4);
  const lon = longitude.toFixed(4);
  return `${lat}:${lon}`;
}

/**
 * Helper to generate geocoding cache key from query
 */
function generateGeocodingCacheKey(query: string): string {
  return query.toLowerCase().trim();
}

/**
 * Get cached weather data
 * Returns null if no valid cache exists
 */
export const getCachedWeather = query({
  args: {
    latitude: v.number(),
    longitude: v.number(),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const cacheKey = generateWeatherCacheKey(args.latitude, args.longitude);
    const now = Date.now();

    console.log('[Convex CacheWeather] getCachedWeather - cacheKey:', cacheKey, 'userId:', args.userId);

    // Look for valid cache entry
    let cached;
    if (args.userId) {
      cached = await ctx.db
        .query("cachedWeather")
        .withIndex("by_user_cache", (q) =>
          q.eq("userId", args.userId).eq("cacheKey", cacheKey)
        )
        .unique();
    } else {
      cached = await ctx.db
        .query("cachedWeather")
        .withIndex("by_cache_key", (q) => q.eq("cacheKey", cacheKey))
        .first();
    }

    if (!cached) {
      console.log('[Convex CacheWeather] getCachedWeather - No cache entry found');
      return null;
    }

    if (cached.expiresAt < now) {
      console.log('[Convex CacheWeather] getCachedWeather - Cache entry expired');
      return null;
    }

    console.log('[Convex CacheWeather] getCachedWeather - Cache HIT! expiresAt:', new Date(cached.expiresAt).toISOString());
    return {
      ...cached,
      isStale: cached.expiresAt - now < 5 * 60 * 1000, // Mark as stale if < 5 min left
    };
  },
});

/**
 * Store weather data in cache
 */
export const cacheWeather = mutation({
  args: {
    latitude: v.number(),
    longitude: v.number(),
    timezone: v.string(),
    timezoneAbbreviation: v.string(),
    elevation: v.number(),
    current: v.any(),
    daily: v.any(),
    currentUnits: v.any(),
    dailyUnits: v.any(),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const cacheKey = generateWeatherCacheKey(args.latitude, args.longitude);
    const now = Date.now();

    console.log('[Convex CacheWeather] cacheWeather - Storing with cacheKey:', cacheKey, 'userId:', args.userId);

    // Check if cache entry already exists
    let existing;
    if (args.userId) {
      existing = await ctx.db
        .query("cachedWeather")
        .withIndex("by_user_cache", (q) =>
          q.eq("userId", args.userId).eq("cacheKey", cacheKey)
        )
        .unique();
    } else {
      existing = await ctx.db
        .query("cachedWeather")
        .withIndex("by_cache_key", (q) => q.eq("cacheKey", cacheKey))
        .first();
    }

    const cacheData = {
      cacheKey,
      latitude: args.latitude,
      longitude: args.longitude,
      timezone: args.timezone,
      timezoneAbbreviation: args.timezoneAbbreviation,
      elevation: args.elevation,
      current: args.current,
      daily: args.daily,
      currentUnits: args.currentUnits,
      dailyUnits: args.dailyUnits,
      fetchedAt: now,
      expiresAt: now + WEATHER_CACHE_DURATION,
      userId: args.userId,
    };

    if (existing) {
      console.log('[Convex CacheWeather] cacheWeather - Updating existing cache entry');
      await ctx.db.patch(existing._id, cacheData);
    } else {
      console.log('[Convex CacheWeather] cacheWeather - Creating new cache entry');
      await ctx.db.insert("cachedWeather", cacheData);
    }

    // Also archive to weather history
    await archiveWeatherToHistory(ctx, {
      userId: args.userId,
      locationName: cacheKey, // Will be updated with actual name if available
      latitude: args.latitude,
      longitude: args.longitude,
      daily: args.daily,
    });

    return cacheData;
  },
});

/**
 * Archive weather data to history
 */
async function archiveWeatherToHistory(
  ctx: any,
  args: {
    userId?: string;
    locationName: string;
    latitude: number;
    longitude: number;
    daily: any;
  }
) {
  const now = Date.now();

  // Archive each day's forecast
  if (args.daily && args.daily.time) {
    for (let i = 0; i < args.daily.time.length; i++) {
      const date = args.daily.time[i];

      // Check if entry already exists for this location and date
      const existing = await ctx.db
        .query("weatherHistory")
        .withIndex("by_location_date", (q: any) =>
          q.eq("latitude", args.latitude).eq("longitude", args.longitude).eq("date", date)
        )
        .filter((q: any) => q.eq(q.field("userId"), args.userId))
        .first();

      const historyData = {
        userId: args.userId,
        locationName: args.locationName,
        latitude: args.latitude,
        longitude: args.longitude,
        date,
        temperatureMax: args.daily.temperature_2m_max?.[i] || 0,
        temperatureMin: args.daily.temperature_2m_min?.[i] || 0,
        weatherCode: args.daily.weather_code?.[i] || 0,
        precipitationProbability: args.daily.precipitation_probability_max?.[i] || 0,
        archivedAt: now,
      };

      if (existing) {
        await ctx.db.patch(existing._id, historyData);
      } else {
        await ctx.db.insert("weatherHistory", historyData);
      }
    }
  }
}

/**
 * Get cached geocoding results
 */
export const getCachedGeocoding = query({
  args: {
    query: v.string(),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const cacheKey = generateGeocodingCacheKey(args.query);
    const now = Date.now();

    console.log('[Convex CacheWeather] getCachedGeocoding - query:', args.query, 'cacheKey:', cacheKey, 'userId:', args.userId);

    // Look for valid cache entry
    let cached;
    if (args.userId) {
      cached = await ctx.db
        .query("cachedGeocoding")
        .withIndex("by_user_cache", (q) =>
          q.eq("userId", args.userId).eq("cacheKey", cacheKey)
        )
        .unique();
    } else {
      cached = await ctx.db
        .query("cachedGeocoding")
        .withIndex("by_cache_key", (q) => q.eq("cacheKey", cacheKey))
        .first();
    }

    if (!cached) {
      console.log('[Convex CacheWeather] getCachedGeocoding - No cache entry found');
      return null;
    }

    if (cached.expiresAt < now) {
      console.log('[Convex CacheWeather] getCachedGeocoding - Cache entry expired');
      return null;
    }

    console.log('[Convex CacheWeather] getCachedGeocoding - Cache HIT! resultCount:', cached.resultCount);
    return cached;
  },
});

/**
 * Store geocoding results in cache
 */
export const cacheGeocoding = mutation({
  args: {
    query: v.string(),
    results: v.array(v.any()),
    resultCount: v.number(),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const cacheKey = generateGeocodingCacheKey(args.query);
    const now = Date.now();

    console.log('[Convex CacheWeather] cacheGeocoding - Storing with query:', args.query, 'resultCount:', args.resultCount, 'userId:', args.userId);

    // Check if cache entry already exists
    let existing;
    if (args.userId) {
      existing = await ctx.db
        .query("cachedGeocoding")
        .withIndex("by_user_cache", (q) =>
          q.eq("userId", args.userId).eq("cacheKey", cacheKey)
        )
        .unique();
    } else {
      existing = await ctx.db
        .query("cachedGeocoding")
        .withIndex("by_cache_key", (q) => q.eq("cacheKey", cacheKey))
        .first();
    }

    const cacheData = {
      cacheKey,
      query: args.query,
      results: args.results,
      resultCount: args.resultCount,
      fetchedAt: now,
      expiresAt: now + GEOCODING_CACHE_DURATION,
      userId: args.userId,
    };

    if (existing) {
      console.log('[Convex CacheWeather] cacheGeocoding - Updating existing cache entry');
      await ctx.db.patch(existing._id, cacheData);
    } else {
      console.log('[Convex CacheWeather] cacheGeocoding - Creating new cache entry');
      await ctx.db.insert("cachedGeocoding", cacheData);
    }

    return cacheData;
  },
});

/**
 * Get weather history for a location
 */
export const getWeatherHistory = query({
  args: {
    latitude: v.number(),
    longitude: v.number(),
    userId: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let results = await ctx.db
      .query("weatherHistory")
      .withIndex("by_location_date", (q) =>
        q.eq("latitude", args.latitude).eq("longitude", args.longitude)
      )
      .order("desc")
      .take(args.limit || 30);

    if (args.userId) {
      results = results.filter((r: any) => r.userId === args.userId);
    }

    return results;
  },
});

/**
 * Clear all expired weather cache entries
 */
export const clearExpiredWeatherCache = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Clear expired weather cache
    const expiredWeather = await ctx.db
      .query("cachedWeather")
      .withIndex("by_expiration", (q) => q.lt("expiresAt", now))
      .collect();

    for (const entry of expiredWeather) {
      await ctx.db.delete(entry._id);
    }

    // Clear expired geocoding cache
    const expiredGeocoding = await ctx.db
      .query("cachedGeocoding")
      .withIndex("by_expiration", (q) => q.lt("expiresAt", now))
      .collect();

    for (const entry of expiredGeocoding) {
      await ctx.db.delete(entry._id);
    }

    return {
      clearedWeather: expiredWeather.length,
      clearedGeocoding: expiredGeocoding.length,
    };
  },
});

/**
 * Clear all weather cache for a user
 */
export const clearUserWeatherCache = mutation({
  args: {
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let weatherEntries;
    let geocodingEntries;

    if (args.userId) {
      weatherEntries = await ctx.db
        .query("cachedWeather")
        .withIndex("by_user_cache", (q) => q.eq("userId", args.userId))
        .collect();
      geocodingEntries = await ctx.db
        .query("cachedGeocoding")
        .withIndex("by_user_cache", (q) => q.eq("userId", args.userId))
        .collect();
    } else {
      weatherEntries = await ctx.db.query("cachedWeather").collect();
      geocodingEntries = await ctx.db.query("cachedGeocoding").collect();
    }

    for (const entry of weatherEntries) {
      await ctx.db.delete(entry._id);
    }
    for (const entry of geocodingEntries) {
      await ctx.db.delete(entry._id);
    }

    return {
      clearedWeather: weatherEntries.length,
      clearedGeocoding: geocodingEntries.length,
    };
  },
});

/**
 * Get weather cache statistics
 */
export const getWeatherCacheStats = query({
  args: {
    userId: v.optional(v.string()),
  },
  handler: async (ctx) => {
    const now = Date.now();

    const weatherCache = await ctx.db.query("cachedWeather").collect();
    const geocodingCache = await ctx.db.query("cachedGeocoding").collect();

    return {
      weatherCache: {
        total: weatherCache.length,
        valid: weatherCache.filter((c) => c.expiresAt > now).length,
        expired: weatherCache.filter((c) => c.expiresAt <= now).length,
      },
      geocodingCache: {
        total: geocodingCache.length,
        valid: geocodingCache.filter((c) => c.expiresAt > now).length,
        expired: geocodingCache.filter((c) => c.expiresAt <= now).length,
      },
    };
  },
});
