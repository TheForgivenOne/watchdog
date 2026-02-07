import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User preferences
  userPreferences: defineTable({
    userId: v.optional(v.string()),
    showNewsPreview: v.boolean(),
    showWeatherWidget: v.boolean(),
    showQuickActions: v.boolean(),
    showRecentActivity: v.boolean(),
    showStats: v.boolean(),
    newsPreviewCount: v.number(),
    enableAutoRedirect: v.boolean(),
    defaultSubdog: v.optional(v.string()),
    weatherWidgetMode: v.string(),
    weatherWidgetLocation: v.optional(v.string()),
    maxRecentItems: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // Saved weather locations
  savedLocations: defineTable({
    userId: v.optional(v.string()),
    name: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    country: v.optional(v.string()),
    admin1: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  // Bookmarked news articles
  bookmarks: defineTable({
    userId: v.optional(v.string()),
    articleId: v.string(),
    title: v.string(),
    source: v.string(),
    url: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    bookmarkedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_article", ["userId", "articleId"]),

  // Recent activity - articles viewed
  recentArticles: defineTable({
    userId: v.optional(v.string()),
    articleId: v.string(),
    title: v.string(),
    source: v.string(),
    url: v.string(),
    viewedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_time", ["userId", "viewedAt"]),

  // Recent activity - locations searched
  recentLocations: defineTable({
    userId: v.optional(v.string()),
    name: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    searchedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_time", ["userId", "searchedAt"]),

  // ==================== CACHED DATA TABLES ====================

  // Cached news articles from API calls
  cachedNews: defineTable({
    // Cache key based on query parameters
    cacheKey: v.string(), // e.g., "top:us:en:1" or "search:query:1"
    category: v.optional(v.string()),
    query: v.optional(v.string()),
    country: v.optional(v.string()),
    language: v.optional(v.string()),
    page: v.optional(v.number()),
    // The cached data
    status: v.string(),
    totalResults: v.number(),
    results: v.array(v.any()), // NewsArticle[]
    nextPage: v.optional(v.string()),
    // Metadata
    fetchedAt: v.number(),
    expiresAt: v.number(),
    userId: v.optional(v.string()), // Optional: user-specific cache
  })
    .index("by_cache_key", ["cacheKey"])
    .index("by_expiration", ["expiresAt"])
    .index("by_user_cache", ["userId", "cacheKey"]),

  // Cached weather data from API calls
  cachedWeather: defineTable({
    // Cache key based on location coordinates (rounded to 4 decimals for ~10m precision)
    cacheKey: v.string(), // e.g., "40.7128:-74.0060"
    latitude: v.number(),
    longitude: v.number(),
    // The cached weather data
    timezone: v.string(),
    timezoneAbbreviation: v.string(),
    elevation: v.number(),
    current: v.any(), // CurrentWeather
    daily: v.any(), // DailyWeather
    currentUnits: v.any(),
    dailyUnits: v.any(),
    // Metadata
    fetchedAt: v.number(),
    expiresAt: v.number(), // Weather cache expires faster (30 min)
    userId: v.optional(v.string()),
  })
    .index("by_cache_key", ["cacheKey"])
    .index("by_expiration", ["expiresAt"])
    .index("by_user_cache", ["userId", "cacheKey"])
    .index("by_location", ["latitude", "longitude"]),

  // Cached geocoding search results
  cachedGeocoding: defineTable({
    // Cache key based on search query
    cacheKey: v.string(), // e.g., "new york" or "london,uk"
    query: v.string(),
    // The cached results
    results: v.array(v.any()), // GeocodingResult[]
    resultCount: v.number(),
    // Metadata
    fetchedAt: v.number(),
    expiresAt: v.number(), // Geocoding cache lasts longer (24 hours)
    userId: v.optional(v.string()),
  })
    .index("by_cache_key", ["cacheKey"])
    .index("by_expiration", ["expiresAt"])
    .index("by_user_cache", ["userId", "cacheKey"]),

  // Historical weather data archive
  weatherHistory: defineTable({
    userId: v.optional(v.string()),
    locationName: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    date: v.string(), // ISO date string YYYY-MM-DD
    // Archived weather data
    temperatureMax: v.number(),
    temperatureMin: v.number(),
    weatherCode: v.number(),
    precipitationProbability: v.number(),
    // Metadata
    archivedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_location_date", ["latitude", "longitude", "date"])
    .index("by_user_location", ["userId", "locationName"]),

  // News article archive (for analytics and offline access)
  newsArchive: defineTable({
    userId: v.optional(v.string()),
    articleId: v.string(),
    title: v.string(),
    link: v.string(),
    description: v.optional(v.string()),
    content: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    sourceId: v.string(),
    sourceName: v.string(),
    category: v.array(v.string()),
    country: v.array(v.string()),
    language: v.string(),
    pubDate: v.string(),
    // Full article data as JSON
    fullData: v.any(),
    // Metadata
    archivedAt: v.number(),
  })
    .index("by_article_id", ["articleId"])
    .index("by_user", ["userId"])
    .index("by_user_category", ["userId", "category"])
    .index("by_pub_date", ["pubDate"])
    .index("by_user_date", ["userId", "archivedAt"]),
});
