import { useState, useCallback, useEffect } from 'react';
import type { AiMessage } from '../types';
import {
  useCreateConversation,
  useConversations,
  useConversation,
  useAddMessage,
  useDeleteConversation,
  useGetLatestNews,
  useGetWeather,
  useGetBookmarks,
  useGetSavedLocations,
  useGetRecentArticles,
  useGetRecentLocations,
  useGetUserPreferences,
} from '../services/aiService';

const DEMO_MODE = true;

const DEMO_RESPONSES: Record<string, string> = {
  default: `I'm here to help you access your Watchdog dashboard data! I can help you with:

• **News**: Get the latest headlines and news articles
• **Weather**: Check current conditions and forecasts for your saved locations
• **Bookmarks**: View your saved articles
• **Locations**: See your saved and recent locations
• **Preferences**: Check your dashboard settings

What would you like to know about? Just ask me naturally!`,
};

export function useAiAgent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<AiMessage[]>([]);

  const { createConversation } = useCreateConversation();
  const { conversations } = useConversations();
  const { conversation } = useConversation(currentConversationId);
  const { addMessage } = useAddMessage();
  const { deleteConversation } = useDeleteConversation();

  const getLatestNews = useGetLatestNews();
  const getWeather = useGetWeather(null, null);
  const getBookmarks = useGetBookmarks();
  const getSavedLocations = useGetSavedLocations();
  const getRecentArticles = useGetRecentArticles();
  const getRecentLocations = useGetRecentLocations();
  const getUserPreferences = useGetUserPreferences();

  const openModal = useCallback(() => {
    setIsModalOpen(true);
    setIsMinimized(false);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setIsMinimized(false);
  }, []);

  const toggleMinimize = useCallback(() => {
    setIsMinimized(prev => !prev);
  }, []);

  const startNewConversation = useCallback(async () => {
    const title = `Chat ${new Date().toLocaleDateString()}`;
    const convId = await createConversation(title);
    setCurrentConversationId(convId as string);
    setMessages([]);
    return convId;
  }, [createConversation]);

  const selectConversation = useCallback((convId: string) => {
    setCurrentConversationId(convId);
  }, []);

  const removeConversation = useCallback(async (convId: string) => {
    await deleteConversation(convId);
    if (currentConversationId === convId) {
      setCurrentConversationId(null);
      setMessages([]);
    }
  }, [deleteConversation, currentConversationId]);

  const processUserMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: AiMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      if (currentConversationId) {
        await addMessage(currentConversationId, 'user', content);
      }

      if (DEMO_MODE) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let responseContent = DEMO_RESPONSES.default;
        const lowerContent = content.toLowerCase();

        if (lowerContent.includes('news') || lowerContent.includes('headline')) {
          const news = getLatestNews;
          if (news && news.results && news.results.length > 0) {
            const topArticles = news.results.slice(0, 3);
            responseContent = `Here are the latest news headlines:\n\n${topArticles.map((a: any, i: number) => `${i + 1}. ${a.title}`).join('\n')}\n\nYou can ask me to get more details or search for specific topics!`;
          } else {
            responseContent = "I can help you get news! Try asking me for 'latest news' or specify a category like 'tech news' or 'sports news'.";
          }
        } else if (lowerContent.includes('weather')) {
          const locations = getSavedLocations;
          if (locations && locations.length > 0) {
            const loc = locations[0];
            const weather = getWeather;
            if (weather) {
              responseContent = `The weather in ${loc.name} is ${weather.current?.temperature_2m}° with ${weather.current?.weather_code} conditions.\n\nWould you like more details or a forecast?`;
            } else {
              responseContent = `You have saved locations including ${loc.name}, but the weather data isn't currently available. Would you like me to try again?`;
            }
          } else {
            responseContent = "You don't have any saved locations yet. Would you like me to show you how to add one in the Weather section?";
          }
        } else if (lowerContent.includes('bookmark')) {
          const bookmarks = getBookmarks;
          if (bookmarks && bookmarks.length > 0) {
            const topBookmarks = bookmarks.slice(0, 3);
            responseContent = `You have ${bookmarks.length} bookmarked articles:\n\n${topBookmarks.map((b: any, i: number) => `${i + 1}. ${b.title}`).join('\n')}\n\nWould you like to see more?`;
          } else {
            responseContent = "You don't have any bookmarked articles yet. Would you like me to show you how to bookmark articles in the News section?";
          }
        } else if (lowerContent.includes('location') || lowerContent.includes('saved')) {
          const locations = getSavedLocations;
          if (locations && locations.length > 0) {
            responseContent = `You have ${locations.length} saved location(s):\n\n${locations.map((l: any) => `• ${l.name}${l.country ? `, ${l.country}` : ''}`).join('\n')}`;
          } else {
            responseContent = "You don't have any saved locations yet. Would you like me to show you how to add one in the Weather section?";
          }
        } else if (lowerContent.includes('recent')) {
          const recentArticles = getRecentArticles;
          const recentLocs = getRecentLocations;
          responseContent = "Here's your recent activity:\n\n";
          if (recentArticles && recentArticles.length > 0) {
            responseContent += `Recent articles viewed: ${recentArticles.length}\n`;
          }
          if (recentLocs && recentLocs.length > 0) {
            responseContent += `Recent locations searched: ${recentLocs.length}\n`;
          }
          if ((!recentArticles || recentArticles.length === 0) && (!recentLocs || recentLocs.length === 0)) {
            responseContent = "You haven't viewed any articles or searched for locations yet. Start exploring to see your activity here!";
          }
        } else if (lowerContent.includes('preference') || lowerContent.includes('setting')) {
          const prefs = getUserPreferences;
          if (prefs) {
            responseContent = `Your dashboard preferences:\n\n• News Preview: ${prefs.showNewsPreview ? 'Enabled' : 'Disabled'}\n• Weather Widget: ${prefs.showWeatherWidget ? 'Enabled' : 'Disabled'}\n• Quick Actions: ${prefs.showQuickActions ? 'Enabled' : 'Disabled'}\n• Auto Redirect: ${prefs.enableAutoRedirect ? 'Enabled' : 'Disabled'}`;
          } else {
            responseContent = "You're using default preferences. Would you like me to help you customize your dashboard settings?";
          }
        } else if (lowerContent.includes('hello') || lowerContent.includes('hi') || lowerContent.includes('hey')) {
          responseContent = "Hello! I'm your Watchdog AI assistant. I can help you access news, weather, bookmarks, and more. What would you like to know?";
        }

        const assistantMessage: AiMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: responseContent,
          timestamp: Date.now(),
        };

        setMessages(prev => [...prev, assistantMessage]);
        
        if (currentConversationId) {
          await addMessage(currentConversationId, 'assistant', responseContent);
        }
      } else {
        // Production mode - would call actual AI API
        const assistantMessage: AiMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'AI processing would happen here in production mode.',
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('[AI Agent] Error processing message:', error);
      const errorMessage: AiMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  }, [
    currentConversationId,
    addMessage,
    getLatestNews,
    getWeather,
    getBookmarks,
    getSavedLocations,
    getRecentArticles,
    getUserPreferences,
  ]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  useEffect(() => {
    if (conversation?.messages) {
      const mappedMessages: AiMessage[] = conversation.messages.map((m: any) => ({
        id: m._id,
        role: m.role as 'user' | 'assistant' | 'system' | 'tool',
        content: m.content,
        timestamp: m.timestamp,
        toolName: m.toolName,
        toolResult: m.toolResult,
      }));
      setMessages(mappedMessages);
    }
  }, [conversation]);

  return {
    isModalOpen,
    isMinimized,
    currentConversationId,
    conversations,
    messages,
    isProcessing,
    openModal,
    closeModal,
    toggleMinimize,
    startNewConversation,
    selectConversation,
    removeConversation,
    processUserMessage,
    clearMessages,
  };
}
