import { useQuery as useConvexQuery, useMutation as useConvexMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';

export function useCreateConversation() {
  const createMutation = useConvexMutation(api.aiAgent.createConversation);

  return {
    createConversation: async (title: string) => {
      return await createMutation({ title });
    },
  };
}

export function useConversations() {
  const conversations = useConvexQuery(api.aiAgent.getConversations);

  return {
    conversations: conversations || [],
    isLoading: conversations === undefined,
  };
}

export function useConversation(conversationId: string | null) {
  const conversation = useConvexQuery(
    api.aiAgent.getConversation,
    conversationId ? { conversationId: conversationId as Id<'aiConversations'> } : 'skip'
  );

  return {
    conversation: conversation || null,
    isLoading: conversation === undefined && conversationId !== null,
  };
}

export function useAddMessage() {
  const addMessageMutation = useConvexMutation(api.aiAgent.addMessage);

  return {
    addMessage: async (conversationId: string, role: string, content: string, toolName?: string, toolResult?: string) => {
      return await addMessageMutation({
        conversationId: conversationId as Id<'aiConversations'>,
        role,
        content,
        toolName,
        toolResult,
      });
    },
  };
}

export function useDeleteConversation() {
  const deleteMutation = useConvexMutation(api.aiAgent.deleteConversation);

  return {
    deleteConversation: async (conversationId: string) => {
      return await deleteMutation({ conversationId: conversationId as Id<'aiConversations'> });
    },
  };
}

export function useGetLatestNews() {
  return useConvexQuery(api.aiAgent.getLatestNews, {
    category: undefined,
    limit: 10,
  });
}

export function useGetWeather(latitude: number | null, longitude: number | null) {
  return useConvexQuery(
    api.aiAgent.getWeatherData,
    latitude !== null && longitude !== null
      ? { latitude, longitude }
      : 'skip'
  );
}

export function useGetBookmarks() {
  return useConvexQuery(api.aiAgent.getBookmarks, { limit: 20 });
}

export function useGetSavedLocations() {
  return useConvexQuery(api.aiAgent.getSavedLocations);
}

export function useGetRecentArticles() {
  return useConvexQuery(api.aiAgent.getRecentArticles, { limit: 20 });
}

export function useGetRecentLocations() {
  return useConvexQuery(api.aiAgent.getRecentLocations, { limit: 20 });
}

export function useGetUserPreferences() {
  return useConvexQuery(api.aiAgent.getUserPreferences);
}

export function useGetWeatherHistory(latitude: number, longitude: number) {
  return useConvexQuery(
    api.aiAgent.getWeatherHistory,
    { latitude, longitude, limit: 7 }
  );
}

export function useGetArchivedNews() {
  return useConvexQuery(api.aiAgent.getArchivedNews, { limit: 20 });
}
