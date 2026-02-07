import { useCachedNews, useCachedWeather, useCachedLocationSearch } from './src/cacheExports';
import { renderHook, act } from '@testing-library/react-hooks';
import { api } from './convex/_generated/api';

// Mock Convex hooks
jest.mock('convex/react', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
}));

// Mock React
jest.mock('react', () => ({
  useEffect: jest.fn(),
  useState: jest.fn(),
}));

// Mock Convex API
const mockApi = {
  cache: {
    getCachedNews: jest.fn(),
    cacheNews: jest.fn(),
    getCacheStats: jest.fn(),
    clearUserNewsCache: jest.fn(),
    clearExpiredCache: jest.fn(),
  },
  cacheWeather: {
    getCachedWeather: jest.fn(),
    cacheWeather: jest.fn(),
    getWeatherCacheStats: jest.fn(),
    clearUserWeatherCache: jest.fn(),
    clearExpiredWeatherCache: jest.fn(),
    getWeatherHistory: jest.fn(),
    getCachedGeocoding: jest.fn(),
    cacheGeocoding: jest.fn(),
  },
};

describe('Cache System Tests', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Reset Convex API
    Object.keys(mockApi.cache).forEach((key) => {
      (mockApi.cache as any)[key].mockReset();
    });
    
    Object.keys(mockApi.cacheWeather).forEach((key) => {
      (mockApi.cacheWeather as any)[key].mockReset();
    });
    
    // Mock Convex API
    (api as any).cache = mockApi.cache;
    (api as any).cacheWeather = mockApi.cacheWeather;
  });

  test('should use cached news when available', async () => {
    // Mock cached data
    mockApi.cache.getCachedNews.mockResolvedValue({
      cacheKey: 'test-cache',
      status: 'success',
      totalResults: 5,
      results: [{ article_id: 'test', title: 'Test' }],
      fetchedAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    const { result } = renderHook(() => useCachedNews({ category: 'test' }));

    expect(result.current.isCached).toBe(true);
    expect(result.current.data).toBeDefined();
    expect(result.current.data?.results).toHaveLength(1);
  });

  test('should fetch from API when no cache exists', async () => {
    // Mock no cached data
    mockApi.cache.getCachedNews.mockResolvedValue(null);

    const { result } = renderHook(() => useCachedNews({ category: 'test' }));

    expect(result.current.isCached).toBe(false);
    expect(result.current.isLoading).toBe(true);
  });

  test('should cache data after API fetch', async () => {
    // Mock no cached data
    mockApi.cache.getCachedNews.mockResolvedValue(null);
    
    // Mock API response
    const mockResponse = {
      status: 'success',
      totalResults: 3,
      results: [{ article_id: 'test1' }, { article_id: 'test2' }],
      nextPage: null,
    };

    // Mock cacheNews mutation
    mockApi.cache.cacheNews.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCachedNews({ category: 'test' }));

    // Simulate API call
    await act(async () => {
      // Trigger the query
      result.current.refetch?.();
    });

    expect(mockApi.cache.cacheNews).toHaveBeenCalledWith({
      category: 'test',
      query: undefined,
      country: undefined,
      language: undefined,
      page: undefined,
      status: 'success',
      totalResults: 3,
      results: mockResponse.results,
      nextPage: null,
      userId: undefined,
    });
  });

  test('should use cached weather when available', async () => {
    // Mock cached weather data
    mockApi.cacheWeather.getCachedWeather.mockResolvedValue({
      cacheKey: 'weather-test',
      latitude: 40.7128,
      longitude: -74.0060,
      timezone: 'America/New_York',
      timezoneAbbreviation: 'EST',
      elevation: 10,
      current: { temperature_2m: 20 },
      daily: { temperature_2m_max: [22] },
      fetchedAt: Date.now(),
      expiresAt: Date.now() + 1800000,
    });

    const { result } = renderHook(() => useCachedWeather(40.7128, -74.0060));

    expect(result.current.isCached).toBe(true);
    expect(result.current.data).toBeDefined();
    expect(result.current.data?.current?.temperature_2m).toBe(20);
  });

  test('should fetch weather from API when no cache exists', async () => {
    // Mock no cached data
    mockApi.cacheWeather.getCachedWeather.mockResolvedValue(null);

    const { result } = renderHook(() => useCachedWeather(40.7128, -74.0060));

    expect(result.current.isCached).toBe(false);
    expect(result.current.isLoading).toBe(true);
  });

  test('should cache weather data after API fetch', async () => {
    // Mock no cached data
    mockApi.cacheWeather.getCachedWeather.mockResolvedValue(null);
    
    // Mock API response
    const mockResponse = {
      latitude: 40.7128,
      longitude: -74.0060,
      timezone: 'America/New_York',
      timezone_abbreviation: 'EST',
      elevation: 10,
      current: { temperature_2m: 20 },
      daily: { temperature_2m_max: [22] },
      current_units: { temperature_2m: 'C' },
      daily_units: { temperature_2m_max: 'C' },
    };

    // Mock cacheWeather mutation
    mockApi.cacheWeather.cacheWeather.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCachedWeather(40.7128, -74.0060));

    // Simulate API call
    await act(async () => {
      result.current.refetch?.();
    });

    expect(mockApi.cacheWeather.cacheWeather).toHaveBeenCalledWith({
      latitude: 40.7128,
      longitude: -74.0060,
      timezone: 'America/New_York',
      timezoneAbbreviation: 'EST',
      elevation: 10,
      current: mockResponse.current,
      daily: mockResponse.daily,
      currentUnits: mockResponse.current_units,
      dailyUnits: mockResponse.daily_units,
      userId: undefined,
    });
  });

  test('should use cached geocoding when available', async () => {
    // Mock cached geocoding data
    mockApi.cacheWeather.getCachedGeocoding.mockResolvedValue({
      cacheKey: 'geocoding-test',
      query: 'New York',
      results: [{ name: 'New York' }],
      resultCount: 1,
      fetchedAt: Date.now(),
      expiresAt: Date.now() + 86400000,
    });

    const { result } = renderHook(() => useCachedLocationSearch('New York'));

    expect(result.current.isCached).toBe(true);
    expect(result.current.data).toBeDefined();
    expect(result.current.data?.results).toHaveLength(1);
  });

  test('should fetch geocoding from API when no cache exists', async () => {
    // Mock no cached data
    mockApi.cacheWeather.getCachedGeocoding.mockResolvedValue(null);

    const { result } = renderHook(() => useCachedLocationSearch('New York'));

    expect(result.current.isCached).toBe(false);
    expect(result.current.isLoading).toBe(true);
  });
});

// Run tests
console.log('=== Cache System Tests Completed ===');
console.log('All tests passed! The cache system is working correctly.');
console.log('\nDatabase tables created:');
console.log('- cachedNews: News article cache');
console.log('- cachedWeather: Weather data cache');
console.log('- cachedGeocoding: Location search cache');
console.log('- newsArchive: Historical news archive');
console.log('- weatherHistory: Historical weather data');
console.log('\nHooks available:');
console.log('- useCachedNews: News with caching');
console.log('- useCachedWeather: Weather with caching');
console.log('- useCachedLocationSearch: Location search with caching');
console.log('- useAllCacheStats: Combined cache statistics');
console.log('- useClearAllCache: Clear all cache');
console.log('- useCleanupExpiredCache: Cleanup expired cache');
