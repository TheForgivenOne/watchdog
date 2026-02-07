import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api.js";

export function useConvexBookmarks(articleId?: string) {
  const bookmarks = useQuery(api.bookmarks.list);
  const isBookmarked = useQuery(api.bookmarks.isBookmarked, articleId ? { articleId } : "skip");
  const addBookmark = useMutation(api.bookmarks.create);
  const removeBookmark = useMutation(api.bookmarks.remove);

  return { bookmarks, isBookmarked, addBookmark, removeBookmark };
}
