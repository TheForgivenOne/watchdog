import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List bookmarks for user
export const list = query({
  handler: async (ctx) => {
    const userId = await getUserId();

    const bookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return bookmarks;
  },
});

// Check if article is bookmarked
export const isBookmarked = query({
  args: {
    articleId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId();

    const bookmark = await ctx.db
      .query("bookmarks")
      .withIndex("by_article", (q) =>
        q.eq("userId", userId).eq("articleId", args.articleId)
      )
      .first();

    return bookmark !== null;
  },
});

// Create bookmark
export const create = mutation({
  args: {
    articleId: v.string(),
    title: v.string(),
    source: v.string(),
    url: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId();

    // Check if already bookmarked
    const existing = await ctx.db
      .query("bookmarks")
      .withIndex("by_article", (q) =>
        q.eq("userId", userId).eq("articleId", args.articleId)
      )
      .first();

    if (existing) {
      return existing._id;
    }

    const bookmarkId = await ctx.db.insert("bookmarks", {
      userId,
      ...args,
      bookmarkedAt: Date.now(),
    });

    return bookmarkId;
  },
});

// Remove bookmark
export const remove = mutation({
  args: {
    articleId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId();

    const bookmark = await ctx.db
      .query("bookmarks")
      .withIndex("by_article", (q) =>
        q.eq("userId", userId).eq("articleId", args.articleId)
      )
      .first();

    if (bookmark) {
      await ctx.db.delete(bookmark._id);
    }
  },
});

// Helper function
async function getUserId(): Promise<string | undefined> {
  return undefined;
}
