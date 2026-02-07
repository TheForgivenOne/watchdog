import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List saved locations for user
export const list = query({
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

// Create saved location
export const create = mutation({
  args: {
    name: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    country: v.optional(v.string()),
    admin1: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId();

    // Check if location already exists
    const existing = await ctx.db
      .query("savedLocations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) =>
        q.and(
          q.eq(q.field("latitude"), args.latitude),
          q.eq(q.field("longitude"), args.longitude)
        )
      )
      .first();

    if (existing) {
      return existing._id;
    }

    const locationId = await ctx.db.insert("savedLocations", {
      userId,
      ...args,
      createdAt: Date.now(),
    });

    return locationId;
  },
});

// Remove saved location
export const remove = mutation({
  args: {
    locationId: v.id("savedLocations"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.locationId);
  },
});

// Helper function to get user ID
async function getUserId(): Promise<string | undefined> {
  return undefined; // Anonymous for now
}
