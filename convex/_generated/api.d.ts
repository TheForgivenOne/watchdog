/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as aiAgent from "../aiAgent.js";
import type * as bookmarks from "../bookmarks.js";
import type * as cache from "../cache.js";
import type * as cacheWeather from "../cacheWeather.js";
import type * as newsProxy from "../newsProxy.js";
import type * as recentArticles from "../recentArticles.js";
import type * as recentLocations from "../recentLocations.js";
import type * as savedLocations from "../savedLocations.js";
import type * as userPreferences from "../userPreferences.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  aiAgent: typeof aiAgent;
  bookmarks: typeof bookmarks;
  cache: typeof cache;
  cacheWeather: typeof cacheWeather;
  newsProxy: typeof newsProxy;
  recentArticles: typeof recentArticles;
  recentLocations: typeof recentLocations;
  savedLocations: typeof savedLocations;
  userPreferences: typeof userPreferences;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
