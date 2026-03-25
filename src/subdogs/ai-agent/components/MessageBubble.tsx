import type { AiMessage } from '../types';

interface MessageBubbleProps {
  message: AiMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isTool = message.role === 'tool';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : isTool ? 'justify-center' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-br-md'
            : isTool
            ? 'bg-slate-700/50 text-slate-300 text-xs rounded-md px-3 py-2 font-mono'
            : 'bg-slate-800 text-slate-100 rounded-bl-md'
        }`}
      >
        {isTool && message.toolName && (
          <div className="text-xs text-violet-400 mb-1 font-medium">
            Tool: {message.toolName}
          </div>
        )}
        <div className="whitespace-pre-wrap break-words leading-relaxed">
          {message.content}
        </div>
        <div className="text-[10px] opacity-60 mt-1">
          {isUser ? 'You' : isTool ? 'System' : 'AI'}
        </div>
      </div>
    </div>
  );
}
