export interface NewsArticle {
  article_id: string;
  title: string;
  link: string;
  keywords: string[] | null | undefined;
  creator: string[] | null | undefined;
  video_url: string | null | undefined;
  description: string | null | undefined;
  content: string | null | undefined;
  pubDate: string;
  pubDateTZ: string;
  image_url: string | null | undefined;
  source_id: string;
  source_priority: number;
  source_name: string;
  source_url: string;
  source_icon: string | null | undefined;
  language: string;
  country: string[];
  category: string[];
  ai_tag: string;
  sentiment: string;
  sentiment_stats: string | null | undefined;
  ai_region: string;
  ai_org: string | null | undefined;
  duplicate: boolean;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  results: NewsArticle[];
  nextPage: string | null | undefined;
}

export interface NewsFilters {
  category?: string;
  query?: string;
  country?: string;
  language?: string;
}

export type NewsCategory = 
  | 'top'
  | 'business'
  | 'entertainment'
  | 'environment'
  | 'food'
  | 'health'
  | 'politics'
  | 'science'
  | 'sports'
  | 'technology'
  | 'tourism'
  | 'world';
