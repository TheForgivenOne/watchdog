import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List recent locations for user
export const list = query({
  handler: async (ctx) => {
    const userId = await getUserId();

    const locations = await ctx.db
      .query("recentLocations")
      .withIndex("by_user_time", (q) => q.eq("userId", userId))
      .order("desc")
      .take(10);

    return locations;
  },
});

// Add location search
export const add = mutation({
  args: {
    name: v.string(),
    latitude: v.number(),
    longitude: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId();

    // Remove existing entry for this location (to move to top)
    const existing = await ctx.db
      .query("recentLocations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) =>
        q.and(
          q.eq(q.field("latitude"), args.latitude),
          q.eq(q.field("longitude"), args.longitude)
        )
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    }

    // Add new entry
    await ctx.db.insert("recentLocations", {
      userId,
      ...args,
      searchedAt: Date.now(),
    });

    // Clean up old entries (keep only 20 most recent)
    const allLocations = await ctx.db
      .query("recentLocations")
      .withIndex("by_user_time", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    if (allLocations.length > 20) {
      const toDelete = allLocations.slice(20);
      for (const location of toDelete) {
        await ctx.db.delete(location._id);
      }
    }
  },
});

// Clear all recent locations
export const clear = mutation({
  handler: async (ctx) => {
    const userId = await getUserId();

    const locations = await ctx.db
      .query("recentLocations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const location of locations) {
      await ctx.db.delete(location._id);
    }
  },
});

// Helper function
async function getUserId(): Promise<string | undefined> {
  return undefined;
}
