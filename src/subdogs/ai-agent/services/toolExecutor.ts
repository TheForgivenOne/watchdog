import type { AiTool, AiToolCall } from '../types';

export const AVAILABLE_TOOLS: AiTool[] = [
  {
    name: 'get_latest_news',
    description: 'Get the latest news headlines. You can specify a category like "technology", "sports", "business", "health", "science", "entertainment", or "top" for general news.',
    parameters: [
      {
        name: 'category',
        type: 'string',
        description: 'Category of news: technology, sports, business, health, science, entertainment, or top',
        required: false,
      },
      {
        name: 'limit',
        type: 'number',
        description: 'Number of articles to return (default: 5)',
        required: false,
      },
    ],
    category: 'news',
  },
  {
    name: 'get_weather',
    description: 'Get current weather and forecast for a specific location. You need latitude and longitude coordinates.',
    parameters: [
      {
        name: 'latitude',
        type: 'number',
        description: 'Latitude of the location',
        required: true,
      },
      {
        name: 'longitude',
        type: 'number',
        description: 'Longitude of the location',
        required: true,
      },
    ],
    category: 'weather',
  },
  {
    name: 'get_bookmarks',
    description: 'Get the user\'s bookmarked news articles.',
    parameters: [
      {
        name: 'limit',
        type: 'number',
        description: 'Number of bookmarks to return (default: 10)',
        required: false,
      },
    ],
    category: 'bookmarks',
  },
  {
    name: 'get_saved_locations',
    description: 'Get the user\'s saved weather locations.',
    parameters: [],
    category: 'locations',
  },
  {
    name: 'get_recent_articles',
    description: 'Get recently viewed news articles.',
    parameters: [
      {
        name: 'limit',
        type: 'number',
        description: 'Number of articles to return (default: 10)',
        required: false,
      },
    ],
    category: 'news',
  },
  {
    name: 'get_recent_locations',
    description: 'Get recently searched locations.',
    parameters: [
      {
        name: 'limit',
        type: 'number',
        description: 'Number of locations to return (default: 10)',
        required: false,
      },
    ],
    category: 'locations',
  },
  {
    name: 'get_user_preferences',
    description: 'Get the user\'s preferences and settings.',
    parameters: [],
    category: 'preferences',
  },
  {
    name: 'get_weather_history',
    description: 'Get historical weather data for a location.',
    parameters: [
      {
        name: 'latitude',
        type: 'number',
        description: 'Latitude of the location',
        required: true,
      },
      {
        name: 'longitude',
        type: 'number',
        description: 'Longitude of the location',
        required: true,
      },
      {
        name: 'limit',
        type: 'number',
        description: 'Number of days of history (default: 7)',
        required: false,
      },
    ],
    category: 'weather',
  },
  {
    name: 'get_archived_news',
    description: 'Get archived news articles that the user has saved or viewed.',
    parameters: [
      {
        name: 'limit',
        type: 'number',
        description: 'Number of articles to return (default: 10)',
        required: false,
      },
      {
        name: 'category',
        type: 'string',
        description: 'Filter by category',
        required: false,
      },
    ],
    category: 'news',
  },
];

export function parseToolCallsFromResponse(response: string): AiToolCall[] {
  const toolCalls: AiToolCall[] = [];
  
  const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[1]);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (item.tool && item.args) {
            toolCalls.push({
              toolName: item.tool,
              arguments: item.args,
            });
          }
        }
      } else if (parsed.tool && parsed.args) {
        toolCalls.push({
          toolName: parsed.tool,
          arguments: parsed.args,
        });
      }
    } catch {
      console.error('[ToolExecutor] Failed to parse JSON from response');
    }
  }
  
  return toolCalls;
}

export function findToolByName(name: string): AiTool | undefined {
  return AVAILABLE_TOOLS.find(tool => tool.name === name);
}

export function validateToolArguments(tool: AiTool, args: Record<string, unknown>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  for (const param of tool.parameters) {
    if (param.required && !(param.name in args)) {
      errors.push(`Missing required parameter: ${param.name}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

export function formatToolResult(_toolName: string, result: unknown): string {
  try {
    return JSON.stringify(result, null, 2);
  } catch {
    return String(result);
  }
}

export function getToolsDescription(): string {
  return AVAILABLE_TOOLS.map(tool => {
    const params = tool.parameters
      .map(p => `${p.name}${p.required ? '*' : ''}: ${p.type}`)
      .join(', ');
    return `- ${tool.name}(${params}): ${tool.description}`;
  }).join('\n');
}

export function getSystemPrompt(): string {
  return `You are a helpful AI assistant for a personal dashboard application called "Watchdog". 

You have access to the following tools to help users:

${getToolsDescription()}

Guidelines:
1. When users ask about news, weather, bookmarks, or saved locations, use the appropriate tool
2. Provide clear, concise responses based on the data retrieved
3. If a tool call is needed, respond with JSON in the format: {"tool": "tool_name", "args": {"param": "value"}}
4. For multiple tool calls, use an array: [{"tool": "tool_name", "args": {...}}, ...]
5. Always respond in a friendly, helpful manner
6. If you need coordinates for weather, ask the user for their saved locations or ask them to search for a location first
7. Keep responses concise but informative`;
}
