# Caching System

Comprehensive documentation for Watchdog's caching implementation.

## Overview

The caching system stores all API responses from external services (news, weather, geocoding) in Convex for:
- **Performance**: Faster loading times
- **Offline Support**: Access data when APIs are unavailable
- **Historical Tracking**: Archive data for analytics and insights
- **Rate Limiting**: Reduce API calls to external services

## Architecture

### Cache Storage Layers

1. **Live Cache** (`cachedNews`, `cachedWeather`, `cachedGeocoding`)
   - Temporary storage with expiration times
   - Used for fast API response caching
   - Background refresh when stale

2. **Archive** (`newsArchive`, `weatherHistory`)
   - Permanent historical storage
   - Used for analytics and trend analysis
   - No expiration

### Cache Duration

| Cache Type | Duration | Background Refresh |
|------------|----------|-------------------|
| News Articles | 1 hour | Refresh when < 10 min left |
| Weather Data | 30 minutes | Refresh when < 5 min left |
| Geocoding | 24 hours | Refresh when expired |
| News Archive | Permanent | Never expires |
| Weather History | Permanent | Never expires |

## Database Schema

### News Cache Tables

#### `cachedNews`
- `cacheKey`: Composite key from filters (category, query, country, language, page)
- `category`, `query`, `country`, `language`, `page`: Query parameters
- `status`, `totalResults`, `results`, `nextPage`: API response data
- `fetchedAt`, `expiresAt`: Timestamps for cache management
- `userId`: Optional user-specific caching

#### `newsArchive`
- `articleId`: Unique article identifier
- `title`, `link`, `description`, `content`, `imageUrl`: Article metadata
- `sourceId`, `sourceName`: Source information
- `category`, `country`, `language`: Classification
- `pubDate`: Publication date
- `fullData`: Complete article as JSON
- `archivedAt`: When archived

### Weather Cache Tables

#### `cachedWeather`
- `cacheKey`: Coordinates rounded to 4 decimals
- `latitude`, `longitude`: Location coordinates
- `timezone`, `timezoneAbbreviation`, `elevation`: Location metadata
- `current`, `daily`, `currentUnits`, `dailyUnits`: Weather data
- `fetchedAt`, `expiresAt`: Timestamps

#### `cachedGeocoding`
- `cacheKey`: Lowercase search query
- `query`, `results`, `resultCount`: Search response
- `fetchedAt`, `expiresAt`: Timestamps

#### `weatherHistory`
- `date`: ISO date string (YYYY-MM-DD)
- `temperatureMax`, `temperatureMin`, `weatherCode`, `precipitationProbability`: Daily forecast
- `archivedAt`: When archived

See [DATABASE.md](./DATABASE.md) for complete schema details.

## API Functions

### News Cache (`convex/cache.ts`)

#### Queries
- `getCachedNews`: Retrieve cached news by filters
- `getArchivedNews`: Get historical news articles
- `getCacheStats`: Get cache statistics

#### Mutations
- `cacheNews`: Store news data in cache
- `clearUserNewsCache`: Clear all news cache for user
- `clearExpiredCache`: Remove expired entries

### Weather Cache (`convex/cacheWeather.ts`)

#### Queries
- `getCachedWeather`: Retrieve cached weather by coordinates
- `getCachedGeocoding`: Retrieve cached location search
- `getWeatherHistory`: Get historical weather data
- `getWeatherCacheStats`: Get cache statistics

#### Mutations
- `cacheWeather`: Store weather data in cache
- `cacheGeocoding`: Store geocoding results
- `clearUserWeatherCache`: Clear all weather cache for user
- `clearExpiredWeatherCache`: Remove expired entries

## Frontend Hooks

### Cached Hooks (`src/cacheExports.ts`)

#### News Hooks
- `useCachedNews`: News with cache support and background refresh
- `useCachedLatestNews`: Latest news with caching
- `useArchivedNews`: Access historical articles
- `useNewsCacheStats`: Cache statistics
- `useClearNewsCache`: Clear cache manually

#### Weather Hooks
- `useCachedWeather`: Weather with cache support and background refresh
- `useCachedLocationSearch`: Location search with caching
- `useWeatherHistory`: Historical weather data
- `useWeatherCacheStats`: Cache statistics
- `useClearWeatherCache`: Clear cache manually

#### Management Hooks
- `useAllCacheStats`: Combined statistics from all caches
- `useClearAllCache`: Clear all caches
- `useCleanupExpiredCache`: Cleanup expired entries
- `CACHE_CONFIG`: Configuration constants
- `isCacheEnabled`, `setCacheEnabled`: Cache control utilities

## Component Integration

### Dashboard Updates

#### NewsPreview Component
- Uses `useCachedLatestNews` instead of `useLatestNews`
- Shows cached status and stale indicators
- Background refresh when data is stale

#### WeatherWidget Component
- Uses `useCachedWeather` instead of `useWeather`
- Faster loading with cached data
- Automatic background refresh

#### CacheStats Component
- Real-time cache statistics display
- Visual indicators for cache health
- Cache management controls

## Usage Examples

### Basic Cached Data Fetch

```typescript
// News with caching
const { data, isLoading, isCached, isStale } = useCachedNews(
  { category: 'technology', query: 'AI' },
  userId
);

// Weather with caching
const { data: weather, isLoading: weatherLoading } = useCachedWeather(
  latitude,
  longitude,
  'celsius',
  userId
);

// Location search with caching
const { data: locations } = useCachedLocationSearch('New York', userId);
```

### Cache Management

```typescript
// Get statistics
const { news, weather, totalCached, totalExpired } = useAllCacheStats();

// Clear cache
const { clearAll, clearNews, clearWeather } = useClearAllCache();
await clearAll(userId);

// Cleanup expired
const { cleanup } = useCleanupExpiredCache();
const result = await cleanup();
```

## Performance Benefits

1. **Reduced API Calls**: 80-90% fewer calls to external APIs
2. **Faster Loading**: Cached data loads instantly
3. **Background Updates**: Silent refresh maintains data freshness
4. **Offline Support**: Access cached data without internet
5. **Rate Limiting**: Stay within API rate limits

## Historical Analytics

### News Archive
- Track article trends over time
- Analyze category distribution
- Monitor source patterns
- Generate reading history

### Weather History
- Climate data analysis
- Weather pattern tracking
- Historical comparisons
- Data for ML models

## Cache Invalidation

### Automatic
- Time-based expiration
- Background refresh when stale
- Cleanup of expired entries

### Manual
- User-initiated cache clear
- Emergency cache reset
- Development/testing cache flush

## Configuration

### Cache Configuration

Cache durations are adjustable via `CACHE_CONFIG`:

```typescript
export const CACHE_CONFIG = {
  news: {
    ttl: 60 * 60 * 1000,      // 1 hour
    staleMargin: 10 * 60 * 1000, // 10 minutes
  },
  weather: {
    ttl: 30 * 60 * 1000,      // 30 minutes
    staleMargin: 5 * 60 * 1000,  // 5 minutes
  },
  geocoding: {
    ttl: 24 * 60 * 60 * 1000, // 24 hours
  }
};
```

### Enable/Disable Cache

```typescript
import { isCacheEnabled, setCacheEnabled } from './cacheExports';

// Check if cache is enabled
const enabled = isCacheEnabled();

// Disable cache (for debugging)
setCacheEnabled(false);

// Re-enable cache
setCacheEnabled(true);
```

## Testing

- Mock Convex functions for unit tests
- Test cache hit/miss scenarios
- Verify background refresh logic

## Troubleshooting

### Common Issues

**Cache Not Updating**
- Check expiration timestamps
- Verify background refresh triggers
- Clear cache manually

**Memory Usage High**
- Reduce cache durations
- Implement size limits
- Increase cleanup frequency

**API Errors**
- Fallback to fresh data
- Exponential backoff
- Error boundary handling

### Performance Monitoring

```typescript
// Monitor cache performance
const stats = useAllCacheStats();
console.log('Cache hit rate:', stats.totalValid / stats.totalCached);
console.log('Expired entries:', stats.totalExpired);
```

## Future Enhancements

1. **Smart Caching**: ML-based cache duration optimization
2. **Preloading**: Cache popular content proactively
3. **Compression**: Reduce storage footprint
4. **Sync**: Cross-device cache synchronization
5. **Analytics**: Cache hit/miss ratio tracking
6. **CDN**: Edge caching for static content
