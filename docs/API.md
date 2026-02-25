# External API Integrations

Documentation for all external APIs used in Watchdog.

## Overview

Watchdog integrates with two external APIs:

1. **NewsData.io** - News articles and headlines
2. **Open-Meteo** - Weather data and geocoding

## NewsData.io

### Overview

| Property | Value |
|----------|-------|
| Base URL | `https://newsdata.io/api/1` |
| API Key | Required (environment variable) |
| Rate Limit | Varies by plan (free tier: 200 requests/day) |
| Documentation | [newsdata.io](https://newsdata.io/documentation) |

### Environment Setup

```bash
# Add to .env.local
VITE_NEWSDATA_API_KEY=your_api_key_here
```

Get your API key from [newsdata.io](https://newsdata.io).

### Endpoints

#### Get News

```
GET /news?apikey={API_KEY}&language=en&category={category}&q={query}&country={country}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| apikey | string | Yes | Your API key |
| language | string | No | Language code (default: en) |
| category | string | No | Category (top, business, technology, sports, etc.) |
| q | string | No | Search query |
| country | string | No | Country code (us, gb, etc.) |
| page | string | No | Pagination token |

**Response:**

```typescript
interface NewsResponse {
  status: 'success' | 'error';
  totalResults: number;
  results: NewsArticle[];
  nextPage: string | null;
}

interface NewsArticle {
  article_id: string;
  title: string;
  link: string;
  keywords: string[];
  creator: string[];
  description: string;
  content: string;
  pubDate: string;
  image_url: string;
  source_id: string;
  source_name: string;
  language: string;
  country: string[];
  category: string[];
  // ... additional fields
}
```

### Categories

Available news categories:
- `top` - Top headlines
- `business`
- `technology`
- `sports`
- `science`
- `health`
- `entertainment`

### Implementation

**Source File:** `src/subdogs/news/services/api.ts`

```typescript
import { fetchNews, fetchLatestNews } from './services/api';

// Fetch news with filters
const news = await fetchNews({
  category: 'technology',
  query: 'AI',
  country: 'us'
});

// Fetch top headlines
const latest = await fetchLatestNews();
```

### Mock Data

When no API key is configured, the app returns mock news data for development. Check the console for a warning message.

---

## Open-Meteo

### Overview

| Property | Value |
|----------|-------|
| Weather URL | `https://api.open-meteo.com/v1` |
| Geocoding URL | `https://geocoding-api.open-meteo.com/v1` |
| API Key | **Not required** |
| Rate Limit | None (fair use policy) |
| Documentation | [open-meteo.com](https://open-meteo.com/en/docs) |

### Endpoints

#### Weather Forecast

```
GET https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=...&daily=...
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| latitude | number | Yes | Location latitude |
| longitude | number | Yes | Location longitude |
| current | string | No | Current weather variables |
| daily | string | No | Daily weather variables |
| temperature_unit | string | No | celsius or fahrenheit |
| timezone | string | No | Timezone (auto for local) |
| forecast_days | number | No | Number of forecast days (1-16) |

**Default Variables:**

- Current: `temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure,is_day`
- Daily: `weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max`

**Response:**

```typescript
interface WeatherResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
    surface_pressure: number;
    is_day: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
}
```

#### Location Search (Geocoding)

```
GET https://geocoding-api.open-meteo.com/v1/search?name={query}&count=5&language=en&format=json
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| name | string | Yes | Location name |
| count | number | No | Number of results (default: 5) |
| language | string | No | Language (default: en) |
| format | string | No | Response format (default: json) |

**Response:**

```typescript
interface GeocodingResponse {
  results?: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    admin1?: string;
  }[];
}
```

### Weather Codes

Open-Meteo uses WMO weather codes:

| Code | Description |
|------|-------------|
| 0 | Clear sky |
| 1, 2, 3 | Mainly clear, partly cloudy, overcast |
| 45, 48 | Fog |
| 51, 53, 55 | Drizzle |
| 61, 63, 65 | Rain |
| 71, 73, 75 | Snow |
| 80, 81, 82 | Rain showers |
| 95 | Thunderstorm |

### Implementation

**Source Files:**
- Weather: `src/subdogs/weather/services/api.ts`
- Geocoding: `src/subdogs/weather/services/api.ts`

```typescript
import { fetchWeather, searchLocations } from './services/api';

// Search for locations
const locations = await searchLocations('New York');

// Fetch weather
const weather = await fetchWeather(40.7128, -74.0060, 'celsius');
```

---

## API Comparison

| Feature | NewsData.io | Open-Meteo |
|---------|-------------|------------|
| API Key Required | Yes | No |
| Authentication | API key in query | None |
| Rate Limit | 200/day (free) | None |
| Data Type | News articles | Weather, Geocoding |
| Caching | Recommended | Recommended |

## Rate Limiting Strategy

To stay within rate limits:

1. **Caching**: All API responses are cached in Convex
2. **Background Refresh**: Stale data refreshes automatically
3. **User-specific Cache**: Optional per-user caching

See [CACHING.md](./CACHING.md) for details.
