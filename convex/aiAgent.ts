import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

async function getUserId(): Promise<string | undefined> {
  return undefined;
}

export const createConversation = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId();
    const now = Date.now();

    const conversationId = await ctx.db.insert("aiConversations", {
      userId,
      title: args.title,
      preview: '',
      messageCount: 0,
      createdAt: now,
      updatedAt: now,
    });

    return conversationId;
  },
});

export const getConversations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId();

    const conversations = await ctx.db
      .query("aiConversations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(20);

    return conversations;
  },
});

export const getConversation = query({
  args: {
    conversationId: v.id("aiConversations"),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) return null;

    const messages = await ctx.db
      .query("aiMessages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .order("asc")
      .collect();

    return {
      ...conversation,
      messages,
    };
  },
});

export const addMessage = mutation({
  args: {
    conversationId: v.id("aiConversations"),
    role: v.string(),
    content: v.string(),
    toolName: v.optional(v.string()),
    toolResult: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const messageId = await ctx.db.insert("aiMessages", {
      conversationId: args.conversationId,
      role: args.role,
      content: args.content,
      toolName: args.toolName,
      toolResult: args.toolResult,
      timestamp: now,
    });

    const conversation = await ctx.db.get(args.conversationId);
    if (conversation) {
      const preview = args.content.substring(0, 100);
      await ctx.db.patch(args.conversationId, {
        preview,
        messageCount: conversation.messageCount + 1,
        updatedAt: now,
      });
    }

    return messageId;
  },
});

export const deleteConversation = mutation({
  args: {
    conversationId: v.id("aiConversations"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("aiMessages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    await ctx.db.delete(args.conversationId);
  },
});

export const getUserPreferences = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId();

    const preferences = await ctx.db
      .query("userPreferences")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return preferences || null;
  },
});

export const getBookmarks = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId();

    const bookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(args.limit || 20);

    return bookmarks;
  },
});

export const getSavedLocations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId();

    const locations = await ctx.db
      .query("savedLocations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return locations;
  },
});

export const getRecentArticles = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId();

    const articles = await ctx.db
      .query("recentArticles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(args.limit || 20);

    return articles;
  },
});

export const getRecentLocations = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId();

    const locations = await ctx.db
      .query("recentLocations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(args.limit || 20);

    return locations;
  },
});

export const getLatestNews = query({
  args: {
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId();
    const now = Date.now();

    const cacheKey = args.category ? `top|${args.category}` : 'top';

    const cached = userId
      ? await ctx.db
          .query("cachedNews")
          .withIndex("by_user_cache", (q) =>
            q.eq("userId", userId).eq("cacheKey", cacheKey)
          )
          .first()
      : await ctx.db
          .query("cachedNews")
          .withIndex("by_cache_key", (q) => q.eq("cacheKey", cacheKey))
          .first();

    if (!cached || cached.expiresAt < now) {
      return null;
    }

    return {
      ...cached,
      results: cached.results.slice(0, args.limit || 10),
    };
  },
});

export const getWeatherData = query({
  args: {
    latitude: v.number(),
    longitude: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId();
    const now = Date.now();

    const lat = args.latitude.toFixed(4);
    const lon = args.longitude.toFixed(4);
    const cacheKey = `${lat}:${lon}`;

    const cached = userId
      ? await ctx.db
          .query("cachedWeather")
          .withIndex("by_user_cache", (q) =>
            q.eq("userId", userId).eq("cacheKey", cacheKey)
          )
          .first()
      : await ctx.db
          .query("cachedWeather")
          .withIndex("by_cache_key", (q) => q.eq("cacheKey", cacheKey))
          .first();

    if (!cached || cached.expiresAt < now) {
      return null;
    }

    return cached;
  },
});

export const getWeatherHistory = query({
  args: {
    latitude: v.number(),
    longitude: v.number(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId();

    let results = await ctx.db
      .query("weatherHistory")
      .withIndex("by_location_date", (q) =>
        q.eq("latitude", args.latitude).eq("longitude", args.longitude)
      )
      .order("desc")
      .take(args.limit || 7);

    if (userId) {
      results = results.filter((r) => r.userId === userId);
    }

    return results;
  },
});

export const getArchivedNews = query({
  args: {
    limit: v.optional(v.number()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId();

    let results;

    if (userId && args.category) {
      results = await ctx.db
        .query("newsArchive")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .order("desc")
        .take(args.limit || 20);
      results = results.filter((article) =>
        article.category.includes(args.category!)
      );
    } else if (userId) {
      results = await ctx.db
        .query("newsArchive")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .order("desc")
        .take(args.limit || 20);
    } else {
      results = await ctx.db
        .query("newsArchive")
        .order("desc")
        .take(args.limit || 20);
    }

    return results;
  },
});
