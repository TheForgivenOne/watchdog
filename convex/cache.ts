import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Cache expiration times (in milliseconds)
const NEWS_CACHE_DURATION = 60 * 60 * 1000; // 1 hour for news

/**
 * Helper to generate cache key from news filters
 */
function generateNewsCacheKey(
  category?: string,
  query?: string,
  country?: string,
  language?: string,
  page?: number
): string {
  const parts = [];
  if (query) parts.push(`q:${query}`);
  if (category) parts.push(`cat:${category}`);
  if (country) parts.push(`c:${country}`);
  if (language) parts.push(`l:${language}`);
  parts.push(`p:${page || 1}`);
  return parts.join("|");
}

/**
 * Archive a news article helper
 */
async function archiveNewsArticle(
  ctx: any,
  args: {
    articleId: string;
    title: string;
    link: string;
    description?: string;
    content?: string;
    imageUrl?: string;
    sourceId: string;
    sourceName: string;
    category: string[];
    country: string[];
    language: string;
    pubDate: string;
    fullData: any;
    userId?: string;
  }
) {
  // Check if article already archived for this user
  const existing = await ctx.db
    .query("newsArchive")
    .withIndex("by_article_id", (q: any) => q.eq("articleId", args.articleId))
    .filter((q: any) => q.eq(q.field("userId"), args.userId))
    .first();

  if (existing) {
    // Update if exists
    await ctx.db.patch(existing._id, {
      ...args,
      archivedAt: Date.now(),
    });
  } else {
    // Insert new archive entry
    await ctx.db.insert("newsArchive", {
      ...args,
      archivedAt: Date.now(),
    });
  }
}

/**
 * Get cached news data
 * Returns null if no valid cache exists
 */
export const getCachedNews = query({
  args: {
    category: v.optional(v.string()),
    query: v.optional(v.string()),
    country: v.optional(v.string()),
    language: v.optional(v.string()),
    page: v.optional(v.number()),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const cacheKey = generateNewsCacheKey(
      args.category,
      args.query,
      args.country,
      args.language,
      args.page
    );

    const now = Date.now();

    console.log('[Convex Cache] getCachedNews - cacheKey:', cacheKey, 'userId:', args.userId);

    // Look for valid cache entry
    let cached;
    if (args.userId) {
      cached = await ctx.db
        .query("cachedNews")
        .withIndex("by_user_cache", (q) =>
          q.eq("userId", args.userId).eq("cacheKey", cacheKey)
        )
        .unique();
    } else {
      cached = await ctx.db
        .query("cachedNews")
        .withIndex("by_cache_key", (q) => q.eq("cacheKey", cacheKey))
        .first();
    }

    if (!cached) {
      console.log('[Convex Cache] getCachedNews - No cache entry found');
      return null;
    }

    if (cached.expiresAt < now) {
      console.log('[Convex Cache] getCachedNews - Cache entry expired');
      return null;
    }

    console.log('[Convex Cache] getCachedNews - Cache HIT! expiresAt:', new Date(cached.expiresAt).toISOString());
    return {
      ...cached,
      isStale: cached.expiresAt - now < 10 * 60 * 1000, // Mark as stale if < 10 min left
    };
  },
});

/**
 * Store news data in cache
 */
export const cacheNews = mutation({
  args: {
    category: v.optional(v.string()),
    query: v.optional(v.string()),
    country: v.optional(v.string()),
    language: v.optional(v.string()),
    page: v.optional(v.number()),
    status: v.string(),
    totalResults: v.number(),
    results: v.array(v.any()),
    nextPage: v.optional(v.string()),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const cacheKey = generateNewsCacheKey(
      args.category,
      args.query,
      args.country,
      args.language,
      args.page
    );

    const now = Date.now();

    console.log('[Convex Cache] cacheNews - Storing with cacheKey:', cacheKey, 'results:', args.totalResults, 'userId:', args.userId);

    // Check if cache entry already exists
    let existing;
    if (args.userId) {
      existing = await ctx.db
        .query("cachedNews")
        .withIndex("by_user_cache", (q) =>
          q.eq("userId", args.userId).eq("cacheKey", cacheKey)
        )
        .unique();
    } else {
      existing = await ctx.db
        .query("cachedNews")
        .withIndex("by_cache_key", (q) => q.eq("cacheKey", cacheKey))
        .first();
    }

    const cacheData = {
      cacheKey,
      category: args.category,
      query: args.query,
      country: args.country,
      language: args.language,
      page: args.page,
      status: args.status,
      totalResults: args.totalResults,
      results: args.results,
      nextPage: args.nextPage,
      fetchedAt: now,
      expiresAt: now + NEWS_CACHE_DURATION,
      userId: args.userId,
    };

    if (existing) {
      console.log('[Convex Cache] cacheNews - Updating existing cache entry');
      await ctx.db.patch(existing._id, cacheData);
    } else {
      console.log('[Convex Cache] cacheNews - Creating new cache entry');
      await ctx.db.insert("cachedNews", cacheData);
    }

    // Also archive the articles for historical/analytics purposes
    for (const article of args.results) {
      await archiveNewsArticle(ctx, {
        articleId: article.article_id,
        title: article.title || '',
        link: article.link || '',
        description: article.description || undefined,
        content: article.content || undefined,
        imageUrl: article.image_url || undefined,
        sourceId: article.source_id || '',
        sourceName: article.source_name || '',
        category: article.category || [],
        country: article.country || [],
        language: article.language || '',
        pubDate: article.pubDate || '',
        fullData: article,
        userId: args.userId,
      });
    }

    return cacheData;
  },
});

/**
 * Get archived news articles
 */
export const getArchivedNews = query({
  args: {
    userId: v.optional(v.string()),
    limit: v.optional(v.number()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let results;

    if (args.userId && args.category) {
      // For array fields, filter in memory after fetching
      results = await ctx.db
        .query("newsArchive")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .order("desc")
        .take(args.limit || 100);
      // Filter by category in memory
      results = results.filter((article) =>
        article.category.includes(args.category!)
      );
    } else if (args.userId) {
      results = await ctx.db
        .query("newsArchive")
        .withIndex("by_user", (q) => q.eq("userId", args.userId))
        .order("desc")
        .take(args.limit || 100);
    } else {
      results = await ctx.db
        .query("newsArchive")
        .order("desc")
        .take(args.limit || 100);
    }

    return results;
  },
});

/**
 * Clear all expired cache entries
 * Can be run periodically via a scheduler
 */
export const clearExpiredCache = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Clear expired news cache
    const expiredNews = await ctx.db
      .query("cachedNews")
      .withIndex("by_expiration", (q) => q.lt("expiresAt", now))
      .collect();

    for (const entry of expiredNews) {
      await ctx.db.delete(entry._id);
    }

    return {
      clearedNews: expiredNews.length,
    };
  },
});

/**
 * Clear all news cache for a user
 */
export const clearUserNewsCache = mutation({
  args: {
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let entries;
    if (args.userId) {
      entries = await ctx.db
        .query("cachedNews")
        .withIndex("by_user_cache", (q) => q.eq("userId", args.userId))
        .collect();
    } else {
      entries = await ctx.db.query("cachedNews").collect();
    }

    for (const entry of entries) {
      await ctx.db.delete(entry._id);
    }

    return { cleared: entries.length };
  },
});

/**
 * Get cache statistics
 */
export const getCacheStats = query({
  args: {
    userId: v.optional(v.string()),
  },
  handler: async (ctx) => {
    const now = Date.now();

    const newsCache = await ctx.db.query("cachedNews").collect();

    const validNewsCache = newsCache.filter((c) => c.expiresAt > now);
    const expiredNewsCache = newsCache.filter((c) => c.expiresAt <= now);

    return {
      newsCache: {
        total: newsCache.length,
        valid: validNewsCache.length,
        expired: expiredNewsCache.length,
      },
    };
  },
});
