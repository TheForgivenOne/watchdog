import { useQuery } from '@tanstack/react-query';
import type { NewsFilters, NewsResponse } from '../types';
import { fetchNews, fetchLatestNews } from '../services/api';

export function useNews(filters: NewsFilters = {}) {
  return useQuery<NewsResponse, Error>({
    queryKey: ['news', filters],
    queryFn: () => fetchNews(filters),
  });
}

export function useLatestNews() {
  return useQuery<NewsResponse, Error>({
    queryKey: ['news', 'latest'],
    queryFn: fetchLatestNews,
  });
}
