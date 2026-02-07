import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List recent articles for user
export const list = query({
  handler: async (ctx) => {
    const userId = await getUserId();

    const articles = await ctx.db
      .query("recentArticles")
      .withIndex("by_user_time", (q) => q.eq("userId", userId))
      .order("desc")
      .take(10);

    return articles;
  },
});

// Add article view
export const add = mutation({
  args: {
    articleId: v.string(),
    title: v.string(),
    source: v.string(),
    url: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId();

    // Remove existing entry for this article (to move to top)
    const existing = await ctx.db
      .query("recentArticles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("articleId"), args.articleId))
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }

    // Add new entry
    await ctx.db.insert("recentArticles", {
      userId,
      ...args,
      viewedAt: Date.now(),
    });

    // Clean up old entries (keep only 20 most recent)
    const allArticles = await ctx.db
      .query("recentArticles")
      .withIndex("by_user_time", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    if (allArticles.length > 20) {
      const toDelete = allArticles.slice(20);
      for (const article of toDelete) {
        await ctx.db.delete(article._id);
      }
    }
  },
});

// Clear all recent articles
export const clear = mutation({
  handler: async (ctx) => {
    const userId = await getUserId();

    const articles = await ctx.db
      .query("recentArticles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const article of articles) {
      await ctx.db.delete(article._id);
    }
  },
});

// Helper function
async function getUserId(): Promise<string | undefined> {
  return undefined;
}
