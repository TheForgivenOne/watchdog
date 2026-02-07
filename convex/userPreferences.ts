import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get user preferences
export const get = query({
  handler: async (ctx) => {
    const userId = await getUserId();
    
    const preferences = await ctx.db
      .query("userPreferences")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!preferences) {
      // Return default preferences
      return {
        userId,
        showNewsPreview: true,
        showWeatherWidget: true,
        showQuickActions: true,
        showRecentActivity: true,
        showStats: true,
        newsPreviewCount: 4,
        enableAutoRedirect: false,
        defaultSubdog: undefined,
        weatherWidgetMode: "current",
        weatherWidgetLocation: undefined,
        maxRecentItems: 10,
        updatedAt: Date.now(),
      };
    }

    return preferences;
  },
});

// Create user preferences
export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const userId = await getUserId();

    const preferencesId = await ctx.db.insert("userPreferences", {
      userId,
      ...args,
      updatedAt: Date.now(),
    });

    return preferencesId;
  },
});

// Update user preferences
export const update = mutation({
  args: {
    showNewsPreview: v.optional(v.boolean()),
    showWeatherWidget: v.optional(v.boolean()),
    showQuickActions: v.optional(v.boolean()),
    showRecentActivity: v.optional(v.boolean()),
    showStats: v.optional(v.boolean()),
    newsPreviewCount: v.optional(v.number()),
    enableAutoRedirect: v.optional(v.boolean()),
    defaultSubdog: v.optional(v.string()),
    weatherWidgetMode: v.optional(v.string()),
    weatherWidgetLocation: v.optional(v.string()),
    maxRecentItems: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId();

    const existing = await ctx.db
      .query("userPreferences")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: Date.now(),
      });
      return existing._id;
    } else {
      // Create with defaults + updates
      const preferencesId = await ctx.db.insert("userPreferences", {
        userId,
        showNewsPreview: args.showNewsPreview ?? true,
        showWeatherWidget: args.showWeatherWidget ?? true,
        showQuickActions: args.showQuickActions ?? true,
        showRecentActivity: args.showRecentActivity ?? true,
        showStats: args.showStats ?? true,
        newsPreviewCount: args.newsPreviewCount ?? 4,
        enableAutoRedirect: args.enableAutoRedirect ?? false,
        defaultSubdog: args.defaultSubdog,
        weatherWidgetMode: args.weatherWidgetMode ?? "current",
        weatherWidgetLocation: args.weatherWidgetLocation,
        maxRecentItems: args.maxRecentItems ?? 10,
        updatedAt: Date.now(),
      });
      return preferencesId;
    }
  },
});

// Helper function to get user ID (undefined for anonymous)
async function getUserId(): Promise<string | undefined> {
  // For now, return undefined (anonymous)
  // When auth is added, use: return ctx.auth.getUserIdentity()?.subject;
  return undefined;
}
