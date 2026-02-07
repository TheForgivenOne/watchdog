import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api.js";

export function useConvexRecentActivity() {
  const recentArticles = useQuery(api.recentArticles.list);
  const recentLocations = useQuery(api.recentLocations.list);
  const addArticle = useMutation(api.recentArticles.add);
  const addLocation = useMutation(api.recentLocations.add);
  const clearArticles = useMutation(api.recentArticles.clear);
  const clearLocations = useMutation(api.recentLocations.clear);

  return {
    recentArticles,
    recentLocations,
    addArticle,
    addLocation,
    clearArticles,
    clearLocations,
  };
}
