import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const fetchNews = mutation({
  args: {
    category: v.optional(v.string()),
    query: v.optional(v.string()),
    country: v.optional(v.string()),
    language: v.optional(v.string()),
  },
  handler: async (_, args) => {
    const API_KEY = process.env.NEWSDATA_API_KEY;
    
    if (!API_KEY) {
      throw new Error("NEWSDATA_API_KEY is not configured on the server");
    }

    const BASE_URL = 'https://newsdata.io/api/1';

    const params = new URLSearchParams({
      apikey: API_KEY,
      language: args.language || 'en',
      ...args.category && args.category !== 'top' && { category: args.category },
      ...args.query && { q: args.query },
      ...args.country && { country: args.country },
    });

    const response = await fetch(`${BASE_URL}/news?${params}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.statusText}`);
    }

    return await response.json();
  },
});

export const fetchLatestNews = mutation({
  args: {},
  handler: async () => {
    const API_KEY = process.env.NEWSDATA_API_KEY;
    
    if (!API_KEY) {
      throw new Error("NEWSDATA_API_KEY is not configured on the server");
    }

    const BASE_URL = 'https://newsdata.io/api/1';
    const response = await fetch(`${BASE_URL}/news?apikey=${API_KEY}&language=en&category=top`);

    if (!response.ok) {
      throw new Error(`Failed to fetch latest news: ${response.statusText}`);
    }

    return await response.json();
  },
});