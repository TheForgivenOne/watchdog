import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export function useConvexPreferences() {
  const preferences = useQuery(api.userPreferences.get);
  const updatePreferences = useMutation(api.userPreferences.update);
  const createPreferences = useMutation(api.userPreferences.create);

  return { preferences, updatePreferences, createPreferences };
}
