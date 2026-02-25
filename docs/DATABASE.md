# Database Schema

Convex database schema and data models for Watchdog.

## Overview

Watchdog uses Convex as its backend database. The schema defines 10 tables organized into three categories:

1. **User Data**: Preferences, saved locations, bookmarks, recent activity
2. **Cache**: Temporary cached API responses
3. **Archive**: Historical data for analytics

## Schema File

**Location:** `convex/schema.ts`

## Tables

### User Preferences

#### `userPreferences`

Stores user dashboard configuration and widget preferences.

| Field | Type | Description |
|-------|------|-------------|
| userId | `string?` | User identifier (optional for anonymous) |
| showNewsPreview | `boolean` | Show news preview on hub |
| showWeatherWidget | `boolean` | Show weather widget on hub |
| showQuickActions | `boolean` | Show quick action buttons |
| showRecentActivity | `boolean` | Show recent activity section |
| showStats | `boolean` | Show statistics panel |
| newsPreviewCount | `number` | Number of news items to display |
| enableAutoRedirect | `boolean` | Auto-redirect to default subdog |
| defaultSubdog | `string?` | Default subdog ID for redirect |
| weatherWidgetMode | `string` | Current or saved location mode |
| weatherWidgetLocation | `string?` | Saved location ID |
| maxRecentItems | `number` | Maximum recent items to store |
| updatedAt | `number` | Last update timestamp |

**Indexes:**
- `by_user` - Query by userId

---

### Saved Data

#### `savedLocations`

User-saved weather locations.

| Field | Type | Description |
|-------|------|-------------|
| userId | `string?` | User identifier |
| name | `string` | Location name |
| latitude | `number` | Location latitude |
| longitude | `number` | Location longitude |
| country | `string?` | Country code |
| admin1 | `string?` | Admin region (state/province) |
| createdAt | `number` | Creation timestamp |

**Indexes:**
- `by_user` - Query by userId

#### `bookmarks`

Bookmarked news articles.

| Field | Type | Description |
|-------|------|-------------|
| userId | `string?` | User identifier |
| articleId | `string` | Article unique ID |
| title | `string` | Article title |
| source | `string` | News source name |
| url | `string` | Article URL |
| description | `string?` | Article description |
| imageUrl | `string?` | Article thumbnail |
| bookmarkedAt | `number` | Bookmark timestamp |

**Indexes:**
- `by_user` - Query by userId
- `by_article` - Check if article is bookmarked

---

### Recent Activity

#### `recentArticles`

Recently viewed articles.

| Field | Type | Description |
|-------|------|-------------|
| userId | `string?` | User identifier |
| articleId | `string` | Article unique ID |
| title | `string` | Article title |
| source | `string` | News source name |
| url | `string` | Article URL |
| viewedAt | `number` | View timestamp |

**Indexes:**
- `by_user` - Query by userId
- `by_user_time` - Query by userId sorted by time

#### `recentLocations`

Recently searched locations.

| Field | Type | Description |
|-------|------|-------------|
| userId | `string?` | User identifier |
| name | `string` | Location name |
| latitude | `number` | Location latitude |
| longitude | `number` | Location longitude |
| searchedAt | `number` | Search timestamp |

**Indexes:**
- `by_user` - Query by userId
- `by_user_time` - Query by userId sorted by time

---

### Cached Data (Temporary)

#### `cachedNews`

Cached news API responses with expiration.

| Field | Type | Description |
|-------|------|-------------|
| cacheKey | `string` | Composite key: `category:query:country:page` |
| category | `string?` | News category |
| query | `string?` | Search query |
| country | `string?` | Country filter |
| language | `string?` | Language filter |
| page | `number?` | Pagination number |
| status | `string` | API response status |
| totalResults | `number` | Total results count |
| results | `any[]` | Array of news articles |
| nextPage | `string?` | Pagination token |
| fetchedAt | `number` | Cache timestamp |
| expiresAt | `number` | Expiration timestamp |
| userId | `string?` | User-specific cache (optional) |

**Indexes:**
- `by_cache_key` - Retrieve by cache key
- `by_expiration` - Find expired entries
- `by_user_cache` - User-specific cache lookup

**Cache TTL:** 1 hour (60 minutes)

#### `cachedWeather`

Cached weather API responses with expiration.

| Field | Type | Description |
|-------|------|-------------|
| cacheKey | `string` | Coordinates: `lat:lng` (4 decimal precision) |
| latitude | `number` | Location latitude |
| longitude | `number` | Location longitude |
| timezone | `string` | Timezone name |
| timezoneAbbreviation | `string` | Timezone abbreviation |
| elevation | `number` | Location elevation |
| current | `any` | Current weather data |
| daily | `any` | Daily forecast data |
| currentUnits | `any` | Current data units |
| dailyUnits | `any` | Daily data units |
| fetchedAt | `number` | Cache timestamp |
| expiresAt | `number` | Expiration timestamp |
| userId | `string?` | User-specific cache (optional) |

**Indexes:**
- `by_cache_key` - Retrieve by coordinates
- `by_expiration` - Find expired entries
- `by_user_cache` - User-specific cache lookup
- `by_location` - Query by coordinates

**Cache TTL:** 30 minutes

#### `cachedGeocoding`

Cached geocoding search results with expiration.

| Field | Type | Description |
|-------|------|-------------|
| cacheKey | `string` | Lowercase search query |
| query | `string` | Original search query |
| results | `any[]` | Array of locations |
| resultCount | `number` | Number of results |
| fetchedAt | `number` | Cache timestamp |
| expiresAt | `number` | Expiration timestamp |
| userId | `string?` | User-specific cache (optional) |

**Indexes:**
- `by_cache_key` - Retrieve by query
- `by_expiration` - Find expired entries
- `by_user_cache` - User-specific cache lookup

**Cache TTL:** 24 hours

---

### Archive (Permanent)

#### `weatherHistory`

Historical weather data for analytics.

| Field | Type | Description |
|-------|------|-------------|
| userId | `string?` | User identifier |
| locationName | `string` | Location display name |
| latitude | `number` | Location latitude |
| longitude | `number` | Location longitude |
| date | `string` | ISO date (YYYY-MM-DD) |
| temperatureMax | `number` | Maximum temperature |
| temperatureMin | `number` | Minimum temperature |
| weatherCode | `number` | WMO weather code |
| precipitationProbability | `number` | Precipitation chance |
| archivedAt | `number` | Archive timestamp |

**Indexes:**
- `by_user` - Query by userId
- `by_location_date` - Query by location and date
- `by_user_location` - Query by user and location

#### `newsArchive`

Archived news articles for offline access and analytics.

| Field | Type | Description |
|-------|------|-------------|
| userId | `string?` | User identifier |
| articleId | `string` | Article unique ID |
| title | `string` | Article title |
| link | `string` | Article URL |
| description | `string?` | Article description |
| content | `string?` | Full article content |
| imageUrl | `string?` | Article thumbnail |
| sourceId | `string` | Source identifier |
| sourceName | `string` | Source name |
| category | `string[]` | Article categories |
| country | `string[]` | Country codes |
| language | `string` | Article language |
| pubDate | `string` | Publication date |
| fullData | `any` | Complete article JSON |
| archivedAt | `number` | Archive timestamp |

**Indexes:**
- `by_article_id` - Find by article ID
- `by_user` - Query by userId
- `by_user_category` - Query by user and category
- `by_pub_date` - Sort by publication date
- `by_user_date` - Query by user and archive date

---

## Data Relationships

```
userPreferences (1) ──────▶ (N) savedLocations
                              │
userPreferences (1) ──────▶ (N) bookmarks
                              │
userPreferences (1) ──────▶ (N) recentArticles
                              │
userPreferences (1) ──────▶ (N) recentLocations

cachedNews ──▶ newsArchive (1:1 via articleId)
cachedWeather ──▶ weatherHistory (N:1 via location)
```

## Query Patterns

### User-Specific Queries

```typescript
// Get user preferences
const prefs = await useQuery(api.userPreferences.get, { userId });

// Get user bookmarks
const bookmarks = await useQuery(api.bookmarks.list, { userId });

// Get recent articles
const recent = await useQuery(api.recentArticles.list, { userId });
```

### Cache Queries

```typescript
// Get cached news
const news = await useQuery(api.cache.getCachedNews, {
  cacheKey: 'technology:ai:us:1'
});

// Get cached weather
const weather = await useQuery(api.cacheWeather.getCachedWeather, {
  cacheKey: '40.7128:-74.0060'
});
```

### Archive Queries

```typescript
// Get weather history
const history = await useQuery(api.cacheWeather.getWeatherHistory, {
  latitude: 40.7128,
  longitude: -74.0060,
  startDate: '2024-01-01',
  endDate: '2024-01-31'
});
```
