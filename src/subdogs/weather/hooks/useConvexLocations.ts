import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api.js";
import type { Id } from "../../../../convex/_generated/dataModel";

export function useConvexLocations() {
  const locations = useQuery(api.savedLocations.list);
  const addLocation = useMutation(api.savedLocations.create);
  const removeLocation = useMutation(api.savedLocations.remove);

  const handleRemoveLocation = (locationId: Id<"savedLocations">) => {
    return removeLocation({ locationId });
  };

  // Convex useQuery returns undefined while loading
  const isLoading = locations === undefined;

  return { locations, isLoading, addLocation, removeLocation: handleRemoveLocation };
}
