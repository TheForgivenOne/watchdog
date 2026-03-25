export interface AiMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  timestamp: number;
  toolName?: string;
  toolResult?: string;
}

export interface AiTool {
  name: string;
  description: string;
  parameters: AiToolParameter[];
  category: 'news' | 'weather' | 'bookmarks' | 'locations' | 'preferences' | 'general';
}

export interface AiToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object';
  description: string;
  required: boolean;
  enum?: string[];
}

export interface AiConversation {
  id: string;
  messages: AiMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface AiToolCall {
  toolName: string;
  arguments: Record<string, unknown>;
}

export interface AiResponse {
  content: string;
  toolCalls?: AiToolCall[];
  sources?: string[];
}

export interface AiConversationSummary {
  id: string;
  title: string;
  preview: string;
  messageCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface ToolExecutionResult {
  success: boolean;
  data?: unknown;
  error?: string;
  executionTime: number;
}

export interface AiAgentState {
  isOpen: boolean;
  isMinimized: boolean;
  conversations: AiConversationSummary[];
  currentConversationId: string | null;
}

export type ModalView = 'chat' | 'full';
